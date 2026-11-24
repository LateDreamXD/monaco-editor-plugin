<script setup lang="ts">
import { type CSSProperties, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import type * as Monaco from 'monaco-editor';
import { type IMonacoCodeEditorProps } from './types';
import { loadMonaco } from './monaco';

type MonacoModule = typeof import('monaco-editor');

const props = withDefaults(defineProps<IMonacoCodeEditorProps>(), {
	width: '100%',
	height: '100%'
});

const emits = defineEmits<{
	/** emitted once the editor instance has been created */
	ready: [instance: Monaco.editor.IStandaloneCodeEditor];
}>();

const valueModel = defineModel<string>('value');

const isEditorReady = ref(false);
const codeEditorInstance = shallowRef<Monaco.editor.IStandaloneCodeEditor>();
const codeEditorContainer = useTemplateRef<HTMLDivElement>('codeEditorContainer');

let monaco: MonacoModule | undefined;
let isUnmounted = false;

const containerStyle: CSSProperties = {
	position: 'relative'
};

const loadingTipStyle: CSSProperties = {
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};

/**
 * `value` / `language` / `theme` are controlled by their own props,
 * so they are removed from `options` to keep a single source of truth.
 */
const getEditorOptions = () => {
	const { value: _value, language: _language, theme: _theme, ...options } = props.options ?? {};
	return options;
};

const setEditorValue = (value?: string) => {
	const model = codeEditorInstance.value?.getModel();
	if (!model) return;

	const nextValue = value ?? '';
	if (model.getValue() === nextValue) return;

	model.setValue(nextValue);
};

const createEditor = async () => {
	const container = codeEditorContainer.value;
	if (!container) return;

	try {
		// monaco has to be imported after the language pack (see `useLocal`)
		monaco = await loadMonaco();
		if (isUnmounted) return;

		const instance = monaco.editor.create(container, {
			// follow the size of the container by default
			automaticLayout: true,
			...getEditorOptions(),
			value: valueModel.value ?? '',
			language: props.language,
			theme: props.theme
		});

		codeEditorInstance.value = instance;

		instance.onDidChangeModelContent(() => {
			const value = instance.getValue();
			if (value !== valueModel.value) valueModel.value = value;
		});

		isEditorReady.value = true;
		emits('ready', instance);

		void nextTick(() => instance.layout());
	} catch (error) {
		console.error('[monaco-editor-plugin] failed to create the code editor:', error);
	}
};

onMounted(createEditor);

watch(valueModel, setEditorValue);

watch(
	() => props.language,
	(language) => {
		const model = codeEditorInstance.value?.getModel();
		if (model && language) monaco?.editor.setModelLanguage(model, language);
	}
);

watch(
	() => props.theme,
	(theme) => {
		if (theme) monaco?.editor.setTheme(theme);
	}
);

watch(
	() => props.options,
	() => codeEditorInstance.value?.updateOptions(getEditorOptions()),
	{ deep: true }
);

onBeforeUnmount(() => {
	isUnmounted = true;

	const instance = codeEditorInstance.value;
	codeEditorInstance.value = undefined;
	isEditorReady.value = false;
	if (!instance) return;

	const model = instance.getModel();
	instance.dispose();
	model?.dispose();
});

/** get the current monaco editor instance (`undefined` before mount) */
const getEditor = () => codeEditorInstance.value;

/** manually re-layout the editor, useful when `automaticLayout` is disabled */
const layout = () => {
	codeEditorInstance.value?.layout();
};

defineExpose({ editor: codeEditorInstance, getEditor, layout });
</script>

<template>
	<div :style="{ ...containerStyle, width, height }">
		<div ref="codeEditorContainer" :style="{ width: '100%', height: '100%' }"></div>
		<div v-if="!isEditorReady" :style="loadingTipStyle">Loading...</div>
	</div>
</template>
