<template>
  <div ref="elem" :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
import { guiElementMixin } from './mixins/guiElementMixin';

export default {
  mixins: [guiElementMixin],
  name: 'gui-panel',
  computed: {},
};
</script>

<style lang="scss">
$text_color_primary: rgb(124, 139, 190);
$text_background: rgb(37, 43, 61);
$grey: #e8e8e8;
// $panel_border: 1px solid $grey;
$panel_border: none;

.gui-panel {
  // overflow: hidden;

  margin: 0;
  padding: 0;
  // background: rgb(34, 48, 75);

  &.vertical {
    // background: rgba(#99ffff, 0.5);

    & > div.gui-panel + div {
      border-top: $panel_border;
    }
  }

  &.horizontal {
    // background: rgba(#ff99ff, 0.5);
    height: 100%;
    display: flex;
    flex-flow: row, flex-start;

    & > div.gui-panel + div {
      border-left: $panel_border;
    }

    // & > * {
    //   display: block;
    // }
  }
}
</style>
