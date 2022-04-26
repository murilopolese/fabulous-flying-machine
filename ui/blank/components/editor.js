
function Editor(state, emit) {
  const diskIcon = Image({ src: 'icons/folder.png' })
  const serialIcon = Image({ src: 'icons/developer_board.png' })
  let icon = null
  if (state.selectedDevice === 'serial') icon = serialIcon
  if (state.selectedDevice === 'disk') icon = diskIcon

  return html`
    <div id="file-header" class="row lightgray align-center">
      <div class="device-icon">${icon}</div>
      <div class="file-name">${state.selectedFile}</div>
    </div>
    ${state.cache(AceEditor, 'editor').render()}
  `
}

class AceEditor extends Component {
  constructor() {
    super()
    this.editor = null
  }

  load(element) {
    this.editor = ace.edit("editor")
    this.editor.setFontSize(14)
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
