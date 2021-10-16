<template>
  <div ref="elem" :class="classes" @mousedown="dragStart" @mouseover="mouseOver" @mouseout="mouseOut">
    <slot></slot>
  </div>
</template>

<script>
import { DIRECTION_HORIZ, DIRECTION_VERT, guiElementMixin, inRange } from './mixins/guiElementMixin';
import { defer } from './lib/timeutils';

export default {
  mixins: [guiElementMixin],
  name: 'gui-divider',
  props: {},
  data: () => ({
    sizes_left: [],
    sizes_right: [],
    hovered: false,
    dragging: false,
  }),
  computed: {
    classes: function () {
      return { ...this.classesBase, dragging: this.dragging, hovered: this.hovered };
    },
  },
  mounted: function () {
    let this_elem = this.$.vnode.el;
    let parents_children = [];

    for (let el of this.$.parent.vnode.el.children) {
      if (el.classList.contains('gui-panel') || el.classList.contains('gui-divider')) {
        parents_children.push(el);
      }
    }

    for (let i = 0; i < parents_children.length; i++) {
      if (this_elem == parents_children[i]) {
        if (i > 0) {
          this.left_elem_id = parents_children[i - 1].id;
        }
        if (i < parents_children.length - 1) {
          this.right_elem_id = parents_children[i + 1].id;
        }
        break;
      }
    }
  },
  methods: {
    mouseOver(e) {
      this.mouseover = true;
      defer(
        function hover() {
          this.hovered = this.mouseover;
        }.bind(this),
        180
      );
    },
    mouseOut(e) {
      this.mouseover = false;
      this.hovered = false;
    },
    dragStart(e) {
      e.preventDefault();
      e.stopPropagation();

      let self = this;
      self.dragging = true;
      self.clientX = e.clientX;
      self.clientY = e.clientY;

      let left_max_shrink = 0;
      let left_max_expand = 0;
      let right_max_shrink = 0;
      let right_max_expand = 0;

      if (this.direction == DIRECTION_HORIZ) {
        for (let i = 0; i < this.left_comps.length; i++) {
          left_max_shrink += this.left_comps[i].ctx.widthMaxShrink();
        }
        for (let i = 0; i < this.left_comps.length; i++) {
          left_max_expand += this.left_comps[i].ctx.widthMaxExpand();
        }
        for (let i = 0; i < this.right_comps.length; i++) {
          right_max_shrink += this.right_comps[i].ctx.widthMaxShrink();
        }
        for (let i = 0; i < this.right_comps.length; i++) {
          right_max_expand += this.right_comps[i].ctx.widthMaxExpand();
        }
      }

      if (this.direction == DIRECTION_VERT) {
        for (let i = 0; i < this.left_comps.length; i++) {
          left_max_shrink += this.left_comps[i].ctx.heightMaxShrink();
        }
        for (let i = 0; i < this.left_comps.length; i++) {
          left_max_expand += this.left_comps[i].ctx.heightMaxExpand();
        }
        for (let i = 0; i < this.right_comps.length; i++) {
          right_max_shrink += this.right_comps[i].ctx.heightMaxShrink();
        }
        for (let i = 0; i < this.right_comps.length; i++) {
          right_max_expand += this.right_comps[i].ctx.heightMaxExpand();
        }
      }

      let sizes_left = self.left_comps.map((v, i) => {
        return { width: v.data.width, height: v.data.height };
      });
      let sizes_right = self.right_comps.map((v, i) => {
        return { width: v.data.width, height: v.data.height };
      });

      function mousemoveHandler(e) {
        if (self.dragging) {
          e.preventDefault();
          e.stopPropagation();
          let dx = e.clientX - self.clientX;
          let dy = e.clientY - self.clientY;

          if (self.direction == DIRECTION_HORIZ) {
            if (dx >= 0) dx = inRange(dx, 0, Math.min(left_max_expand, right_max_shrink));
            // go left
            let adjust_left = dx;
            for (let id = 0; id < self.left_comps.length; id++) {
              adjust_left = -self.left_comps[id].ctx.setWidth(sizes_left[id].width + adjust_left, true);
            }

            let adjust_right = -dx + adjust_left;
            // go right + fill
            for (let id = 0; id < self.right_comps.length; id++) {
              adjust_right = -self.right_comps[id].ctx.setWidth(sizes_right[id].width + adjust_right, true);
            }
          } else if (self.direction == DIRECTION_VERT) {
            if (dy >= 0) dy = inRange(dy, 0, Math.min(left_max_expand, right_max_shrink));
            // go left
            let adjust_left = dy;
            for (let id = 0; id < self.left_comps.length; id++) {
              adjust_left = -self.left_comps[id].ctx.setHeight(sizes_left[id].height + adjust_left, true);
            }

            let adjust_right = -dy + adjust_left;
            // go right + fill
            for (let id = 0; id < self.right_comps.length; id++) {
              adjust_right = -self.right_comps[id].ctx.setHeight(sizes_right[id].height + adjust_right, true);
            }
          }
        }
      }

      function mouseupHandler() {
        document.removeEventListener('mouseup', mouseupHandler);
        document.removeEventListener('mousemove', mousemoveHandler);

        if (self.dragging) {
          e.preventDefault();
          e.stopPropagation();
          self.dragging = false;
        }
      }

      document.addEventListener('mouseup', mouseupHandler);
      document.addEventListener('mousemove', mousemoveHandler);

      self.dragging = true;
    },
  },
};
</script>

<style lang="scss">
@use 'sass:math';
$divider_width: 4px;
$divider_color: #ffffff;
$divider_color_normal: rgba($divider_color, 0);
$divider_color_hover: rgba($divider_color, 1);
.gui-divider {
  transition: background, 180ms;
  background: $divider_color_normal;
  position: relative;
  &.hovered,
  &.dragging {
    background: $divider_color_hover;
  }
  &.horizontal {
    cursor: ew-resize;
    &:before {
      content: '';
      background: inherit;
      width: $divider_width;
      height: 100%;
      position: absolute;
      left: math.div(-$divider_width, 2);
      top: 0;
    }
  }
  &.vertical {
    cursor: ns-resize;
    &:before {
      content: '';
      background: inherit;
      width: 100%;
      height: $divider_width;
      position: absolute;
      top: math.div(-$divider_width, 2);
      left: 0;
    }
  }
}
</style>
