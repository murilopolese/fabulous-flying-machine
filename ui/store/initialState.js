import { html } from '../libs/lit-html/lit-html.js';

const initialState = {
	term: null,
	editor: null,
	connected: false,
	running: false,
	editorValue: `print('hello micropython')`,
	isConsoleOpen: false,
	isPortDialogOpen: false,
	isUploadDialogOpen: false,
	isDownloadDialogOpen: false,
	uploadFileName: 'main.py',
	ports: [],
	files: []
}

export default initialState
