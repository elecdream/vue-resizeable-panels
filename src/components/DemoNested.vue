<template>
  <GuiPanel name="rootpanel" class="back" initialWidth="100%" initialHeight="100vh" minHeight="100px" alignChildren="vertical">
    <GuiPanel name="panel-top" class="one" minHeight="50px">
      <size-info></size-info>
    </GuiPanel>
    <GuiDivider />
    <GuiPanel name="panel-group-middle" minHeight="50px" initialHeight="10%" alignChildren="horizontal">
      <GuiPanel name="panel-middle-left" class="two" minWidth="50px"><size-info></size-info></GuiPanel>
      <GuiDivider />
      <GuiPanel name="panel-middle-right" class="three" minWidth="50px"><size-info></size-info></GuiPanel>
    </GuiPanel>
    <GuiDivider />
    <GuiPanel name="panel-group-bottom" class="four" minHeight="50px" alignChildren="horizontal">
      <GuiPanel name="panel-bottom-left" class="five" minWidth="50px"><size-info></size-info></GuiPanel>
      <GuiDivider />
      <GuiPanel name="panel-bottom-middle" class="six" minWidth="50px"><size-info></size-info></GuiPanel>
      <GuiDivider />
      <GuiPanel name="panel-bottom-right" class="seven" minWidth="50px"><size-info></size-info></GuiPanel>
    </GuiPanel>
  </GuiPanel>
</template>

<script>
import vueResizeablePanels from '@/components/vue-resizeable-panels';
import sizeInfo from '@/components/SizeInfo.vue';

export default {
  components: { ...vueResizeablePanels, sizeInfo },
};
</script>
