<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor, DiffEditor } from '@latedream/monaco-editor-plugin/vue';
import { type editor } from 'monaco-editor';

const showDiff = ref(false);
const editorOptions = ref<editor.IStandaloneEditorConstructionOptions>({});
const language = ref<string>();
const value = ref<string>('');
const modifiedLanguage = ref<string>();
const modifiedValue = ref<string>('');

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
</script>

<template>
	<div class="control-panel">
		<label><input type="checkbox" v-model="showDiff" /> show diff</label>
		<button v-for="demo in demos" @click="loadDemo(demo)">{{ demo.language }}</button>
	</div>
	<CodeEditor v-if="!showDiff" :language="language" v-model:value="value" :options="editorOptions" />
	<DiffEditor v-else :original-language="language" v-model:original="value" :modified-language="language" v-model:modified="modifiedValue" :options="editorOptions" />
</template>

<style>
.control-panel {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: 100;
}
</style>