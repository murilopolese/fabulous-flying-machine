function Toolbar(state, emit) {
  const runButton = RoundButton(
    { onclick: () => emit('run'), disabled: !state.connected },
    Image({src: 'icons/play_arrow.png'})
  )
  const stopButton = RoundButton(
    { onclick: () => emit('stop'), disabled: !state.connected },
    Image({src: 'icons/stop.png'})
  )
  const resetButton = RoundButton(
    { onclick: () => emit('reset'), disabled: !state.connected },
    Image({src: 'icons/reset.png'})
  )
  const connectButton = RoundButton(
    { onclick: () => emit('open-port-dialog') },
    Image({src: 'icons/cable.png'})
  )

  const openFolderButton = RoundButton(
    { onclick: () => emit('list-disk-folder') },
    Image({src: 'icons/folder.png'})
  )
  const saveButton = RoundButton(
    { onclick: () => emit('save-editor') },
    Image({src: 'icons/sd_storage.png'})
  )

  return html`
    <div id="toolbar" class="row gray">
      <div class="row">
        ${runButton}
        ${stopButton}
        ${resetButton}
      </div>
      <div class="row fill justify-start align-center">
        ${openFolderButton}
        ${saveButton}
      </div>
      <div class="row">
        ${connectButton}
      </div>
    </div>
  `
}
