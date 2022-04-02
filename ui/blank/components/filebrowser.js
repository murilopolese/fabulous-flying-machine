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
