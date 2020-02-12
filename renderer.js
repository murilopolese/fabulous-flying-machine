console.log('renderer')

const EventEmitter = require('events')
const SerialPort = require('serialport')

const serialBus = new EventEmitter()
let port = null
const SERIAL_BUFFER_SIZE = 128

serialBus.on('load-ports', () => {
	console.log('loading ports')
	SerialPort.list()
		.then((ports) => {
			serialBus.emit('ports', ports)
		})
		.catch((err) => {
			console.log('error', err)
		})
})

serialBus.on('connect', (p) => {
	console.log('connecting to port', p)
	port = new SerialPort(p, {
		autoOpen: true,
		baudRate: 115200
	})
	port.on('data', (data) => {
		let dataString = data.toString()
		console.log('got data from serial', dataString)
		serialBus.emit('data', dataString)
	})
	port.on('open', () => {
		console.log('connection opened')
		serialBus.emit('connected', port)
	})
	port.on('close', () => {
		serialBus.emit('disconnected')
	})
})
serialBus.on('disconnect', () => {
	console.log('disconnecting to port')
	port.close()
	serialBus.emit('disconnected')
})

serialBus.on('run', (code) => {
	console.log('running code', code)
	let lines = code.split(`\n`)
	port.write(Buffer.from(`\x01`))
	lines.forEach((line) => {
		port.write(Buffer.from(`${line}\n`))
	})
	port.write(Buffer.from(`\x04`))
	port.write(Buffer.from(`\x02`))
	serialBus.emit('running')
})

serialBus.on('stop', (code) => {
	console.log('stopping code')
	port.write(Buffer.from(`\r\x03`))
	serialBus.emit('stopped')
})

serialBus.on('reset', (code) => {
	console.log('reseting board')
	port.write(Buffer.from(`\r\x04`))
	serialBus.emit('stopped')
})

serialBus.on('write', (command) => {
	console.log('write command', Buffer.from(command))
	port.write(Buffer.from(command))
})

if (window.onSerialBusReady) {
	window.onSerialBusReady(serialBus)
}
