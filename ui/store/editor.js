function store (state, emitter) {
  emitter.on('CHANGE_EDITOR', ({ detail }) => {
		state.editorValue = detail
    if (state.editor.getValue() !== state.editorValue) {
      state.editor.setValue(state.editorValue)
    }
		emitter.emit('RENDER')
	})
}

export default store
