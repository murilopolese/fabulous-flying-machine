import { html } from '../libs/lit-html/lit-html.js';
import Modal from './modal.js'

function UploadDialog(state, emit) {
  function onChange(e) {
    emit('CHANGE_UPLOAD_FILE', e.target.value)
  }
  const content = html`
    <h4>Save file:</h4>
    <input type="text" @change=${onChange} value=${state.uploadFileName} />
  `
  const footer = html`
    <a
      class="modal-close waves-effect waves-red btn-flat"
      @click=${() => emit('CLOSE_UPLOAD_DIALOG')}
      >
      Close
    </a>
    <a
      class="modal-close waves-effect waves-red btn-flat"
      @click=${() => emit('UPLOAD_BOARD_FILE')}
      >
      Save
    </a>
  `
  return Modal({
    isOpen: state.isUploadDialogOpen,
    content: content,
    footer: footer
  })
}

export default UploadDialog
