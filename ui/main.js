import Emitter from './emitter.js'
import initialState from './initialState.js'
import store from './store.js'
import framework from './framework.js'
const { h, render } = framework

const emitter = new Emitter()
const state = initialState

store(state, emitter)

emitter.on('render', () => {
  render('body', App(state, emitter.emit))
})

window.serialBus.on('connected', (port) => {
  emitter.emit('CONNECTED')
  emitter.emit('OPEN_CONSOLE')
  emitter.emit('CLOSE_PORT_DIALOG')
})
window.serialBus.on('disconnected', (port) => {
  emitter.emit('DISCONNECTED')
  emitter.emit('CLOSE_CONSOLE')
})
window.serialBus.on('running', () => {
  emitter.emit('RUNNING')
})
window.serialBus.on('stopped', () => {
  emitter.emit('STOPPED')
})
window.serialBus.on('file-loaded', (data) => {
  emitter.emit('CHANGE_EDITOR', data)
})
window.serialBus.on('file-list-loaded', (data) => {
  let dataJson = []
  try {
    dataJson = JSON.parse(data.split(`'`).join(`"`))
  } catch (e) {
    console.log('problem loading files', data, state)
  }
  emitter.emit('LOAD_FILE_LIST', dataJson)
})
window.serialBus.on('data', (data) => {
  let buffer = Buffer.from(data)
  emitter.emit('CONSOLE_CONTENT', buffer.toString())
})
window.serialBus.on('ports', (ports) => {
  emitter.emit('LOAD_PORTS', ports)
})

function App(state, emit) {
  return h('div', { id: 'app' },
    h('div', { id: 'toolbar' },
      h('button', { click: () => console.log('poop') }, 'connect'),
      h('button', { click: () => console.log('poop') }, 'play'),
      h('button', { click: () => console.log('poop') }, 'stop'),
      h('button', { click: () => console.log('poop') }, 'reset'),
      h('button', { click: () => console.log('poop') }, 'console'),
      h('button', { click: () => console.log('poop') }, 'save file'),
      h('button', { click: () => console.log('poop') }, 'load file'),
      h('button', { click: () => console.log('poop') }, 'download'),
      h('button', { click: () => console.log('poop') }, 'upload')
    ),
    h('div', { id: 'code' }),
    h('div', { id: 'console' })
  )
}

window.onload = () => {
  emitter.emit('render', App(state, emitter.emit))

  const editor = ace.edit("code")
  editor.setFontSize(18)
  editor.setTheme("ace/theme/github")
  editor.session.setMode("ace/mode/python")

  const term = new Terminal()
  const fitAddon = new FitAddon.FitAddon()
  term.loadAddon(fitAddon)
  term.open(document.getElementById('console'))
  fitAddon.fit()
}
