import './main.css'
import React from 'react'
import { render } from 'react-dom'
import App from './components/app.js'

import store from './store.js'
import './serial.js'

// This will load dinamically the renderer file from Electron
window.onload = function() {
	var scriptElm = document.createElement('script');
	scriptElm.src = '../../renderer.js';
	document.body.appendChild(scriptElm);
}

const renderStore = () => {
	render(
		<App state={store.getState()} />,
		document.getElementById("app")
	)
}

renderStore()
store.subscribe(renderStore)
