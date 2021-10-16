import generateUid from '../lib/uid';
import { getChildVueNodes } from '../lib/vueutils';
import { throttle } from '../lib/timeutils';
import { vue } from 'vue'


export const DIRECTION_VERT = 0;
export const DIRECTION_HORIZ = 1;
export const DIRECTION_UNKNOWN = -1;

const GUI_CHILD_TYPES = ['gui-panel', "gui-divider"]

const guiElementMixin = {
  props: {
    name: String, initialWidth: String, initialHeight: String, minWidth: String, maxWidth: String, minHeight: String, maxHeight: String, initialSize: String, alignChildren: String, cls: String
  },
  data: function () {
    return {
      type: this.$.type.name,
      uid: this.id !== undefined ? this.id : generateUid(),
      children: [],

      is_root: false,
      align_children: { 0: DIRECTION_VERT, 1: DIRECTION_HORIZ, 'vertical': DIRECTION_VERT, 'horizontal': DIRECTION_HORIZ }[(this.alignChildren || "").toLowerCase()],
      inherited_direction: DIRECTION_VERT,
      size_adjust: 0,
      size_adjust_temp: 0,

      width: undefined,
      height: undefined,

      width_adjusted: false,
      height_adjusted: false,
      left_comps: [],
      right_comps: [],
    }
  },
  computed: {
    componentName: function () {
      return this.$.type.name;
    },
    direction: function () {
      if (this.align_children !== undefined) return this.align_children;
      if (this.inherited_direction !== undefined) return this.inherited_direction;
      return DIRECTION_VERT;
    },
    elementSize: function () {
      return this.sizePx + this.size_adjust;
    },
    has_children: function () {
      return this.children.length > 0;
    },
    min_width_children: function () {
      return this.children.reduce((sum, child) => sum + child.ctx.min_width, 0)
    },
    min_height_children: function () {
      return this.children.reduce((sum, child) => sum + child.ctx.min_height, 0)
    },
    min_width: function () {
      let min_width = parseInt(this.minWidth == undefined ? 0 : this.minWidth)
      let min_width_children = this.min_width_children;
      return Math.max(min_width, min_width_children);
    },
    min_height: function () {
      let min_height = parseInt(this.minHeight == undefined ? 0 : this.minHeight)
      let min_height_children = this.min_height_children;
      return Math.max(min_height, min_height_children);
    },
    max_width: function () {
      return parseInt(this.maxWidth == undefined ? 999999 : this.maxWidth);
    },
    max_height: function () {
      return parseInt(this.maxHeight == undefined ? 999999 : this.maxHeight);
    },
    styles: function () {
      let width = this.width + (this.inherited_direction == DIRECTION_HORIZ ? this.size_adjust + this.size_adjust_temp : 0);
      let height = this.height + (this.inherited_direction == DIRECTION_VERT ? this.size_adjust + this.size_adjust_temp : 0);

      return {
        width: width + 'px', height: height + 'px', 'min-width': this.min_width + 'px', 'min-height': this.min_height + 'px'
      }
    },
    classesBase: function () {
      return {
        'vertical': this.direction == 0, 'horizontal': this.direction == 1, [this.type]: true, 'root': this.is_root
      }
    },
    classes: function () {
      return { ...this.classesBase }
    }
  },
  watch: {
    width: function () {
      this.updateChildren();
    },
    height: function () {
      this.updateChildren();
    },
    size_adjust: function () {
      this.updateChildren();
    },
    size_adjust_temp: function () {
      this.updateChildren();
    },

  },
  methods: {

    setChildren: function (children) {

      this.children = children;

      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        // reset
        child.data.height = undefined;
        child.data.width = undefined;

        // align
        child.data.inherited_direction = this.direction;
        child.data.left_comps = [];
        child.data.right_comps = [];

        // get sibling components
        for (let j = i - 1; j > -1; j--) {
          if (children[j].data.type != 'gui-divider') {
            child.data.left_comps.push(children[j]);
          }
        }

        for (let j = i + 1; j < children.length; j++) {
          if (children[j].data.type != 'gui-divider') {
            child.data.right_comps.push(children[j]);
          }
        }
      }

      this.updateChildren();

    },
    updateChildren: function () {
      this.invalidated = true;
      let self = this;
      self.$nextTick(() => {
        if (self.invalidated) {
          self.invalidated = false;

          if (self.has_children) {

            // align
            let parent_size = (self.direction == DIRECTION_VERT ? self.height : self.width);
            let parent_size_cross = (self.direction == DIRECTION_VERT ? self.width : self.height);

            let initial, size, size_min, size_max, adjusted = false, factor;

            let panel_children = self.children.filter((child) => {
              return child.data.type == 'gui-panel';
            })

            let child_infos = panel_children.map((child, i) => {

              let child_info = {}

              if (self.direction == DIRECTION_VERT) {
                initial = child.props.initialHeight;
                adjusted = child.data.height_adjusted;
                size = child.data.height;
                size_min = child.ctx.min_height;
                size_max = child.ctx.max_height;
              }

              else {
                initial = child.props.initialWidth;
                adjusted = child.data.width_adjusted;
                size = child.data.width;
                size_min = child.ctx.min_width;
                size_max = child.ctx.max_width;
              }

              Object.assign(child_info, {
                initial, size, size_min, size_max, adjusted, factor, child
              })

              return child_info;

            });

            let calced_infos = calcSizes(parent_size, child_infos);

            if (self.direction == DIRECTION_VERT) {
              for (let i = 0; i < calced_infos.length; i++) {
                let info = calced_infos[i];
                info.child.ctx.setWidth(translateCssDimension(info.child.props.initialWidth, parent_size_cross) || parent_size_cross);
                info.child.ctx.setHeight(info.size);
              }
            } else {
              for (let i = 0; i < calced_infos.length; i++) {
                let info = calced_infos[i];
                info.child.ctx.setHeight(translateCssDimension(info.child.props.initialHeight, parent_size_cross) || parent_size_cross);
                info.child.ctx.setWidth(info.size);
              }
            }

          } else {
            // nothing for now
          }
        }
      });
    },
    widthMaxShrink: function () {
      let childWidthMaxShrink = this.direction == DIRECTION_HORIZ ? this.children.reduce((sum, child) => {
        return child.data.type == 'gui-panel' ? sum + child.ctx.widthMaxShrink() : sum;
      }, 0) : this.children.reduce((min, child) => {
        return child.data.type == 'gui-panel' ? Math.min(min, child.ctx.widthMaxShrink()) : min;
      }, 999999)

      let res = childWidthMaxShrink > 0 ? Math.min(this.width - this.min_width, childWidthMaxShrink) : this.width - this.min_width;
      return res;
    },
    widthMaxExpand: function () {
      return this.max_width - this.width;
    },
    heightMaxShrink: function () {
      let childHeightMaxShrink = this.direction == DIRECTION_VERT ? this.children.reduce((sum, child) => {
        return child.data.type == 'gui-panel' ? sum + child.ctx.heightMaxShrink() : sum;
      }, 0) : this.children.reduce((min, child) => {
        return child.data.type == 'gui-panel' ? Math.min(min, child.ctx.heightMaxShrink()) : min;
      }, 999999);

      let res = childHeightMaxShrink > 0 ? Math.min(this.height - this.min_height, childHeightMaxShrink) : this.height - this.min_height;
      return res;
    },
    heightMaxExpand: function () {
      return this.max_height - this.height;
    },
    setWidth: function (width, adjusted = false) {
      this.width = inRange(width, this.min_width, this.max_width);
      this.width_adjusted = adjusted;
      return this.width - width;
    },
    setHeight: function (height, adjusted = false) {
      this.height = inRange(height, this.min_height, this.max_height);
      this.height_adjusted = adjusted;
      return this.height - height;
    },
    adjustSize: function (dx) {
      this.size_adjust_temp = dx;
    },
    adjustSizeDone: function (dx) {
      this.size_adjust += dx;
      this.size_adjust_temp = 0;
    },
    resizeComponent() {

      if (this.is_root) {
        let parentElem = this.$refs.elem.parentElement;
        this.height = inRange(translateCssDimension(this.initialHeight, parentElem.clientHeight), this.min_height, this.max_height);
        this.width = inRange(translateCssDimension(this.initialWidth, parentElem.clientWidth), this.min_width, this.max_width);
      }
    },
    initComponent: function () {
      let self = this;

      function parentResizeHandler(ev) {
        throttle(() => {
          self.resizeComponent();
        })
      }

      let parentResizeHandlerThis = parentResizeHandler.bind(self);

      self.$nextTick(function () {

        if (self.$refs.elem == null) return;

        self.$refs.elem.setAttribute("data-comp", self.type) // my childs
        self.$refs.elem.setAttribute("data-name", self.name)


        let childComponents = getChildVueNodes(self).filter((child) => { return GUI_CHILD_TYPES.indexOf(child.data.type) > -1 });

        if (childComponents.length) {
          self.setChildren(childComponents);
        }

        for (let comp of childComponents) {
          if (comp.ctx.setParent != undefined) {
            comp.ctx.setParent(self)
          }
        }

        // am i root?
        if (self.$.parent.data.type == undefined) {
          self.is_root = true;

          self.resizeComponent();

          window.removeEventListener('resize', parentResizeHandlerThis);
          window.addEventListener('resize', parentResizeHandlerThis);
        }
      });
    },
    updateParent() {
      // if (this.$parent != undefined && this.$parent.initComponent != undefined) {
      //   this.$parent.initComponent();
      // }
    }
  },
  created: function () { },
  mounted: function () {
    this.initComponent();
  },
  unmounted: function () {
    // this.updateParent();
  }
}

