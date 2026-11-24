import fs from 'node:fs';
import path from 'node:path';
import { HtmlTagDescriptor, Plugin, ResolvedConfig } from 'vite';
import { build } from 'rolldown';
import { getWorkerPath, workerMiddleware } from './worker-middleware';
import { getFilenameByEntry, getWorkers, isCDN, resolveMonacoFilePath } from './utils';

import { type IMonacoEditorOptions } from './types';

const defaultOptions: IMonacoEditorOptions = {
	languageWorkers: ['css', 'html', 'json', 'typescript'],
	customLanguageWorkers: [],
	publicPath: 'monaco-editor-workers',
	globalAPI: false,
	forceBuildCDN: false
}

const MonacoEditorPlugin = (options?: IMonacoEditorOptions): Plugin => {
	options = {
		...defaultOptions,
		...options
	};
	let resolvedConfig: ResolvedConfig;

	return {
		name: 'vite-plugin-monaco-editor',
		configResolved(getResolvedConfig) {
			resolvedConfig = getResolvedConfig;
		},
		configureServer(server) {
			if (isCDN(options.publicPath!)) {
				return;
			}

			workerMiddleware(server.middlewares, resolvedConfig, options);
		},
		transformIndexHtml(html) {
			const workers = getWorkers(options);
			const workerPaths = getWorkerPath(workers, options, resolvedConfig);

			const globals: Record<string, any> = {
				MonacoEnvironment: `(paths => {
	return {
		globalAPI: ${options.globalAPI},
		getWorkerUrl(_, label) {
			const path = paths[label];
			if(!path) return paths.default;
			if(!/^((http:)|(https:)|(file:)|(\\/\\/))/.test(path)) return path;
			if((new URL(path)).origin !== location.origin) {
				const js = \`importScripts("\${path}");\`;
				const blob = new Blob([js], { type: 'application/javascript' });
				return URL.createObjectURL(blob);
			}
		}
	}
})(${JSON.stringify(workerPaths, null, 2)})`,
			};

			const descriptor: HtmlTagDescriptor[] = [
				{
					tag: 'script',
					attrs: {'data-monaco-editor-plugin-vite': true},
					children: [
						'// inject by @latedream/monaco-editor-plugin/vite',
						...Object.keys(globals).map(
							(key) => `window[${JSON.stringify(key)}] = ${globals[key]};`
						)
					].join('\n'),
					injectTo: 'head-prepend'
				},
			];
			return descriptor;
		},

		writeBundle() {
			if(isCDN(options.publicPath!) && !options.forceBuildCDN) return;

			const workers = getWorkers(options);
			let distPath: string;

			if(options.customDistPath)
				distPath = options.customDistPath(
					resolvedConfig.root,
					resolvedConfig.build.outDir,
					resolvedConfig.base
				)
			else if(resolvedConfig.build.outDir.startsWith(resolvedConfig.root)) // vitepress
				distPath = path.join(resolvedConfig.build.outDir, options.publicPath!)
			else
				distPath = resolvedConfig.build.outDir.startsWith(resolvedConfig.root)?
				path.join(
					resolvedConfig.root,
					resolvedConfig.build.outDir,
					resolvedConfig.base,
					options.publicPath!
				):
				path.join(
					resolvedConfig.root,
					resolvedConfig.build.outDir,
					options.publicPath!
				);

			// create dist path
			if (!fs.existsSync(distPath))
				fs.mkdirSync(distPath, { recursive: true });

			workers.forEach(async (w) => {
				await build({
					input: resolveMonacoFilePath(w.entry),
					output: {
						file: path.join(distPath, getFilenameByEntry(w.entry))
					}
				});
			})
		},
	};
}

export default MonacoEditorPlugin;
