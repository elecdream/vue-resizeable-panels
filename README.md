# vue-resizeable-panels

Easily create an dynamic user interface with this VueJS component

- Simple tag syntax
- Flexible nesting allows complex structures 
- Intended to work with Vue.js version 3
- Customizeable inline stylesheet (SASS)
- No Dependencies

![vue-resizeablepanels overview](/doc/assets/vue-resizeable-panels-shot-2.gif)

## Development Setup

```bash
# install deps
npm install

# serve at localhost:8080
npm run serve

# lint 
npm run lint

# lint & run all tests
npm run test
```

## Usage

To use `vue-resizeable-panels` copy folder `src/components/vue-resizeable-panels` to your components folder, import and add it to you component includes:

```vue
import vueResizeablePanels from '@/components/vue-resizeable-panels';

// your Vue component
export default {
  components: { ...vueResizeablePanels, /* additional components */ },
};
```

## Layout

Layout is made simple of nesting `gui-panel` tags:

```vue
<gui-panel>
  <gui-panel> ONE </gui-panel>
  <gui-panel> 
    <gui-panel> TWO </gui-panel>
    <gui-panel> THREE </gui-panel>
  </gui-panel>
</gui-panel>  
```

## Sizing

Every panel's size can be set by `initialWidth` and `initialHeight` using `px`, `%`, `vh` or `vh`

Child panels fill the parents space by default, use percentage settings like e.g. '25%'  to calculate size dynamically

To make the root panel fill up the entire browser window it requires either an parent element with dimension set and size setting to `100%` or an size setting to `100vh` / `100vw` which is based upon window size

```vue
<gui-panel initialWidth="100%" initialHeight="1vh">  
  <gui-panel initialHeight="25%"></gui-panel>
  <gui-panel initialHeight="10%"></gui-panel>
  <gui-panel initialHeight="200px"></gui-panel>
  <gui-panel> <!-- fill remaining space --> </gui-panel> 
</gui-panel>  
```

Set minimal and maximal height of panels using the properties `minWidth`, `minHeight`, `maxWidth`, `maxHeight`

## Orientation

Use the `alignChildren` property to align panels. Possible value can be `horizontal` or `vertical`, which is the default

```vue
<gui-panel alignChildren="horizontal">
  <gui-panel></gui-panel>
  <gui-panel alignChildren="vertical">
    <gui-panel></gui-panel>
    <gui-panel></gui-panel>
    <gui-panel></gui-panel>
  </gui-panel>
  <gui-panel></gui-panel>
</gui-panel>  
```

## Make panels resizeable

Freely place an `gui-divider` tag between gui-panels to create a draggable handle between panels to make them resizeable by the user

```vue
<gui-panel alignChildren="horizontal">
  <gui-panel></gui-panel>
  <gui-divider />
  <gui-panel alignChildren="vertical">
    <gui-panel></gui-panel>
    <gui-divider />
    <gui-panel></gui-panel>
    <gui-divider />
    <gui-panel></gui-panel>
  </gui-panel>
  <gui-divider />
  <gui-panel></gui-panel>
</gui-panel>  
```

## Features / What is left to do

- [x] Vue v.3 support
- [ ] Vue v.2 support
- [x] Panel size calculation
- [x] Min/Max width and height
- [x] Dragable divider
- [x] Refresh on browser window dimension change
- [ ] Dynamically add remove panels
- [ ] fire lifecycle events
- [ ] Save dimensions in browser cache
- [ ] Further code optimization
