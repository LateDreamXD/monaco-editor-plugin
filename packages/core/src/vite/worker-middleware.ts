import { Connect, ResolvedConfig } from 'vite';
import { getWorkers, getFilenameByEntry, isCDN, resolveMonacoFilePath } from './utils';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'rolldown';

import { type IWorkerDefinition, type IMonacoEditorOptions } from './types';

export const cacheDir = path.join(process.cwd(), './node_modules/.monaco-editor-plugin/');

export const getWorkerPath = (workers: IWorkerDefinition[], options: IMonacoEditorOptions, config: ResolvedConfig) => {
	const workerPaths: Record<string, string | undefined> = {};

	workers.forEach(worker => {
		workerPaths[worker.label] = `${isCDN(options.publicPath!)? '': config.base}${options.publicPath}/${getFilenameByEntry(worker.entry)}`
	});

	if (workerPaths.typescript)
		// javascript shares the same worker
		workerPaths.javascript = workerPaths.typescript;
	if (workerPaths.css) {
		// scss and less share the same worker
		workerPaths.less = workerPaths.css;
		workerPaths.scss = workerPaths.css;
	}
	if (workerPaths.html) {
		// handlebars, razor and html share the same worker
		workerPaths.handlebars = workerPaths.html;
		workerPaths.razor = workerPaths.html;
	}

	return workerPaths;
}

export const workerMiddleware = (middlewares: Connect.Server, config: ResolvedConfig, options: IMonacoEditorOptions) => {
	const workers = getWorkers(options);

	// clean cache
	if (fs.existsSync(cacheDir))
		fs.rmSync(cacheDir, { recursive: true, force: true });

	workers.forEach(w =>
		middlewares.use(
			`${config.base}${options.publicPath}/${getFilenameByEntry(w.entry)}`,
			async (req, res, next) => {
				const cacheFile = `${cacheDir}${getFilenameByEntry(w.entry)}`;
				if(!fs.existsSync(cacheFile)) {
					await build({
						input: resolveMonacoFilePath(w.entry),
						output: { file: cacheFile }
					});
				}
				const contentBuffer = fs.readFileSync(cacheFile);
				res.setHeader('Content-Type', 'text/javascript');
				res.end(contentBuffer);
			}
		)
	);
}
