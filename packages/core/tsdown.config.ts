import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

export default defineConfig({
	entry: {
		vite: 'src/vite/index.ts',
		vue: 'src/vue/index.ts'
	},
	platform: 'neutral',
	format: 'esm',
	dts: {
		tsc: {
			vue: true
		}
	},
	sourcemap: true,
	plugins: [vue()],
	exports: true
});
