---
layout: page
---

<script setup>
import { useLocal } from '@latedream/monaco-editor-plugin/vue';
import Demo from './components/Demo.vue';

useLocal((navigator.language || 'en').toLowerCase());
</script>

<Demo />

<style>
.VPPage > div > div {
  height: 100vh;
}
</style>
