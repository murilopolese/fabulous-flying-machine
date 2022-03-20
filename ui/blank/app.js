function Button(props, children) {
  const { className = '', onclick = () => false, disabled = false } = props
  return html`<button
      class="${className}"
      onclick=${onclick}
      disabled=${disabled}
      >
      ${children}
    </button>
    `
}

function RoundButton(props, children) {
  props.className += ' round'
  return Button(props, children)
}

function SquareButton(props, children) {
  props.className += ' square'
  return Button(props, children)
}

function TinyButton(props, children) {
  props.className += ' tiny'
  return Button(props, children)
}

function Image(props) {
  let { src } = props
  return html`<img src=${src} />`
}

function Dialog(state, emit) {
  function PortItem(port) {
    return html`<li onclick=${() => emit('connect', port)}>${port.path}</li>`
  }
  function closeBackdrop(e) {
    if (e.target.id == 'backdrop') {
      emit('close-port-dialog')
    }
  }
  return html`
    <div id="backdrop" onclick=${closeBackdrop}>
      <div id="dialog">
        <ul>
          ${state.ports.map(PortItem)}
          <li onclick=${() => window.serialBus.emit('load-ports')}>...</li>
        </ul>
      </div>
    </div>
  `
}

function Toolbar(state, emit) {
  return html`
    <div id="toolbar" class="row fill-horizontal gray">
      <div>
        ${RoundButton({ onclick: () => emit('run'), disabled: !state.connected }, Image({src: 'icons/play_arrow.png'}))}
        ${RoundButton({ onclick: () => window.serialBus.emit('stop'), disabled: !state.connected }, Image({src: 'icons/stop.png'}))}
        ${RoundButton({ onclick: () => window.serialBus.emit('reset'), disabled: !state.connected }, Image({src: 'icons/reset.png'}))}
      </div>
      <div class="row fill justify-start align-center">
        ${RoundButton({}, Image({src: 'icons/folder.png'}))}
        ${RoundButton({}, Image({src: 'icons/sd_storage.png'}))}
      </div>
      <div>
        ${RoundButton(
          { onclick: () => emit('open-port-dialog') },
          Image({src: 'icons/cable.png'})
        )}
      </div>
    </div>
  `
}

function Workspace(state, emit) {
  return html`
    <div id="workspace" class="row fill">
      <div id="main" class="column fill">
        ${FileHeader(state, emit)}
        ${Editor(state, emit)}
      </div>
    </div>
  `
}

function FileHeader(state, emit) {
  return html`
    <div id="file-header" class="row fill-horizontal align-center lightgray">
      ${TinyButton({}, Image({src: 'icons/developer_board.png'}))}
      <div id="file-name" class="row fill-horizontal">main.py</div>
    </div>
  `
}

function FileBrowser(state, emit) {
  return html`
    <div id="files" class="row fill">
      <div id="board-files" class="fill">
        <ul id="file-list" class="fill white column">

        </ul>
      </div>
      <div id="file-actions" class="column fill-vertical align-center">
        ${SquareButton({}, Image({src: 'icons/edit.png'}))}
        ${SquareButton({}, Image({src: 'icons/left.png'}))}
        ${SquareButton({}, Image({src: 'icons/right.png'}))}
      </div>
      <div id="system-files" class="fill">
        <ul id="file-list" class="fill white column">

        </ul>
      </div>
    </div>
  `
}

