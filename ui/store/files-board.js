function store (state, emitter) {
  emitter.on('LOAD_BOARD_FILES', () => {
		window.serialBus.emit('list-files')
		emitter.emit('RENDER')
	})
  emitter.on('LOAD_BOARD_FILE', ({ detail }) => {
		window.serialBus.emit('load-file', detail)
		emitter.emit('RENDER')
	})
  emitter.on('REMOVE_BOARD_FILE', ({ detail }) => {
		window.serialBus.emit('remove-file', detail)
    emitter.emit('LOAD_BOARD_FILES')
		emitter.emit('RENDER')
	})
  emitter.on('UPLOAD_BOARD_FILE', ({ detail }) => {
    console.log('upload', state.uploadFileName, state.editorValue)
		window.serialBus.emit('save-file', state.uploadFileName, state.editorValue)
		emitter.emit('RENDER')
	})
  emitter.on('OPEN_UPLOAD_DIALOG', () => {
		state.isUploadDialogOpen = true
		emitter.emit('RENDER')
	})
	emitter.on('CLOSE_UPLOAD_DIALOG', () => {
		state.isUploadDialogOpen = false
		emitter.emit('RENDER')
	})
  emitter.on('OPEN_DOWNLOAD_DIALOG', () => {
		state.isDownloadDialogOpen = true
		emitter.emit('RENDER')
	})
	emitter.on('CLOSE_DOWNLOAD_DIALOG', () => {
		state.isDownloadDialogOpen =false
		state.loadingFileList = false
		state.loadingFile = false
		emitter.emit('RENDER')
	})
  window.serialBus.on('file-loaded', (data) => {
    emitter.emit('CHANGE_EDITOR', data)
    emitter.emit('RENDER')
  })
  window.serialBus.on('file-list-loaded', (data) => {
    let dataJson = []
    try {
      dataJson = JSON.parse(data.split(`'`).join(`"`))
    } catch (e) {
      console.log('problem loading files', data, state)
    }
    state.files = dataJson
    emitter.emit('RENDER')
  })
}

export default store
