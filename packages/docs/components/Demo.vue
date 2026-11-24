<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';
import { type editor } from 'monaco-editor';

const showDiff = ref(false);
const editorOptions = ref<editor.IStandaloneEditorConstructionOptions>({});
const language = ref<string>();
const value = ref<string>('');
const modifiedLanguage = ref<string>();
const modifiedValue = ref<string>('');
const theme = computed(() =>
	`vs-${matchMedia('(prefers-color-scheme: dark)').matches? 'dark': 'light'}`
);

type DemoItem = {
	language: string,
	value: string,
	modifiedValue: string
}

const demos: DemoItem[] = [
	{ language: 'markdown', value: '# Hello, world!', modifiedValue: '# Hello, vue!' },
	{ language: 'javascript', value: 'console.log("Hello, world!");', modifiedValue: 'console.log("Hello, vue!");' },
	{ language: 'html', value: '<p>Hello, world!</p>', modifiedValue: '<p>Hello, vue!</p>' }
];

const loadDemo = (demo: DemoItem) => {
	language.value = demo.language;
	value.value = demo.value;
	modifiedLanguage.value = demo.language;
	modifiedValue.value = demo.modifiedValue;
}

onMounted(() => {
	document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
	document.body.style.overflow = '';
});
</script>

<template>
	<div class="control-panel">
		value: <pre>{{ value }}</pre>
		<div class="actions">
			<label><input type="checkbox" v-model="showDiff" /> show diff</label>
			<button v-for="demo in demos" @click="loadDemo(demo)">{{ demo.language }}</button>
		</div>
	</div>
	<CodeEditor v-if="!showDiff" :theme="theme" :language="language" v-model:value="value" :options="editorOptions" />
	<DiffEditor v-else :theme="theme" :original-language="language" v-model:original="value" :modified-language="language" v-model:modified="modifiedValue" :options="editorOptions" />
</template>

<style scoped>
.control-panel {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: 100;
	padding: 8px;
	background-color: var(--vp-c-default-1);
	border: 1px solid var(--vp-c-default-2);
	border-radius: 8px;
}

.actions {
	display: flex;
	gap: 8px;
}
.actions>button:hover {
	color: var(--vp-c-brand-1);
	transition: color ease 0.3s;
}
</style>