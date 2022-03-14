import { html } from '../libs/lit-html/lit-html.js';

function Modal({isOpen, content, footer}) {
  let modalOpenStyle = ''
  let overlayOpenStyle = ''
  if (isOpen) {
    modalOpenStyle = 'z-index: 1003; display: block; opacity: 1; top: 10%; transform: scaleX(1) scaleY(1);'
    overlayOpenStyle = 'z-index: 1002; display: block; opacity: 0.5;'
  }
  return html`
    <div id="port-modal" class="modal open" tabindex="0" style=${modalOpenStyle}>
      <div class="modal-content">
        ${content}
      </div>
      <div class="modal-footer">
        ${footer}
      </div>
    </div>
    <div class="modal-overlay" style=${overlayOpenStyle}></div>
  `
}

export default Modal
