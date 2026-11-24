import { ensureLocalized, markMonacoImported } from './locale';

export type MonacoModule = typeof import('monaco-editor');

let monacoLoading: Promise<MonacoModule> | undefined;

/**
 * @internal
 * Import `monaco-editor` after the pending language pack has been applied,
 * the import is shared between all editors.
 */
export const loadMonaco = () => {
	monacoLoading ??= ensureLocalized()
		.then(() => import('monaco-editor'))
		.then((monaco) => {
			markMonacoImported();
			return monaco;
		});

	return monacoLoading;
};