function Panel(state, emit) {
  function onMouseDown(e) {
    if (e.target.id !== 'bar') return
    let panel = document.querySelector('#panel')
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp, { once: true })
  }

  function onMouseMove(e) {
    let panel = document.querySelector('#panel')
    let bar = document.querySelector('#panel #bar')
    let barBounds = bar.getBoundingClientRect()
    state.panelHeight = Math.max(
      window.innerHeight - e.clientY + (barBounds.height*0.5),
      barBounds.height
    )
    panel.style.height = `${state.panelHeight}px`
    if (state.panel === 'terminal') {
      window.fitAddon.fit()
    }
  }

  function onMouseUp(e) {
    window.removeEventListener('mousemove', onMouseMove)
  }

  function togglePanel() {
    let bar = document.querySelector('#panel #bar')
    let barBounds = bar.getBoundingClientRect()
    if (state.panelHeight == barBounds.height) {
      state.panelHeight = 200
    } else {
      state.panelHeight = barBounds.height
    }
  }

  function selectFiles() {
    if (state.panel === 'files') {
      emit('toggle-panel')
    } else {
      emit('select-panel', 'files')
    }
  }

  function selectTerminal() {
    if (state.panel === 'terminal') {
      emit('toggle-panel')
    } else {
      emit('select-panel', 'terminal')
    }
  }

  let isTerminalSelected = (state.panel === 'terminal')
  let isFilesSelected = (state.panel === 'files')

  return html`
    <div id="panel" class="gray column fill" style="height: ${state.panelHeight}px">
      <div id="bar" class="row fill align-center justify-end" onmousedown=${onMouseDown}>
        ${SquareButton(
          {
            onclick: selectFiles,
            className: isFilesSelected ? 'active' : 'inactive'
          },
          Image({ src: 'icons/folder.png' })
        )}
        ${SquareButton(
          {
            onclick: selectTerminal ,
            className: isTerminalSelected ? 'active' : 'inactive'
          },
          Image( { src: 'icons/developer_board.png' } )
        )}
      </div>
      ${isTerminalSelected ? state.cache(XTerm, 'terminal').render() : null}
      ${state.panel === 'files' ? FileBrowser(state, emit) : null}
    </div>
  `
}

function App(state, emit) {
  return html`
    <div id="app" class="column fill">
      ${Toolbar(state, emit)}
      ${state.cache(AceEditor, 'editor').render()}
      ${Panel(state, emit)}
      ${state.isPortDialogOpen ? Dialog(state, emit) : null}
    </div>
  `
}

function store(state, emitter) {
  state.connected = false
  state.isPortDialogOpen = false
  state.ports = []
  state.panel = 'terminal'
  state.panelHeight = 200

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
  emitter.on('select-panel', (panel) => {
    console.log('select-panel', panel)
    state.panel = panel
    emitter.emit('render')
  })
  emitter.on('toggle-panel', () => {
    let bar = document.querySelector('#panel #bar')
    let barBounds = bar.getBoundingClientRect()
    if (state.panelHeight == barBounds.height) {
      state.panelHeight = 200
    } else {
      state.panelHeight = barBounds.height
    }
    emitter.emit('render')
  })
  emitter.on('terminal-input', (k) => {
    if (state.connected) {
      window.serialBus.emit('write', k)
    }
  })
  emitter.on('run', () => {
    let editor = state.cache(AceEditor, 'editor').editor
    window.serialBus.emit('run', editor.getValue())
  })

  window.serialBus.on('connected', (port) => {
    console.log('connected', port)
    state.connected = true
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
  })
}

window.addEventListener('load', () => {
  let app = Choo()
  app.use(store);
  app.route('*', App)
  app.mount('#app')
})

class AceEditor extends Component {
  constructor() {
    super()
    this.editor = null
  }

  load(element) {
    this.editor = ace.edit("editor")
    this.editor.setFontSize(18)
    this.editor.setTheme("ace/theme/github")
    this.editor.session.setMode("ace/mode/python")
  }

  createElement(content) {
    return html`<div id="editor" class="fill"></div>`
  }

  update(newContent) {
    if (newContent) {
      this.editor.setValue(newContent)
    }
    return false
  }
}

class XTerm extends Component {
  constructor(id, state, emit) {
    super(id)
    this.emit = emit
    this.term = new Terminal()
    window.fitAddon = new FitAddon.FitAddon()
    this.term.loadAddon(fitAddon)
    this.term.onData((data) => this.emit('terminal-input', data))
  }

  load(element) {
    this.term.open(element)
    window.fitAddon.fit()
  }

  createElement() {
    return html`<div id="terminal" class="black column fill"></div>`
  }

  update() {
    return false
  }
}
