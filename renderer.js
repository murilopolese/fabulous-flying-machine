console.log('renderer')

const EventEmitter = require('events')
const SerialConnection = require('../../libs/micropython.js')

const serialBus = new EventEmitter()
let port = null
let connection = null
const SERIAL_BUFFER_SIZE = 128

serialBus.on('load-ports', () => {
	console.log('loading ports')
	SerialConnection.listAvailable()
		.then((ports) => {
			serialBus.emit('ports', ports)
		})
		.catch((err) => {
			console.log('error', err)
		})
})

serialBus.on('connect', (p) => {
	console.log('connecting to port', p)
	connection = new SerialConnection()
	connection.on('connected', () => {
		serialBus.emit('connected', p)
	})
	connection.on('disconnected', () => {
		serialBus.emit('disconnected', p)
	})
	connection.on('output', (d) => {
		serialBus.emit('data', d)
	})
	connection.on('execution-started', () => {
		serialBus.emit('running')
	})
	connection.on('execution-finished', () => {
		serialBus.emit('stopped')
	})
	connection.open(p)
})
serialBus.on('disconnect', () => {
	console.log('disconnecting to port')
	connection.close()
	serialBus.emit('disconnected')
})

serialBus.on('run', (code) => {
	console.log('running code', code)
	connection.execute(code)
	serialBus.emit('running')
})

serialBus.on('stop', (code) => {
	console.log('stopping code')
	connection.stop()
	serialBus.emit('stopped')
})

serialBus.on('reset', (code) => {
	console.log('reseting board')
	connection.softReset()
	serialBus.emit('stopped')
})

serialBus.on('write', (command) => {
	console.log('write command', command, Buffer.from(command))
	connection.evaluate(command)
})

serialBus.on('save-file', (filename, code) => {
	console.log('save file', filename, code)
	connection.writeFile(filename, code)
})

serialBus.on('load-file', (filename) => {
	console.log('load file', filename)
	connection.loadFile(filename)
})

serialBus.on('remove-file', (filename) => {
	console.log('remove file', filename)
	connection.removeFile(filename)
})

if (window.onSerialBusReady) {
	window.onSerialBusReady(serialBus)
}
