import { html, render } from './libs/lit-html/lit-html.js';
import Emitter from './libs/emitter.js'

import initialState from './store/initialState.js'

import controlStore from './store/control.js'
import portsStore from './store/port-dialog.js'
import consoleStore from './store/console.js'
import editorStore from './store/editor.js'
import filesBoardStore from './store/files-board.js'
import filesDiskStore from './store/files-disk.js'

import Toolbar from './components/toolbar.js'
import PortDialog from './components/port-dialog.js'
import DownloadDialog from './components/download-dialog.js'
import UploadDialog from './components/upload-dialog.js'

const emitter = new Emitter()
const state = initialState

controlStore(state, emitter)
portsStore(state, emitter)
consoleStore(state, emitter)
editorStore(state, emitter)
filesBoardStore(state, emitter)
filesDiskStore(state, emitter)

emitter.on('RENDER', () => {
  console.log('render')
  render(App(state, emitter.emit.bind(emitter)), document.body)
})

function App(state, emit) {
  function Console(state, emit) {
    return html`<div id="console" class=${state.isConsoleOpen ? '' : 'hidden'}></div>`
  }

  return html`
    <div id="app">
      ${Toolbar(state, emit)}
      <div id="code"></div>
      ${Console(state, emit)}
      ${PortDialog(state, emit)}
      ${DownloadDialog(state, emit)}
      ${UploadDialog(state, emit)}
    </div>
  `
}

window.onload = () => {
  emitter.emit('RENDER')

  state.editor = ace.edit("code")
  state.editor.setFontSize(18)
  state.editor.setTheme("ace/theme/github")
  state.editor.session.setMode("ace/mode/python")
  state.editor.setValue(state.editorValue)

  state.editor.on('change',
    (e) => emitter.emit('CHANGE_EDITOR', state.editor.getValue())
  )

  state.term = new Terminal()
  state.fitAddon = new FitAddon.FitAddon()
  state.term.loadAddon(state.fitAddon)
  state.term.open(document.getElementById('console'))
  state.term.onData((data) => emitter.emit('CONSOLE_CONTENT', data))
}

module.exports = {
  get xtrm() { return state.term}
}
