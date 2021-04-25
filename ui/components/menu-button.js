import { html } from '../libs/lit-html/lit-html.js';

function MenuButton(opts) {
  const {
    click = () => false,
    icon,
    color = 'red accent-3',
    disabled
  } = opts
  let classes = [
    'btn-floating',
    'btn-large',
    'waves-effect',
    'waves-light',
    disabled ? 'disabled' : '',
    color,
  ].join(' ')
  return html`
    <a class=${classes} @click=${click}>
      <i class="material-icons">${icon}</i>
    </a>
  `
}

export default MenuButton
