import { type UserConfig } from 'vite';
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue';
import MonacoEditorPlugin from '@latedream/monaco-editor-plugin/vite';

export default <UserConfig>{
	base: './',
	resolve: {
		alias: {
			'@': resolve(process.cwd(), './src'),
		}
	},
	plugins: [vue(), MonacoEditorPlugin()]
}
