import fs from 'node:fs';
import path from 'node:path';
import { languageWorkers } from './language-worker';

import { type IMonacoEditorOptions, type IWorkerDefinition } from './types';

export const resolveMonacoFilePath = (filePath: string) => {
	if(!filePath.endsWith('.js')) filePath = `${filePath}.js`;
	let resolvedPath = path.resolve(path.join(process.cwd(), 'node_modules', filePath));
	if(fs.existsSync(resolvedPath)) return resolvedPath;
	else return path.resolve(filePath);
}

export const getFilenameByEntry = (entry: string) => {
	entry = path.basename(entry, 'js');
	return `${entry}.bundle.js`;
}

export const getWorkers = (options: IMonacoEditorOptions) => {
	const workers: IWorkerDefinition[] = languageWorkers.filter(
		// @ts-ignore
		w => w.label === 'default' || options.languageWorkers!.includes(w.label)
	);
	workers.push(...options.customLanguageWorkers!);

	return workers;
}

export const isCDN = (path: string) => /^((http:)|(https:)|(file:)|(\/\/))/.test(path);