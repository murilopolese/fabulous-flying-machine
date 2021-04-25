import { html } from '../libs/lit-html/lit-html.js';

const initialState = {
	term: null,
	editor: null,
	isConsoleOpen: false,
	connected: false,
	selectedPort: null,
	editorValue: `print('hello micropython')`,
	isPortDialogOpen: false,
	isUploadDialogOpen: false,
	isDownloadDialogOpen: false,
	loadingFile: false,
	loadingFileList: false,
	ports: [],
	running: false,
	consoleContent: `Hello, I'm console!`
}

export default initialState
