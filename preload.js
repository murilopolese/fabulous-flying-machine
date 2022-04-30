console.log('preload')
const { ipcRenderer } = require('electron')
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


const diskBus = new EventEmitter()

diskBus.on('list-folder', () => {
	console.log('diskBus', 'list-folder')
	ipcRenderer.invoke('list-folder')
		.then((result) => {
			diskBus.emit('folder-listed', result)
		})
})

diskBus.on('load-file', ({ folder, filename }) => {
	console.log('diskBus', 'load-file', folder, filename)
	ipcRenderer.invoke('load-file', folder, filename)
		.then((result) => {
			diskBus.emit('file-loaded', result)
		})
})

diskBus.on('save-file', ({ folder, filename, content }) => {
	console.log('diskBus', 'save-file', folder, filename, content)
	ipcRenderer.invoke('save-file', folder, filename, content)
		.then((result) => {
			if (result) {
				diskBus.emit('file-saved')
			} else {
				console.log('error', result)
			}
		})
})

diskBus.on('update-folder', (folder) => {
	console.log('diskBus', 'update-folder', folder)
	ipcRenderer.invoke('update-folder', folder)
		.then((results) => {
			diskBus.emit('folder-listed', results)
		})
})

window.diskBus = diskBus
