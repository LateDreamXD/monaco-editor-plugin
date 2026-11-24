import { type IWorkerDefinition } from './types';

export const editorDefaultWorker: IWorkerDefinition = {
	label: 'default',
	entry: 'monaco-editor/esm/vs/editor/editor.worker',
}

export const languageWorkers: IWorkerDefinition[] = [
	editorDefaultWorker,
	{
		label: 'css',
		entry: 'monaco-editor/esm/vs/language/css/css.worker',
	},
	{
		label: 'html',
		entry: 'monaco-editor/esm/vs/language/html/html.worker',
	},
	{
		label: 'json',
		entry: 'monaco-editor/esm/vs/language/json/json.worker',
	},
	{
		label: 'typescript',
		entry: 'monaco-editor/esm/vs/language/typescript/ts.worker',
	},
];
