function Editor(state, emit) {
  return html`
    <div id="file-header" class="row lightgray align-center">
      <div class="device-icon">${Image({ src: 'icons/folder.png' })}</div>
      <div class="file-name">main.py</div>
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
    this.editor.setValue(
`i = 0
while i < 1000:
  print(i)
  i+= 1
`
)
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
