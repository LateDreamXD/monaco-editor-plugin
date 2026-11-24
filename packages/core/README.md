# LateDreamXD's Monaco Editor Plugin

[![Vite](https://img.shields.io/badge/Vite-8-green?logo=vite)](https://vite.dev/guide/)
[![Vue](https://img.shields.io/badge/Vue-3.5%2B-green?logo=vue.js)](https://vuejs.org/guide/introduction)

<p align="center">

[Docs](https://latedreamxd.github.io/monaco-editor-plugin/) | [Online Demo](https://latedreamxd.github.io/monaco-editor-plugin/demo)
</p>

Zero-config [monaco editor](https://microsoft.github.io/monaco-editor/) Plugin for [Vite](https://vite.dev/guide/)8 and [Vue](https://vuejs.org/guide/introduction)3.5+

## Install
```sh
pnpm add monaco-editor @latedream/monaco-editor-plugin
```

## Usage
### Vite
edit `vite.config.js`/`vite.config.ts`:
```js
import { defineConfig } from 'vite';
import monacoEditorPlugin from '@latedream/monaco-editor-plugin/vite';

export default defineConfig({
  plugins: [monacoEditorPlugin()],
});
```

### Vue
```html
<script setup>
import { CodeEditor } from '@latedream/monaco-editor-plugin/vue';
</script>
<template>
  <CodeEditor />
</template>
```

### Localization
Monaco resolves most of its labels while it is being evaluated, so a language pack has to be loaded **before** `monaco-editor` itself. The vue components import monaco lazily, which makes this work out of the box:

```js
import { createApp } from 'vue';
import { useLocal } from '@latedream/monaco-editor-plugin/vue';
import App from './App.vue';

useLocal('zh-cn');

createApp(App).mount('#app');
```

`useLocal` returns a promise, but there is no need to await it: the editors wait for the pending language pack before monaco is imported.

Supported locales: `cs`, `de`, `es`, `fr`, `it`, `ja`, `ko`, `pl`, `pt-br`, `ru`, `tr`, `zh-cn`, `zh-tw`. English is built in and is the default.

## Alternatives
read [document](https://latedreamxd.github.io/monaco-editor-plugin/other/alternatives)
