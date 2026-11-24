# Quick Start
## Install

::: tip **Requirements**
Please make sure dependencies of your project meets the following requirements:
- Vite: `^8`
- VitePress: `^2.0.0-alpha.18`
- Vue: `^3.5`

Of course, they're **optional**. Witch means you can use **a part of** Monaco Editor Plugin only.

If it doesn't meet the requirements, please consider updating dependencies or using [alternatives](../other/alternatives).
:::

::: code-group

```sh [npm]
$ npm install monaco-editor @latedream/monaco-editor-plugin
```

```sh [pnpm]
$ pnpm add monaco-editor @latedream/monaco-editor-plugin
```

```sh [yarn]
$ yarn add monaco-editor @latedream/monaco-editor-plugin
```

```sh [bun]
$ bun add monaco-editor @latedream/monaco-editor-plugin
```

:::

## Usage
monaco editor plugin provide a zero-config Vite plugin and two Vue components.

### Vite
To use monaco editor plugin with Vite, just edit your Vite config file like this:
```ts twoslash [vite.config.ts]
import { defineConfig } from 'vite';
import monacoEditorPlugin from '@latedream/monaco-editor-plugin/vite'; // [!code ++]

export default defineConfig({
  plugins: [monacoEditorPlugin()], // [!code ++]
});
```

### VitePress
To use Monaco Editor Plugin with VitePress is very similar of Vite.
```ts twoslash [.vitepress/config.ts]
import { defineConfig } from 'vitepress';
import monacoEditorPlugin from '@latedream/monaco-editor-plugin/vite'; // [!code ++]

export default defineConfig({
  vite: {
    plugins: [monacoEditorPlugin()], // [!code ++]
  },
});
```

### Vue
<script setup>
import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';
</script>

Use in components:
```vue twoslash [App.vue]
<script setup lang="ts">
import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';
</script>
<template>
  <CodeEditor theme="vs-dark" value="Hello, monaco-editor!" />
  <DiffEditor theme="vs-dark" original="Hello, monaco-editor!" modified="Hello, monaco editor plugin!" />
</template>
```

It will be render as:
<CodeEditor theme="vs-dark" height="200px" value="Hello, monaco-editor!" /><br />
<DiffEditor theme="vs-dark" height="200px" original="Hello, monaco-editor!" modified="Hello, monaco editor plugin!" />

::: tip **Global Component**
You can also register to global component.

```ts twoslash [main.ts]
import { createApp } from 'vue';
// ---cut-start---
// @ts-ignore
// ---cut-end---
import App from './App.vue';

import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';

const app = createApp(App);
app.component('CodeEditor', CodeEditor);
app.component('DiffEditor', DiffEditor);
app.mount('#app');
```
:::