export {
  guiElementMixin
}

export function translateCssDimension(value, px) {
  if (value == undefined) return undefined;

  if (isNaN(value)) {
    if (value.indexOf('%') > 0) {
      value = Math.round(value.split('%')[0] / 100 * px);
    }

    else if (value.indexOf('px') > 0) {
      value = Math.round(value.split('px')[0]);
    }

    else if (value.indexOf('vh') > 0) {
      value = Math.round(value.split('vh')[0] / 100 * document.body.clientHeight);
    }

    else if (value.indexOf('vw') > 0) {
      value = Math.round(value.split('vw')[0] / 100 * document.body.clientWidth);
    }
  }

  return value;
}

function isSizeUndefined(size) {
  // return size == undefined;
  return (size == undefined || size == '*' || size == 'auto');
}

export const inRange = (v, min, max) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

export function calcSizes(parent_size, child_infos) {

  let calced_infos = child_infos;

  if (parent_size == undefined) return child_infos;

  // first round?
  if (child_infos.filter((info) => { return isSizeUndefined(info.size) }).length > 0) {
    // initial

    // apply initial sizes
    calced_infos = calced_infos.map((info) => {
      if (info.size == undefined) {
        let pre_size = translateCssDimension(info.initial, parent_size);
        pre_size = inRange(pre_size, info.size_min, info.size_max)
        info.size = pre_size;
      }
      return info;
    });

    let closed_childs = child_infos.filter((info) => { return !isSizeUndefined(info.size) });
    let closed_childs_size = closed_childs.reduce((sum, info) => sum + info.size, 0);
    let open_childs = child_infos.filter((info) => { return isSizeUndefined(info.size) });

    let sum_left = parent_size - closed_childs_size;

    // distribute initial

    let part_left = sum_left / open_childs.length;

    let diffs = [];

    let zero_diff_childs = [];

    for (let info of open_childs) {

      let size = inRange(part_left, info.size_min, info.size_max);
      let diff = part_left - size;
      diffs.push({ size, diff: diff })

      info.size = size;

      if (diff == 0) {
        zero_diff_childs.push(info);
      }
    }

    let sum_diffs = diffs.reduce((sum, v) => { return sum + v.diff }, 0)

    if (zero_diff_childs.length > 0) {
      let part_diff = sum_diffs / zero_diff_childs.length;

      zero_diff_childs.map((info) => {
        info.size += part_diff;
        return info;
      });

    }
    // end distribute initial

    // end initial
  } else {
    // adjust (every child has a size which needs to get adjusted)
    let childs_size_sum = child_infos.reduce((sum, info) => sum + info.size, 0);
    let adjust_size = parent_size - childs_size_sum;

    // calc factors
    child_infos.map((info) => {
      info.factor = info.size / childs_size_sum;
    });

    // distribute adjust
    let diffs = [];

    let zero_diff_childs = [];

    for (let info of child_infos) {

      let nu_size = info.size + adjust_size * info.factor;

      let size = inRange(nu_size, info.size_min, info.size_max);
      let diff = nu_size - size;
      diffs.push({ size, diff: diff })

      info.size = size;

      if (diff == 0) {
        zero_diff_childs.push(info);
      }
    }
    // TODO: check min/max

    let sum_diffs = diffs.reduce((sum, v) => { return sum + v.diff }, 0)

    if (zero_diff_childs.length > 0) {
      let part_diff = sum_diffs / zero_diff_childs.length;

      zero_diff_childs.map((info) => {
        info.size += part_diff;
        return info;
      });

    }
    // end distribute adjust
  }

  return calced_infos;
}

let vueVersion
let vueVersionInfo

export const getVueVersion = () => {
  if (vueVersion !== undefined) return vueVersion; // cache
  let v = require('vue');
  if ('default' in v && 'version' in v.default) vueVersion = v.default.version;
  else if ('version' in v) vueVersion = v.version;
  //
  vueVersionInfo = vueVersion.split('.');
  //
  return vueVersion;
}

export const getVueVersionInfo = () => {
  getVueVersion();
  return vueVersionInfo;
}

export const getVueVersionMajor = () => getVueVersionInfo()[0];

export const isVue2 = () => getVueVersionMajor() == 2

console.log(getVueVersion());
console.log(getVueVersionInfo());
console.log(getVueVersionMajor());
