function FileBrowser(state, emit) {
  function DiskFile(file) {
    let selectedClass = ''
    if (state.selectedDevice === 'disk' && state.selectedFile === file) {
      selectedClass = 'selected'
    }
    return html`
      <li
        class=${selectedClass}
        onclick=${() => emit('select-disk-file', file)}
      >
        ${file}
      </li>
    `
  }

  return html`
    <div id="files" class="row fill">
      <div id="board-files" class="fill">
        <ul id="file-list" class="fill white column">

        </ul>
      </div>
      <div id="file-actions" class="column fill-vertical align-center">
        ${SquareButton(
          { onclick: () => emit('send-file-to-board'), disabled: !state.selectedFile },
          Image({src: 'icons/left.png'})
        )}
        ${SquareButton(
          { onclick: () => emit('send-file-to-disk'), disabled: !state.selectedFile },
          Image({src: 'icons/right.png'})
        )}
        ${SquareButton(
          { onclick: () => emit('remove-file'), disabled: !state.selectedFile },
          Image({src: 'icons/delete.png'})
        )}
      </div>
      <div id="system-files" class="fill">
        <ul id="file-list" class="fill white column">
          ${state.diskFiles.map(DiskFile)}
        </ul>
      </div>
    </div>
  `
}
