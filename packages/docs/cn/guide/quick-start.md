# 快速开始
## 安装

::: tip **要求**
请确保你的项目用到的依赖项符合以下要求：
- Vite: `^8`
- VitePress: `^2.0.0-alpha.18`
- Vue: `^3.5`

当然，它们都是**可选**的。这意味着你可以只用 Monaco Editor 插件的**一部分**。

如果不符合要求，那就考虑升级依赖项或者使用[替代品](../other/alternatives)。
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

## 使用方法
monaco editor 插件提供了一个零配置的 Vite 插件和两个 Vue 组件。

### Vite
要在 Vite 使用 monaco editor 插件，只需像这样编辑你的 Vite 配置文件：
```ts twoslash [vite.config.ts]
import { defineConfig } from 'vite';
import monacoEditorPlugin from '@latedream/monaco-editor-plugin/vite'; // [!code ++]

export default defineConfig({
  plugins: [monacoEditorPlugin()], // [!code ++]
});
```

### VitePress
要在 VitePress 使用 monaco editor 插件和 Vite 非常类似。
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

在组件中使用：
```vue twoslash [App.vue]
<script setup lang="ts">
import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';
</script>
<template>
  <CodeEditor theme="vs-dark" value="Hello, monaco-editor!" />
  <DiffEditor theme="vs-dark" original="Hello, monaco-editor!" modified="Hello, monaco editor plugin!" />
</template>
```

它会被这样渲染：
<CodeEditor theme="vs-dark" height="200px" value="Hello, monaco-editor!" /><br />
<DiffEditor theme="vs-dark" height="200px" original="Hello, monaco-editor!" modified="Hello, monaco editor plugin!" />

::: tip **全局组件**
你也可以注册全局组件。

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
