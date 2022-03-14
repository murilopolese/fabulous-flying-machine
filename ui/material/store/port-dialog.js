function store (state, emitter) {

  emitter.on('LOAD_PORTS', () => {
    window.serialBus.emit('load-ports')
  })
  emitter.on('OPEN_PORT_DIALOG', () => {
		state.isPortDialogOpen = true
		emitter.emit('RENDER')
	})
	emitter.on('CLOSE_PORT_DIALOG', () => {
		state.isPortDialogOpen = false
		emitter.emit('RENDER')
	})
  emitter.on('CONNECT', ({ detail }) => {
    window.serialBus.emit('connect', detail)
  })
  emitter.on('DISCONNECT', () => {
    window.serialBus.emit('disconnect')
  })

  window.serialBus.on('connected', (port) => {
    state.connected = true
    emitter.emit('CLOSE_PORT_DIALOG')
    emitter.emit('OPEN_CONSOLE')
    emitter.emit('RENDER')
  })
  window.serialBus.on('disconnected', (port) => {
    state.connected = false
    state.isConsoleOpen = false
    emitter.emit('RENDER')
  })
  window.serialBus.on('ports', (ports) => {
    state.ports = ports
    emitter.emit('RENDER')
  })
}

export default store
