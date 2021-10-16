<template>
  <GuiPanel name="rootpanel" class="back" initialWidth="100%" initialHeight="100vh">
    <template v-for="(panel, i) in panels" :key="panel">
      <GuiDivider v-if="i > 0" />
      <GuiPanel ref="panel" :name="'panel-' + panel" :class="{ one: i % 2 }" minHeight="50px">
        <div class="menu-top-right-wrapper">
          <div class="menu-top-right-content"><button>add before</button><button @click="remove(i)">remove X</button><button @click="addAfter(i)">add after</button></div>
        </div>
        <size-info></size-info>
      </GuiPanel>
    </template>
  </GuiPanel>
</template>

<script>
import vueResizeablePanels from '@/components/vue-resizeable-panels';
import { reactive, toRefs } from 'vue';
import SizeInfo from './SizeInfo.vue';

export default {
  components: Object.assign({ ...vueResizeablePanels, SizeInfo }),

  setup() {
    let maxPanelId = 0;
    const state = reactive({ panels: [createPanelId(), createPanelId()] });

    function createPanelId() {
      return maxPanelId++;
    }

    function addBefore(idx) {
      state.panels.splice(idx, 0, createPanelId());
    }

    function addAfter(idx) {
      state.panels.splice(idx + 1, 0, createPanelId());
    }

    function remove(idx) {
      state.panels.splice(idx, 1);
    }

    return { ...toRefs(state), addBefore, addAfter, remove };
  },
};
</script>

<style lang="scss">
.menu-top-right-wrapper {
  position: fixed;
  width: inherit;
  height: inherit;
  font-size: 1rem;
  display: flex;
  justify-content: flex-end;
}

.menu-top-right-content {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
