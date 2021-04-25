function fit (state) {
  const hidden = state.isConsoleOpen ? '' : 'hidden'
  if (!hidden) {
    setTimeout(() => {
      state.fitAddon.fit()
    }, 100)
  }
}

function store (state, emitter) {
  emitter.on('TOGGLE_CONSOLE', () => {
		state.isConsoleOpen = !state.isConsoleOpen
    fit(state)
		emitter.emit('RENDER')
	})

	emitter.on('OPEN_CONSOLE', () => {
		state.isConsoleOpen = true
    fit(state)
		emitter.emit('RENDER')
	})

	emitter.on('CLOSE_CONSOLE', () => {
		state.isConsoleOpen = false
		emitter.emit('RENDER')
	})

	emitter.on('CONSOLE_CONTENT', ({ detail }) => {
    window.serialBus.emit('write', detail)
	})

  window.serialBus.on('data', (data) => {
    let buffer = Buffer.from(data)
    state.term.write(buffer)
    emitter.emit('RENDER')
  })
}

export default store
