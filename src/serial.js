import store from './store.js'

// Once this file is loaded it will call this function with the current
// serial bus
window.onSerialBusReady = function(bus) {
	window.serialBus = bus

	window.serialBus.on('connected', (port) => {
		console.log('connected to port', port)
		store.dispatch({ type: 'CONNECTED' })
		store.dispatch({ type: 'OPEN_CONSOLE' })
		store.dispatch({ type: 'CLOSE_PORT_DIALOG' })
	})
	window.serialBus.on('disconnected', (port) => {
		console.log('disconnected to port', port)
		store.dispatch({ type: 'DISCONNECTED' })
		store.dispatch({ type: 'CLOSE_CONSOLE' })
	})
	window.serialBus.on('running', () => {
		console.log('code is running')
		store.dispatch({ type: 'RUNNING' })
	})
	window.serialBus.on('stopped', () => {
		console.log('code execution is stopped')
		store.dispatch({ type: 'STOPPED' })
	})

	window.serialBus.on('data', (data) => {
		console.log('serial data arrived', Buffer.from(data))
		let backspace = Buffer.from([8, 27, 91, 75])
		if (Buffer.from(data).equals(backspace)) {
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
		console.log('received ports on frontend', ports)
		store.dispatch({ type: 'LOAD_PORTS', payload: ports })
	})
}
