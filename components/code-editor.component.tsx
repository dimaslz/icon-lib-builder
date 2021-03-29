import React from 'react';
import dynamic from 'next/dynamic'

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
  ssr: false,
})

type CodeEditorType = {
	value: string;
	name: string;
	onChange?: (value?: any) => void;
	onLoad: (value?: any) => void;
	readOnly?: boolean;
	mode?: string;
}

export default function CodeEditor({
	value = "",
	name = "",
	onChange = () => { },
	onLoad = () => { },
	readOnly = false,
	mode = 'javascript'
}: CodeEditorType) {

	return (
		<AceEditor
			name={name}
			value={value}
			mode={mode}
			theme="nord_dark"
			onChange={onChange}
			onLoad={onLoad}
			readOnly={readOnly}
			height="100%"
			width="100%"
			setOptions={{
				useWorker: false
			}}
		/>
  )
}
