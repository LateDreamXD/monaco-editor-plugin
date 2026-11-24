export type MonacoEditorLocal =
	| 'cs'
	| 'de'
	| 'es'
	| 'fr'
	| 'it'
	| 'ja'
	| 'ko'
	| 'pl'
	| 'pt-br'
	| 'ru'
	| 'tr'
	| 'zh-cn'
	| 'zh-tw';

type LocaleLoader = () => Promise<unknown>;

const localeLoaders: Record<MonacoEditorLocal, LocaleLoader> = {
	cs: () => import('monaco-editor/nls/lang/cs.js'),
	de: () => import('monaco-editor/nls/lang/de.js'),
	es: () => import('monaco-editor/nls/lang/es.js'),
	fr: () => import('monaco-editor/nls/lang/fr.js'),
	it: () => import('monaco-editor/nls/lang/it.js'),
	ja: () => import('monaco-editor/nls/lang/ja.js'),
	ko: () => import('monaco-editor/nls/lang/ko.js'),
	pl: () => import('monaco-editor/nls/lang/pl.js'),
	'pt-br': () => import('monaco-editor/nls/lang/pt-br.js'),
	ru: () => import('monaco-editor/nls/lang/ru.js'),
	tr: () => import('monaco-editor/nls/lang/tr.js'),
	'zh-cn': () => import('monaco-editor/nls/lang/zh-cn.js'),
	'zh-tw': () => import('monaco-editor/nls/lang/zh-tw.js')
};

let localeLoading: Promise<void> = Promise.resolve();
let monacoImported = false;

/**
 * Load a monaco editor language pack.
 *
 * Monaco resolves most of its labels while its modules are evaluated, so the
 * pack has to be loaded **before** `monaco-editor` itself. The vue components
 * import monaco lazily for this reason: call `useLocal()` before the first
 * editor is created (e.g. in `main.ts` or the root component `setup`).
 */
export const useLocal = (local: MonacoEditorLocal) => {
	const loader = localeLoaders[local];
	if (!loader)
		return console.warn(`[monaco-editor-plugin] unsupported locale "${local}", will use default english`);

	if (monacoImported)
		console.warn(
			'[monaco-editor-plugin] monaco-editor is already loaded, ' +
			'the language pack now only applies to labels that are created lazily'
		);

	const pack = loader().then(() => undefined);
	localeLoading = pack.catch((error) => {
		console.error(`[monaco-editor-plugin] failed to load the "${local}" language pack:`, error);
	});

	return pack;
};

/** @internal resolves once the pending language pack settled */
export const ensureLocalized = () => localeLoading;

/** @internal */
export const markMonacoImported = () => {
	monacoImported = true;
};
