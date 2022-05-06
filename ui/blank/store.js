function store(state, emitter) {
  state.connected = false
  state.isPortDialogOpen = false
  state.ports = []
  state.panel = 'terminal'
  state.panelHeight = 200
  state.panelCollapsed = true

  state.selectedFile = null
  state.selectedDevice = 'disk'
  state.diskFolder = null
  state.renamingFile = false

  state.diskFiles = []
  state.boardFiles = []

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
    console.log('resize-panel')
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
    console.log('toggle-panel')
    state.panelCollapsed = !state.panelCollapsed
    emitter.emit('render')
  })
  emitter.on('terminal-input', (k) => {
    if (state.connected) {
      window.serialBus.emit('write', k)
    }
  })
  emitter.on('run', () => {
    console.log('run')
    let editor = state.cache(AceEditor, 'editor').editor
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('run', editor.getValue())
  })
  emitter.on('stop', () => {
    console.log('stop')
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('stop')
  })
  emitter.on('reset', () => {
    console.log('reset')
    state.panelCollapsed = false
    state.panel = 'terminal'
    emitter.emit('render')
    window.serialBus.emit('reset')
  })


  emitter.on('list-board-folder', () => {
    console.log('list-board-folder')
    window.serialBus.emit('list-files')
    let outputBuffer = ''
    function parseData(o) {
      outputBuffer += o
      rawMessage = extractREPLMessage(outputBuffer)
      if (rawMessage) {
        console.log('list-board-folder', 'found', rawMessage)
        // Prepare to parse JSON
        rawMessage = rawMessage.replace(/'/g, `"`)
        let jsonMessage = JSON.parse(rawMessage)
        state.boardFiles = jsonMessage
        emitter.emit('render')
        window.serialBus.off('data', parseData)
      }
    }
    window.serialBus.on('data', parseData)
  })
  emitter.on('select-board-file', (file) => {
    state.selectedDevice = 'board'
    state.selectedFile = file

    let outputBuffer = ''
    function parseData(o) {
      outputBuffer += o
      rawMessage = extractREPLMessage(outputBuffer)
      if (rawMessage) {
        console.log('list-board-folder', 'found', rawMessage)
        state.cache(AceEditor, 'editor').editor.setValue(rawMessage)
        window.serialBus.off('data', parseData)
      }
    }
    window.serialBus.on('data', parseData)

    window.serialBus.emit('load-file', file)

    emitter.emit('render')
  })

  emitter.on('open-disk-folder', () => {
    window.diskBus.emit('open-folder')
  })
  emitter.on('select-disk-file', (file) => {
    console.log('select-disk-file', file)
    state.selectedDevice = 'disk'
    state.selectedFile = file
    window.diskBus.emit(
      'load-file',
      {
        folder: state.diskFolder,
        filename: state.selectedFile
      }
    )
    emitter.emit('render')
  })

  emitter.on('save-file', () => {
    console.log('save-file')
    let editor = state.cache(AceEditor, 'editor').editor

    // If no filename is given, defaults to untitled
    if (!state.selectedFile) {
      state.selectedFile = 'untitled'
    }

    if (state.selectedDevice === 'disk') {
      window.diskBus.emit(
        'save-file',
        {
          folder: state.diskFolder,
          filename: state.selectedFile,
          content: editor.getValue()
        }
      )
    }

    if (state.selectedDevice === 'board') {
      alert('soon')
    }
  })
  emitter.on('remove-file', () => {
    if (state.selectedDevice === 'disk') {
      window.diskBus.emit(
        'remove-file',
        {
          folder: state.diskFolder,
          filename: state.selectedFile
        }
      )
    }

    if (state.selectedDevice === 'board') {
      alert('soon')
    }
  })
  emitter.on('new-file', () => {
    state.selectedFile = null
    state.cache(AceEditor, 'editor').editor.setValue('')
    emitter.emit('render')
  })

  emitter.on('start-renaming-file', () => {
    console.log('start-renaming-file')
    state.renamingFile = true
    emitter.emit('render')
  })
  emitter.on('end-renaming-file', (filename) => {
    console.log('end-renaming-file', filename)
    window.diskBus.emit(
      'rename-file',
      {
        folder: state.diskFolder,
        filename: state.selectedFile,
        newFilename: filename
      }
    )
  })


  window.serialBus.on('connected', (port) => {
    console.log('serialBus', 'connected', port)
    state.connected = true
    state.panelCollapsed = false
    emitter.emit('close-port-dialog')
    emitter.emit('list-board-folder')
    emitter.emit('render')
  })
  window.serialBus.on('serialBus', (port) => {
    console.log('serialBus', 'disconnected', port)
    state.connected = false
    emitter.emit('render')
  })
  window.serialBus.on('ports', (ports) => {
    console.log('serialBus', 'ports', ports)
    state.ports = ports
    emitter.emit('render')
  })
  window.serialBus.on('data', (data) => {
    let buffer = Buffer.from(data)
    state.cache(XTerm, 'terminal').term.write(buffer)
    state.cache(XTerm, 'terminal').term.scrollToBottom()
  })

  window.diskBus.on('folder-opened', ({ folder, files }) => {
    console.log('diskBus', 'folder-opened', folder, files)
    state.diskFiles = files
    state.diskFolder = folder
    state.selectedDevice = 'disk'
    state.panelCollapsed = false
    emitter.emit('select-panel', 'files')
  })
  window.diskBus.on('folder-updated', ({ folder, files }) => {
    state.diskFiles = files
    emitter.emit('render')
  })
  window.diskBus.on('file-loaded', (fileContent) => {
    console.log('diskBus', 'file-loaded', fileContent)
    let code = new TextDecoder().decode(fileContent)
    state.cache(AceEditor, 'editor').editor.setValue(code)
  })
  window.diskBus.on('file-saved', () => {
    console.log('diskBus', 'file-saved')
    window.diskBus.emit('update-folder', state.diskFolder)
  })
  window.diskBus.on('file-removed', () => {
    console.log('diskBus', 'file-removed')
    state.selectedFile = null
    state.cache(AceEditor, 'editor').editor.setValue('')
    window.diskBus.emit('update-folder', state.diskFolder)
  })
  window.diskBus.on('file-renamed', (filename) => {
    state.renamingFile = false
    state.selectedFile = filename
    if (state.diskFolder) {
      window.diskBus.emit('update-folder', state.diskFolder)
    } else {
      emitter.emit('render')
    }
  })
}

function extractREPLMessage(buffer) {
  let beginIndex = buffer.indexOf('<BEGINREC>')
  let endIndex = buffer.indexOf('<ENDREC>')
  if (beginIndex !== -1 && endIndex !== -1) {
    return buffer.substring(
      beginIndex + ('<BEGINREC>').length,
      endIndex
    )
  } else {
    return false
  }
}
