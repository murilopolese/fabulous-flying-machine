

const serialStore = function(state, emitter) {

	emitter.on('LOAD_PORTS', (ports) => {
		state.ports = ports
		emitter.emit('render')
	})

	emitter.on('SELECT_PORT', (selectedPort) => {
		state.selectedPort = selectedPort
		emitter.emit('render')
	})

	emitter.on('CHANGE_EDITOR', (editorValue) => {
		state.editorValue = editorValue
		emitter.emit('render')
	})

	emitter.on('TOGGLE_CONSOLE', () => {
		state.isConsoleOpen = !state.isConsoleOpen
		emitter.emit('render')
	})

	emitter.on('OPEN_CONSOLE', () => {
		state.isConsoleOpen = true
		emitter.emit('render')
	})

	emitter.on('CLOSE_CONSOLE', () => {
		state.isConsoleOpen = false
		emitter.emit('render')
	})

	emitter.on('CONSOLE_CONTENT', (consoleContent) => {
		// state.consoleContent = consoleContent
		console.log(consoleContent)
		emitter.emit('render')
	})

	emitter.on('OPEN_PORT_DIALOG', () => {
		state.isPortDialogOpen = true
		emitter.emit('render')
	})

	emitter.on('CLOSE_PORT_DIALOG', () => {
		state.isPortDialogOpen = false
		emitter.emit('render')
	})

	emitter.on('OPEN_SAVE_DIALOG', () => {
		state.isSaveDialogOpen = true
		emitter.emit('render')
	})

	emitter.on('CLOSE_SAVE_DIALOG', () => {
		state.isSaveDialogOpen = false
		emitter.emit('render')
	})

	emitter.on('OPEN_LOAD_DIALOG', () => {
		state.isLoadDialogOpen = true
		emitter.emit('render')
	})

	emitter.on('CLOSE_LOAD_DIALOG', () => {
		state.isLoadDialogOpen =false
		state.loadingFileList = false
		state.loadingFile = false
		emitter.emit('render')
	})

	emitter.on('CONNECTED', () => {
		state.connected = true
		emitter.emit('render')
	})

	emitter.on('DISCONNECTED', () => {
		state.connected = false
		emitter.emit('render')
	})

	emitter.on('RUNNING', () => {
		state.running = true
		emitter.emit('render')
	})

	emitter.on('STOPPED', () => {
		state.running = false
		emitter.emit('render')
	})

	emitter.on('LOAD_FILE_LIST', (files) => {
		state.files = files
		emitter.emit('render')
	})
}

export default serialStore
