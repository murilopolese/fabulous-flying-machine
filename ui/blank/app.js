function RoundButton(props, children) {
  const { onClick = () => false } = props
  return html`<button class="round" onclick=${onClick}>${children}</button>`
}

function SquareButton(props, children) {
  const { onClick = () => false } = props
  return html`<button class="square" onclick=${onClick}>${children}</button>`
}

function TinyButton(props, children) {
  const { onClick = () => false } = props
  return html`<button class="tiny" onclick=${onClick}>${children}</button>`
}

function Resizable() {

}

function Dialog() {

}

function Toolbar(state, emit) {
  return html`
    <div id="toolbar" class="row fill-horizontal gray">
      <div>
        ${RoundButton({}, 'P')}
        ${RoundButton({}, 'S')}
        ${RoundButton({}, 'R')}
      </div>
      <div class="fill row justify-center align-center">
        ${SquareButton({}, 'x')}
        ${SquareButton({}, 'x')}
        ${SquareButton({}, 'x')}
        ${SquareButton({}, 'x')}
      </div>
      <div>
        ${RoundButton({}, 'C')}
      </div>
    </div>
  `
}

function Workspace(state, emit) {
  return html`
  <div id="workspace" class="row fill">
    <div id="panel" class="column lightgray">
      ${FileActions(state, emit)}
      ${FileList(state, emit)}
    </div>
    <div id="main" class="column fill">
      ${FileHeader(state, emit)}
      ${Editor(state, emit)}
    </div>
  </div>
  `
}

function Console() {
  return html`
    <div id="console" class="column fill-horizontal black">
      <div id="bar" class="fill-horizontal gray"></div>
      <div id="terminal"></div>
    </div>
  `
}

function FileActions(state, emit) {
  return html`
    <div id="file-actions" class="row fill-horizontal align-center">
      ${TinyButton({}, 'N')}
      ${TinyButton({}, 'U')}
      ${TinyButton({}, 'R')}
      ${TinyButton({}, 'D')}
    </div>
  `
}

function FileList(state, emit) {
  return html`
    <ul id="file-list" class="column">
      <li>main.py</li>
      <li><input value="boot.py" /></li>
      <li>libs.py</li>
      <li>example_button.py</li>
      <li>tutorial.py</li>
    </ul>
  `
}

function FileHeader(state, emit) {
  return html`
    <div id="file-header" class="row fill-horizontal align-center lightgray">
      <button class="tiny">F</button>
      <div id="file-name" class="row fill-horizontal">main.py</div>
    </div>
  `
}

function Editor() {
  return html`<div id="editor" class="fill"></div>`
}


function App(state, emit) {
  return html`
    <div id="app" class="column fill">
      ${Toolbar(state, emit)}
      ${Workspace(state, emit)}
      ${Console(state, emit)}
    </div>
  `
}

window.addEventListener('load', () => {
  let app = Choo()
  app.route('*', App)
  app.mount('#app')
})
