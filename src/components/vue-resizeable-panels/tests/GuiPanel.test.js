import { mount } from '@vue/test-utils'
import GuiPanel from '@/components/vue-resizeable-panels/GuiPanel.vue'
import GuiDivider from '@/components/vue-resizeable-panels/GuiDivider.vue'

let opts;


beforeEach(() => {
  document.body.innerHTML = `
  <div>
    <div id="app" style="width: 700px; height: 1000px"></div>
  </div>`
  // TODO: setting root element size don't work

  opts = {
    global: {
      components: { GuiPanel, GuiDivider },
    },
    attachTo: document.getElementById('app')
  }
})


test('creates a basic root panel with fixed width/height', async () => {
  const wrapper = mount({
    template: `<GuiPanel ref="rootpanel" name="rootpanel" initialWidth="100px" initialHeight="200px">Hellow</GuiPanel>`,
  }, opts);

  let rootpanel = wrapper.getComponent({ ref: "rootpanel" }).componentVM;

  await nextTick();

  expect(rootpanel.name).toBe('rootpanel');
  expect(rootpanel.initialWidth).toBe('100px');
  expect(rootpanel.initialHeight).toBe('200px');
  expect(rootpanel.minWidth).toBe(undefined);
  expect(rootpanel.maxWidth).toBe(undefined);
  expect(rootpanel.minHeight).toBe(undefined);
  expect(rootpanel.maxHeight).toBe(undefined);
  expect(rootpanel.type).toBe('gui-panel');
  expect(rootpanel.uid).toBe(0);
  expect(rootpanel.children).toHaveLength(0);
  expect(rootpanel.has_children).toBe(false);
  expect(rootpanel.is_root).toBe(true);
  expect(rootpanel.componentName).toBe('gui-panel');
  expect(rootpanel.direction).toBe(0);
  expect(rootpanel.width).toBe(100);
  expect(rootpanel.height).toBe(200);
})

test('creates nested panels with computed dimensions', async () => {
  const wrapper = mount({
    template:
      `<GuiPanel ref="rootpanel" name="rootpanel" initialWidth="1000px" initialHeight="600px">
        <GuiPanel ref="panel2" name="panel2" initialWidth="50%" initialHeight="20%"></GuiPanel>
        <GuiPanel ref="panel3" name="panel3" initialWidth="80%" initialHeight="25%"></GuiPanel>
        <GuiPanel ref="panel4" name="panel4"></GuiPanel>
      </GuiPanel>`,
  }, opts);

  let rootpanel = wrapper.getComponent({ ref: "rootpanel" }).componentVM;
  let panel2 = wrapper.getComponent({ ref: "panel2" }).componentVM;
  let panel3 = wrapper.getComponent({ ref: "panel3" }).componentVM;
  let panel4 = wrapper.getComponent({ ref: "panel4" }).componentVM;

  await nextTick();

  expect(rootpanel.has_children).toBe(true);
  expect(rootpanel.is_root).toBe(true);
  expect(rootpanel.direction).toBe(0);
  expect(rootpanel.width).toBe(1000);
  expect(rootpanel.height).toBe(600);

  expect(panel2.has_children).toBe(false);
  expect(panel2.is_root).toBe(false);
  expect(panel2.direction).toBe(0);
  expect(panel2.width).toBe(500);
  expect(panel2.height).toBe(120);

  expect(panel3.has_children).toBe(false);
  expect(panel3.is_root).toBe(false);
  expect(panel3.direction).toBe(0);
  expect(panel3.width).toBe(800);
  expect(panel3.height).toBe(150);

  expect(panel4.has_children).toBe(false);
  expect(panel4.is_root).toBe(false);
  expect(panel4.direction).toBe(0);
  expect(panel4.width).toBe(1000);
  expect(panel4.height).toBe(330);
})

test('setHeight', async () => {
  const wrapper = mount({
    template:
      `<GuiPanel ref="rootpanel" initialWidth="1000px" initialHeight="600px" maxWidth="300px" maxHeight="400px"></GuiPanel>`,
  }, opts);

  let rootpanel = wrapper.getComponent({ ref: "rootpanel" }).componentVM;

  await nextTick();
  expect(rootpanel.width).toBe(300);
  expect(rootpanel.height).toBe(400);
})


test('creates nested panels with computed dimensions', async () => {
  const wrapper = mount({
    template:
      `<GuiPanel ref="rootpanel" initialWidth="1000px" initialHeight="600px">
        <GuiPanel ref="panel2"></GuiPanel>
        <GuiDivider ref="divider"></GuiDivider>
        <GuiPanel ref="panel3"></GuiPanel>
      </GuiPanel>`,
  }, opts);

  let rootpanel = wrapper.getComponent({ ref: "rootpanel" }).componentVM;
  let panel2 = wrapper.getComponent({ ref: "panel2" }).componentVM;
  let panel3 = wrapper.getComponent({ ref: "panel3" }).componentVM;

  await nextTick();
  expect(panel2.width).toBe(1000);
  expect(panel2.height).toBe(300);

  expect(panel3.width).toBe(1000);
  expect(panel3.height).toBe(300);
})

// Helper

async function nextTick() {
  await new Promise(res => setTimeout(res, 0))
}

function logData(_data) {
  let keys = Object.keys(_data);
  let data = {}
  for (let key of keys) {
    data[key] = _data[key];
  }
  return data;
}
