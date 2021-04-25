import { html } from '../libs/lit-html/lit-html.js';
import Modal from './modal.js'

function DownloadDialog(state, emit) {
  const files = state.files.map(file => {
    return html`
      <li class="collection-item">
        <div>
          ${file}
          <a
            class="secondary-content"
            @click=${() => emit('LOAD_BOARD_FILE', file)}
            >
            <i class="material-icons">forward</i>
          </a>
          <a
            class="secondary-content"
            @click=${() => emit('REMOVE_BOARD_FILE', file)}
            >
            <i class="material-icons">delete_forever</i>
          </a>
        </div>
      </li>
    `
  })
  const content = html`
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Files in the board:</h4>
      </li>
      ${files}
    </ul>
  `
  const footer = html`
    <a
      class="modal-close waves-effect waves-red btn-flat"
      @click=${() => emit('CLOSE_DOWNLOAD_DIALOG')}
      >
      Close
    </a>
  `
  return Modal({
    isOpen: state.isDownloadDialogOpen,
    content: content,
    footer: footer
  })
}

export default DownloadDialog
