import { html } from '../libs/lit-html/lit-html.js';
import MenuButton from './menu-button.js'

function Toolbar(state, emit) {
  const buttons = [
    MenuButton({
      click: () => {
        if (state.connected) {
          emit('DISCONNECT')
        } else {
          emit('LOAD_PORTS')
          emit('OPEN_PORT_DIALOG')
        }
      },
      icon: 'power'
    }),
    MenuButton({
      click: () => emit('RUN'),
      icon: 'play_arrow',
      disabled: !state.connected || state.running,
      color: 'blue'
    }),
    MenuButton({
      click: () => emit('STOP'),
      icon: 'stop',
      disabled: !state.connected,
      color: 'blue'
    }),
    MenuButton({
      click: () => emit('RESET'),
      icon: 'refresh',
      disabled: !state.connected || state.running,
      color: 'blue'
    }),
    MenuButton({
      click: () => emit('TOGGLE_CONSOLE'),
      icon: 'code',
      disabled: !state.connected,
      color: 'blue'
    }),
    MenuButton({
      click: () => emit('SAVE_FILE'),
      icon: 'save'
    }),
    MenuButton({
      click: () => emit('OPEN_FILE'),
      icon: 'folder_open'
    }),
    MenuButton({
      click: () => emit('OPEN_DOWNLOAD_DIALOG'),
      icon: 'download',
      disabled: !state.connected,
      color: 'blue'
    }),
    MenuButton({
      click: () => emit('OPEN_UPLOAD_DIALOG'),
      icon: 'upload',
      disabled: !state.connected,
      color: 'blue'
    })
  ]
  function onChange (e) {
    const reader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      reader.onload = () => {
        emit('CHANGE_EDITOR', reader.result)
        e.target.value = ''
      }
      reader.readAsText(e.target.files[0])
    }
  }
  return html`
    <div id="toolbar">
      ${buttons}
      <input
        id="fileInput"
        type="file"
        accept=".py"
        style="display: none"
        @change=${onChange}
        />
    </div>
  `
}

export default Toolbar
