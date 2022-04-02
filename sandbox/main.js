class ResizeHandler extends Component {
  constructor(id, state, emit) {
    super()
    this.emit = emit
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }
  createElement() {
    return html`<div class="resize-handle" onmousedown=${this.onMouseDown}></div>`
  }
  update() {
    return true
  }
  onMouseDown(e) {
    document.addEventListener('mouseup', this.onMouseUp, { once: true })
    document.addEventListener('mousemove', this.onMouseMove)
  }
  onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove)
  }
  onMouseMove(e) {
    this.emit('resize-panel', e.clientY)
    return false
  }
}

class XTerm extends Component {
  constructor(id, state, emit) {
    super()
    this.term = new Terminal()
    this.resizeTerm = this.resizeTerm.bind(this)
  }

  createElement() {
    return html`<div class="fill"></div>`
  }

  load(element) {
    this.term.open(element)
    this.resizeTerm()
    window.addEventListener('resize', this.resizeTerm)
  }

  update() {
    this.resizeTerm()
    return false
  }

  resizeTerm() {
    const parentStyle = window.getComputedStyle(this.term.element.parentElement)
    const parentWidth = parseInt(parentStyle.getPropertyValue('width'))
    const parentHeight = parseInt(parentStyle.getPropertyValue('height'))
    const cols = Math.floor(parentWidth / this.term._core._renderService.dimensions.actualCellWidth)
    const rows = Math.floor(parentHeight / this.term._core._renderService.dimensions.actualCellHeight)
    this.term.resize(cols, rows)
  }
}

function mainView(state, emit) {
  function write() {
    state.cache(XTerm, 'terminal').term.writeln('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ' + Date.now())
  }
  return html`
    <body>
      <div id="app" class="column">
        <div>
          <button onclick=${write}>Write</button>
        </div>
        <div style="flex: 1 1 0%;">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        ${state.cache(ResizeHandler, 'resize-handler').render()}
        <div class="panel" style="height: ${state.panelHeight}px">
          ${state.cache(XTerm, 'terminal').render()}
        </div>
    </body>
  `
}

function store(state, emitter) {
  state.panelHeight = 200

  emitter.on('resize-panel', (y) => {
    state.panelHeight = Math.abs(window.innerHeight - y - (window.innerHeight*0.0175))
    emitter.emit('render')
  })
}

const app = Choo()
app.use(store)
app.route('*', mainView)

window.addEventListener('load', () => {
  app.mount('body')
})
