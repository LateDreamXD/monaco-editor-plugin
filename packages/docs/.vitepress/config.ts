import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import monacoEditorPlugin from '@latedream/monaco-editor-plugin/vite';
// @ts-ignore
import pkg from '@latedream/monaco-editor-plugin/package.json' with { type: 'json' };

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "monaco-editor-plugin",
	description: "LateDreamXD's Monaco Editor Plugin",
	base: '/monaco-editor-plugin/',
	cleanUrls: true,

	locales: {
		root: {
			label: 'English',
			lang: 'en'
		},
		'zh-cn': {
			label: '简体中文',
			lang: 'zh-CN',
			link: '/cn/'
		}
	},

	rewrites: {
		'en/:rest*': ':rest*'
	},
	
	markdown: {
		config(md) {
			md.use(groupIconMdPlugin);
		},
		codeTransformers: [
			transformerTwoslash()
		],
		languages: ['js', 'jsx', 'ts', 'tsx', 'vue']
	},

	vite: {
		plugins: [monacoEditorPlugin(), groupIconVitePlugin({
			customIcon: {
				vitepress: localIconLoader(import.meta.url, '../assets/vitepress.svg'),
			}
		})],
	},

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Guide', items: [
				{ text: 'Quick Start', link: '/guide/quick-start' },
				{ text: 'L10n', link: '/guide/l10n' }
			] },
			{ text: 'Interface', items: [
				{ text: 'Vite Plugin', link: '/interface/vite-plugin' },
				{ text: 'Vue Component Props', link: '/interface/vue-component-props' }
			] },
			{ text: 'Online Demo', link: '/demo' },
			{
				text: `v${pkg.version}`,
				items: [
					{ text: 'Release Notes', link: `https://github.com/LateDreamXD/monaco-editor-plugin/releases/tag/${pkg.version}` }
				]
			}
		],

		sidebar: [
			{ text: 'Guide', base: '/guide', items: [
				{ text: 'Quick Start', link: '/quick-start' },
				{ text: 'L10n', link: '/l10n' }
			] },
			{ text: 'Interface', base: '/interface', items: [
				{ text: 'Vite Plugin', link: '/vite-plugin' },
				{ text: 'Vue Component Props', link: '/vue-component-props' }
			] },
			{ text: 'Other', items: [
				{ text: 'Alternatives', link: '/other/alternatives' },
				{ text: 'Online Demo', link: '/demo' }
			] }
		],

		search: {
			provider: 'local'
		},

		editLink: {
			pattern: 'https://github.com/LateDreamXD/monaco-editor-plugin/edit/main/packages/docs/:path'
		},

		footer: {
			message: 'Released under the MIT License',
			copyright: 'Copyright © 2026 LateDreamXD'
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/LateDreamXD/monaco-editor-plugin' }
		],

		externalLinkIcon: true
	}
});
