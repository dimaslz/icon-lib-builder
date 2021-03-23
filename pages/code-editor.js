import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-nord_dark'
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import { useEffect, useRef } from 'react';

export default function CodeEditor({
	value = "",
	name,
	onChange = () => { },
	onLoad = () => { },
	readOnly = false,
	beautify = false,
	mode = 'javascript'
}) {
	let editor = useRef(null);


	useEffect(() => {
		// console.log("editor.session", editor.current.editor.session)
		if (beautify) {
			Beautify.beautify(editor.current.editor.session);
		}
	}, [value])

  return (
		<AceEditor
			ref={editor}
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
      name={name}
    />
  )
}