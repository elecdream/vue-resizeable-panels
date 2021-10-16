<template>
  <DemoNested v-if="pageIdx == 'nested'" />
  <DemoDynamic v-if="pageIdx == 'dynamic'" />

  <div v-if="false" ref="menu" class="bottom-left-menu">
    <button @click="select('nested')">nested</button>
    <button @click="select('dynamic')">dynamic</button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import DemoNested from '@/components/DemoNested.vue';
import DemoDynamic from '@/components/DemoDynamic.vue';

export default {
  components: Object.assign({ DemoNested, DemoDynamic }),

  setup() {
    const vars = reactive({
      pageIdx: 'nested',
    });

    const select = function (idx) {
      vars.pageIdx = idx;
    };
    return { ...toRefs(vars), select };
  },
};
</script>

<style lang="scss">
@charset "UTF-8";
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
:root {
  background: -webkit-linear-gradient(top, #222838 0%, #131621 100%);
  height: 100vh;
}

body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
  background: green;
  font-family: 'Roboto';
  background: white;
  color: white;
  font-size: 2rem;
}

.back {
  background: #818181;
}

.one {
  background: #ff499e;
}

.two {
  background: #d264b6;
}

.three {
  background: #a480cf;
}

.four {
  background: #779be7;
}

.five {
  background: #49b6ff;
}

.six {
  background: #825cd8;
}

.seven {
  background: #5cd8ce;
}

.eight {
  background: #5cd890;
}

.bottom-left-menu {
  position: fixed;
  left: 0px;
  bottom: 0px;
}
</style>
