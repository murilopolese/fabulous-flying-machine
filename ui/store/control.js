function store (state, emitter) {

  emitter.on('RUN', () => {
    emitter.emit('OPEN_CONSOLE')
    let code = `print('')\n` // prettify the print
    code += state.editorValue
    window.serialBus.emit('run', code)
  })
  emitter.on('STOP', () => {
    window.serialBus.emit('stop')
  })
  emitter.on('RESET', () => {
    window.serialBus.emit('reset')
  })

  emitter.on('SAVE_FILE', () => {
    let blob = new Blob(
      [state.editorValue],
      { type: "text/plain;charset=utf-8" }
    )
		saveAs(blob, "script.py")
  })
  emitter.on('OPEN_FILE', () => {
    const fileInput = document.querySelector('#fileInput')
    fileInput.click()
  })

  window.serialBus.on('running', () => {
    state.running = true
    emitter.emit('RENDER')
  })
  window.serialBus.on('stopped', () => {
    state.running = false
    emitter.emit('RENDER')
  })
}

export default store
