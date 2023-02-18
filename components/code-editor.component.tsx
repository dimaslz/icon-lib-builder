import React from 'react';
import AceEditor from 'react-ace';


import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/webpack-resolver';


type CodeEditorType = {
	placeholder: string;
	value: string;
	name: string;
	onChange?: (value?: any) => void;
	onPaste?: (value?: any) => void;
	onLoad: (value?: any) => void;
	readOnly?: boolean;
	mode?: string;
}

export const CodeEditor: React.FC<CodeEditorType> = ({
	placeholder = '',
	value = '',
	name = '',
	onChange = () => ({}),
	onPaste = () => ({}),
	onLoad = () => ({}),
	readOnly = false,
	mode = 'javascript',
}): JSX.Element => (
	<AceEditor
		placeholder={placeholder}
		name={name}
		value={value}
		mode={mode}
		theme="dracula"
		onPaste={onPaste}
		onChange={onChange}
		onLoad={onLoad}
		readOnly={readOnly}
		height="100%"
		width="100%"
		setOptions={{
			useWorker: false,
		}}
	/>
);

export default React.memo(CodeEditor);