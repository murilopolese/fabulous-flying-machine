import React from 'react'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

function Editor(props) {
	return  <AceEditor
		width='100%'
		height='100%'
		fontSize="18px"
		value={props.value}
		mode="python"
		theme="github"
		onChange={props.onChange}
		name="UNIQUE_ID_OF_DIV"
		editorProps={{ $blockScrolling: true }}
	 />
}

export default Editor
