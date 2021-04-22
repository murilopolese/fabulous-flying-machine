const initialState = {
	isConsoleOpen: false,
	connected: false,
	selectedPort: null,
	editorValue: `print('hello micropython')`,
	isPortDialogOpen: false,
	isSaveDialogOpen: false,
	isLoadDialogOpen: false,
	loadingFile: false,
	loadingFileList: false,
	ports: [],
	running: false,
	consoleContent: `Hello, I'm console!`
}

export default initialState
