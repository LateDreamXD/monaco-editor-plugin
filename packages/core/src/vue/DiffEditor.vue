<script setup lang="ts">
import { type CSSProperties, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import type * as Monaco from 'monaco-editor';
import { type IMonacoDiffEditorProps } from './types';
import { loadMonaco } from './monaco';

type MonacoModule = typeof import('monaco-editor');

const props = withDefaults(defineProps<IMonacoDiffEditorProps>(), {
	width: '100%',
	height: '100%'
});

const emits = defineEmits<{
	/** emitted once the diff editor instance has been created */
	ready: [instance: Monaco.editor.IStandaloneDiffEditor];
}>();

const originalModel = defineModel<string>('original');
const modifiedModel = defineModel<string>('modified');

const isEditorReady = ref(false);
const diffEditorInstance = shallowRef<Monaco.editor.IStandaloneDiffEditor>();
const originalTextModel = shallowRef<Monaco.editor.ITextModel>();
const modifiedTextModel = shallowRef<Monaco.editor.ITextModel>();
const diffEditorContainer = useTemplateRef<HTMLDivElement>('diffEditorContainer');

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
 * `theme` is controlled by its own prop,
 * so it is removed from `options` to keep a single source of truth.
 */
const getEditorOptions = () => {
	const { theme: _theme, ...options } = props.options ?? {};
	return options;
};

const setTextModelValue = (model: Monaco.editor.ITextModel | undefined, value?: string) => {
	if (!model) return;

	const nextValue = value ?? '';
	if (model.getValue() === nextValue) return;

	model.setValue(nextValue);
};

const createDiffEditor = async () => {
	const container = diffEditorContainer.value;
	if (!container) return;

	try {
		// monaco has to be imported after the language pack (see `useLocal`)
		monaco = await loadMonaco();
		if (isUnmounted) return;

		const original = monaco.editor.createModel(originalModel.value ?? '', props.originalLanguage);
		const modified = monaco.editor.createModel(modifiedModel.value ?? '', props.modifiedLanguage);

		const instance = monaco.editor.createDiffEditor(container, {
			// follow the size of the container by default
			automaticLayout: true,
			...getEditorOptions(),
			theme: props.theme
		});

		originalTextModel.value = original;
		modifiedTextModel.value = modified;
		diffEditorInstance.value = instance;

		instance.setModel({ original, modified });

		instance.getOriginalEditor().onDidChangeModelContent(() => {
			const value = original.getValue();
			if (value !== originalModel.value) originalModel.value = value;
		});

		instance.getModifiedEditor().onDidChangeModelContent(() => {
			const value = modified.getValue();
			if (value !== modifiedModel.value) modifiedModel.value = value;
		});

		isEditorReady.value = true;
		emits('ready', instance);

		void nextTick(() => instance.layout());
	} catch (error) {
		console.error('[monaco-editor-plugin] failed to create the diff editor:', error);

		originalTextModel.value?.dispose();
		modifiedTextModel.value?.dispose();
		originalTextModel.value = undefined;
		modifiedTextModel.value = undefined;
	}
};

onMounted(createDiffEditor);

watch(originalModel, (value) => setTextModelValue(originalTextModel.value, value));
watch(modifiedModel, (value) => setTextModelValue(modifiedTextModel.value, value));

watch(
	() => props.originalLanguage,
	(language) => {
		if (language && originalTextModel.value)
			monaco?.editor.setModelLanguage(originalTextModel.value, language);
	}
);

watch(
	() => props.modifiedLanguage,
	(language) => {
		if (language && modifiedTextModel.value)
			monaco?.editor.setModelLanguage(modifiedTextModel.value, language);
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
	() => diffEditorInstance.value?.updateOptions(getEditorOptions()),
	{ deep: true }
);

onBeforeUnmount(() => {
	isUnmounted = true;

	const instance = diffEditorInstance.value;
	diffEditorInstance.value = undefined;
	isEditorReady.value = false;

	instance?.dispose();
	originalTextModel.value?.dispose();
	modifiedTextModel.value?.dispose();
	originalTextModel.value = undefined;
	modifiedTextModel.value = undefined;
});

/** get the current monaco diff editor instance (`undefined` before mount) */
const getEditor = () => diffEditorInstance.value;

/** get the inner original editor (`undefined` before mount) */
const getOriginalEditor = () => diffEditorInstance.value?.getOriginalEditor();

/** get the inner modified editor (`undefined` before mount) */
const getModifiedEditor = () => diffEditorInstance.value?.getModifiedEditor();

/** manually re-layout the editor, useful when `automaticLayout` is disabled */
const layout = () => {
	diffEditorInstance.value?.layout();
};

defineExpose({ editor: diffEditorInstance, getEditor, getOriginalEditor, getModifiedEditor, layout });
</script>

<template>
	<div :style="{ ...containerStyle, width, height }">
		<div ref="diffEditorContainer" :style="{ width: '100%', height: '100%' }"></div>
		<div v-if="!isEditorReady" :style="loadingTipStyle">Loading...</div>
	</div>
</template>
