import React from 'react';
import dynamic from 'next/dynamic';

const AceEditor = dynamic(
	async () => {
		const ace = await import('react-ace');
		require('ace-builds/src-noconflict/mode-javascript');
		require('ace-builds/src-noconflict/mode-typescript');
		require('ace-builds/src-noconflict/theme-nord_dark');
		require('ace-builds/webpack-resolver');
		return ace;
	},
	{
		loading: () => (
			<>Loading...</>
		),
		ssr: false
	});

type CodeEditorType = {
	value: string;
	name: string;
	onChange?: (value?: any) => void;
	onPaste?: (value?: any) => void;
	onLoad: (value?: any) => void;
	readOnly?: boolean;
	mode?: string;
}

export const CodeEditor: React.FC<CodeEditorType> = ({
	value = '',
	name = '',
	onChange = () => ({}),
	onPaste = () => ({}),
	onLoad = () => ({}),
	readOnly = false,
	mode = 'javascript'
}): JSX.Element => (
	<AceEditor
		name={name}
		value={value}
		mode={mode}
		theme="nord_dark"
		onPaste={onPaste}
		onChange={onChange}
		onLoad={onLoad}
		readOnly={readOnly}
		height="100%"
		width="100%"
		setOptions={{
			useWorker: false
		}}
	/>
);

export default React.memo(CodeEditor);