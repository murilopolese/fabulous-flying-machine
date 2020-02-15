import store from './store.js'

// Once this file is loaded it will call this function with the current
// serial bus
window.onSerialBusReady = function(bus) {
	window.serialBus = bus

	window.serialBus.on('connected', (port) => {
		store.dispatch({ type: 'CONNECTED' })
		store.dispatch({ type: 'OPEN_CONSOLE' })
		store.dispatch({ type: 'CLOSE_PORT_DIALOG' })
	})
	window.serialBus.on('disconnected', (port) => {
		store.dispatch({ type: 'DISCONNECTED' })
		store.dispatch({ type: 'CLOSE_CONSOLE' })
	})
	window.serialBus.on('running', () => {
		store.dispatch({ type: 'RUNNING' })
	})
	window.serialBus.on('stopped', () => {
		store.dispatch({ type: 'STOPPED' })
	})
	window.serialBus.on('file-loaded', (data) => {
		store.dispatch({
			type: 'CHANGE_EDITOR',
			payload: data
		})
	})
	window.serialBus.on('file-list-loaded', (data) => {
		let dataJson = []
		try {
			dataJson = JSON.parse(data.split(`'`).join(`"`))
		} catch (e) {
			console.log('problem loading files', data, state)
		}
		store.dispatch({
			type: 'LOAD_FILE_LIST',
			payload: dataJson
		})
	})

	window.serialBus.on('data', (data) => {
		let buffer = Buffer.from(data)
		let backspace1 = Buffer.from([8, 27, 91, 75])
		let backspace2 = Buffer.from([8, 32, 8])
		if (buffer.equals(backspace1) || buffer.equals(backspace2)) {
			store.dispatch({
				type: 'POP_CONSOLE_CONTENT'
			})
		} else {
			store.dispatch({
				type: 'APPEND_CONSOLE_CONTENT',
				payload: data
			})
		}
	})

	window.serialBus.on('ports', (ports) => {
		store.dispatch({ type: 'LOAD_PORTS', payload: ports })
	})
}
