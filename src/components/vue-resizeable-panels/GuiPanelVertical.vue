<template>
  <gui-panel ref="elem" alignChildren="0">
    <slot></slot>
  </gui-panel>
</template>

<script>
import GuiPanel from './GuiPanel.vue';

export default {
  components: [GuiPanel],
};
</script>

<style></style>
