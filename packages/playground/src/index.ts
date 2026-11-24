import { createApp } from 'vue';
import App from './App.vue';

import { useLocal } from '@latedream/monaco-editor-plugin/vue';

useLocal('zh-cn');

createApp(App).mount('#app');