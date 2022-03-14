import { html } from '../libs/lit-html/lit-html.js';
import Modal from './modal.js'

function PortDialog(state, emit) {
  const ports = state.ports.map(port => {
    return html`
      <li class="collection-item">
        <div>
          ${port.path}
          <a
            class="secondary-content"
            @click=${() => emit('CONNECT', port.path)}
            >
            <i class="material-icons">forward</i>
          </a>
        </div>
      </li>
    `
  })
  const content = html`
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Serial Ports:</h4>
      </li>
      ${ports}
    </ul>
  `
  const footer = html`
    <a
      class="modal-close waves-effect waves-red btn-flat"
      @click=${() => emit('CLOSE_PORT_DIALOG')}
      >
      Close
    </a>
    <a
      class="modal-close waves-effect waves-red btn-flat"
      @click=${() => window.serialBus.emit('load-ports')}
      >
      Refresh ports
    </a>
  `
  return Modal({
    isOpen: state.isPortDialogOpen,
    content: content,
    footer: footer
  })
}

export default PortDialog
