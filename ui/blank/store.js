function store(state, emitter) {
  state.connected = false
  state.isPortDialogOpen = false
  state.ports = []
  state.panel = 'terminal'
  state.panelHeight = 200
  state.panelCollapsed = true


  emitter.on('open-port-dialog', () => {
    console.log('open-port-dialog')
    if (state.connected) {
      window.serialBus.emit('disconnect')
    }
    window.serialBus.emit('load-ports')
    state.isPortDialogOpen = true
    emitter.emit('render')
  })
  emitter.on('close-port-dialog', () => {
    console.log('close-port-dialog')
    state.isPortDialogOpen = false
    emitter.emit('render')
  })
  emitter.on('toggle-port-dialog', () => {
    console.log('toggle-port-dialog')
    state.isPortDialogOpen = !state.isPortDialogOpen
    emitter.emit('render')
  })
  emitter.on('connect', (port) => {
    console.log('connect', port)
    window.serialBus.emit('connect', port.path)
  })
  emitter.on('resize-panel', (clientY) => {
    // Get DOM references
    let bar = document.querySelector('#bar')
    // Get current bar size
    let barBounds = bar.getBoundingClientRect()
    state.panelHeight = Math.max(
      window.innerHeight - clientY - (barBounds.height*0.5),
      barBounds.height
    )
    emitter.emit('render')
  })
  emitter.on('select-panel', (panel) => {
    console.log('select-panel', panel)
    state.panel = panel
    emitter.emit('render')
  })
  emitter.on('toggle-panel', () => {
    state.panelCollapsed = !state.panelCollapsed
    emitter.emit('render')
  })
  emitter.on('terminal-input', (k) => {
    if (state.connected) {
      window.serialBus.emit('write', k)
    }
  })
  emitter.on('run', () => {
    let editor = state.cache(AceEditor, 'editor').editor
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('run', editor.getValue())
  })
  emitter.on('stop', () => {
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('stop')
  })
  emitter.on('reset', () => {
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('reset')
  })

  window.serialBus.on('connected', (port) => {
    console.log('connected', port)
    state.connected = true
    state.panelCollapsed = false
    emitter.emit('close-port-dialog')
    emitter.emit('render')
  })
  window.serialBus.on('disconnected', (port) => {
    console.log('disconnected', port)
    state.connected = false
    emitter.emit('render')
  })
  window.serialBus.on('ports', (ports) => {
    console.log('ports', ports)
    state.ports = ports
    emitter.emit('render')
  })
  window.serialBus.on('data', (data) => {
    let buffer = Buffer.from(data)
    state.cache(XTerm, 'terminal').term.write(buffer)
    state.cache(XTerm, 'terminal').term.scrollToBottom()
  })
}
