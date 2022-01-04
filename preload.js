console.log('preload')
const EventEmitter = require('events')
const SerialConnection = require('./micropython.js')

const serialBus = new EventEmitter()
let port = null
let connection = null
const SERIAL_BUFFER_SIZE = 128

serialBus.on('load-ports', () => {
	SerialConnection.listAvailable()
		.then((ports) => {
			serialBus.emit('ports', ports)
		})
		.catch((err) => {
			console.log(err)
		})
})

serialBus.on('connect', (p) => {
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
	connection.on('file-loaded', (data) => {
		serialBus.emit('file-loaded', data)
	})
	connection.on('file-list-loaded', (data) => {
		serialBus.emit('file-list-loaded', data)
	})
	connection.open(p)
})
serialBus.on('disconnect', () => {
	connection.close()
	serialBus.emit('disconnected')
})

serialBus.on('run', (code) => {
	connection.execute(code)
	serialBus.emit('running')
})

serialBus.on('stop', (code) => {
	connection.stop()
	serialBus.emit('stopped')
})

serialBus.on('reset', (code) => {
	connection.softReset()
	serialBus.emit('stopped')
})

serialBus.on('write', (command) => {
	connection.evaluate(command)
})

serialBus.on('save-file', (filename, code) => {
	connection.writeFile(filename, code)
})
serialBus.on('save-test-file', () => {
	connection.saveFileToBoard()
})
serialBus.on('load-file', (filename) => {
	connection.loadFile(filename)
})

serialBus.on('list-files', () => {
	connection.listFiles()
})

serialBus.on('remove-file', (filename) => {
	connection.removeFile(filename)
})

window.serialBus = serialBus
