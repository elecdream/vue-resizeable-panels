<template>
  <div v-if="show" class="size-info">
    <span :class="{ 'size-info-info': true, changed: this.changedX }">{{ parentWidth }}</span>
    &nbsp;x&nbsp;
    <span :class="{ 'size-info-info': true, changed: this.changedY }">{{ parentHeight }}</span>
  </div>
</template>

<script>
const FADE_DELAY = 600;

export default {
  data: function () {
    return { changedX: false, changedY: false, changedTimerX: null, changedTimerY: null };
  },
  computed: {
    show: function () {
      return (this.$parent.width >= 140) & (this.$parent.height >= 50);
    },
    dimensionInfo: function () {
      return this.$parent.type == 'gui-panel' ? round(this.$parent.width) + ' x ' + round(this.$parent.height) : '';
    },
    parentInfo: function () {
      let info = this.$parent.name != undefined ? this.$parent.name + ' ' : '';
      return info;
    },
    parent: function () {
      return this.$parent;
    },
    parentWidth: function () {
      return round(this.$parent.width);
    },
    parentHeight: function () {
      return round(this.$parent.height);
    },
  },
  watch: {
    parentWidth: function () {
      this.changedX = true;
      window.clearTimeout(this.changedTimerX);
      this.changedTimer = window.setTimeout(() => {
        this.changedX = false;
      }, FADE_DELAY);
    },
    parentHeight: function () {
      this.changedY = true;
      window.clearTimeout(this.changedTimerY);
      this.changedTimer = window.setTimeout(() => {
        this.changedY = false;
      }, FADE_DELAY);
    },
  },
};

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}
function round(num) {
  return +(Math.round(num + 'e+0') + 'e-0');
}
</script>

<style scoped lang="scss">
.size-info {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.size-info-info {
  transition: background-color 0.5s;
  &.changed {
    background: red;
    transition: background-color 0.05s;
  }
}
</style>
