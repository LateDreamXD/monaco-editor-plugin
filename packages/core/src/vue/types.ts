// #region CodeEditor
export interface IMonacoCodeEditorProps {
	// ---cut-start---
	/** content */
	// ---cut-end---
	value?: string;
	// ---cut-start---
	/** programing language */
	// ---cut-end---
	language?: string;
	// ---cut-start---
	/** editor theme */
	// ---cut-end---
	theme?: import('monaco-editor').editor.BuiltinTheme | string;
	// ---cut-start---
	/**
	 * editor width
	 * @default '100%'
	 */
	// ---cut-end---
	width?: string | number;
	// ---cut-start---
	/**
	 * editor height
	 * @default '100%'
	 */
	// ---cut-end---
	height?: string | number;
	// ---cut-start---
	/** editor options */
	// ---cut-end---
	options?: import('monaco-editor').editor.IStandaloneEditorConstructionOptions;
}
// #endregion

// #region DiffEditor
export interface IMonacoDiffEditorProps {
	// ---cut-start---
	/** original content */
	// ---cut-end---
	original?: string;
	// ---cut-start---
	/** original programing language */
	// ---cut-end---
	originalLanguage?: string;
	// ---cut-start---
	/** modified content */
	// ---cut-end---
	modified?: string;
	// ---cut-start---
	/** modified programing language */
	// ---cut-end---
	modifiedLanguage?: string;
	// ---cut-start---
	/** editor theme */
	// ---cut-end---
	theme?: import('monaco-editor').editor.BuiltinTheme | string;
	// ---cut-start---
	/**
	 * editor width
	 * @default '100%'
	 */
	// ---cut-end---
	width?: string | number;
	// ---cut-start---
	/**
	 * editor height
	 * @default '100%'
	 */
	// ---cut-end---
	height?: string | number;
	// ---cut-start---
	/** editor options */
	// ---cut-end---
	options?: import('monaco-editor').editor.IStandaloneDiffEditorConstructionOptions;
}
// #endregion
