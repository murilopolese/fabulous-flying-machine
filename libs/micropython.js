const EventEmitter = require('events')
const SerialPort = require('serialport')

const codeListFiles = `print(' ')
from os import listdir
print(listdir())
`
const codeLoadFile = (path) => {
return `print(' ')
with open('${path}', 'r') as f:
    for line in f.readlines():
        print(line.replace('\\n', ''))
`
}

const codeRemoveFile = (path) => {
return `from os import remove
remove('${path}')
`
}

const codeCollectGarbage = `import gc
gc.collect()
`

class SerialConnection extends EventEmitter {
    constructor() {
        super()
        this.rawRepl = false
    }
    /**
    * List all available serial ports (with vendor id)
    * @return {Promise} Resolves with an array of port objects
    */
    static listAvailable() {
        return new Promise((resolve, reject) => {
            SerialPort.list().then((ports) => {
                const availablePorts = ports.filter((port) => {
                    return !!port.vendorId
                })
                if (availablePorts) {
                    resolve(availablePorts)
                } else {
                    reject(new Error('No ports available'))
                }
            })
        })
    }
    /**
    * Opens a connection on a given port.
    * @param {String} port Port address to open the connection
    */
    open(port) {
        this.port = new SerialPort(port, {
            baudRate: 115200,
            autoOpen: false
        })
        this.port.on('open', () => {
            this.emit('connected')
            this.port.write('\r')
        })
        this.port.on('data', (data) => this._eventHandler(data))
        this.port.open()
    }
    /**
    * Closes current connection.
    */
    close() {
        this.emit('disconnected')
        if (this.port) {
            this.port.close()
        }
    }
    /**
    * Executes code in a string format. This code can contain multiple lines.
    * @param {String} code String of code to be executed. Line breaks must be `\n`
    */
    execute(code) {
        // TODO: break code in lines and `_execRaw` line by line
        this.stop()
        this._enterRawRepl()
        this._executeRaw(code)
            .then(() => {
                this._exitRawRepl()
            })
    }
    /**
    * Evaluate a command/expression.
    * @param {String} command Command/expression to be evaluated
    */
    evaluate(command) {
        this.port.write(Buffer.from(command))
    }
    /**
    * Send a "stop" command in order to interrupt any running code. For serial
    * REPL this command is "CTRL-C".
    */
    stop() {
        this.port.write('\r\x03') // CTRL-C
    }
    /**
    * Send a command to "soft reset".
    */
    softReset() {
        this.stop();
        this.port.write('\r\x04') // CTRL-D
    }
    /**
    * Prints on console the existing files on file system.
    */
    listFiles() {
        this.execute(codeListFiles)
    }
    /**
    * Prints on console the content of a given file.
    * @param {String} path File's path
    */
    loadFile(path) {
        this.execute(codeLoadFile(path))
    }
    /**
    * Writes a given content to a file in the file system.
    * @param {String} path File's path
    * @param {String} content File's content
    */
    writeFile(path, content) {
        if (!path || !content) {
            return
        }
        // TODO: Find anoter way to do it without binascii
        let pCode = `import binascii; f = open('${path}', 'w')\n`
        pCode += `import gc; gc.collect\n`
        // `content` is what comes from the editor. We want to write it
        // line one by one on a file so we split by `\n`
        content.split('\n').forEach((line) => {
            if (line) {
                // To avoid the string escaping with weirdly we encode
                // the line plus the `\n` that we just removed to base64
                const l = Buffer.from(`${line}\n`).toString('base64')
                pCode += `f.write(binascii.a2b_base64("${l}"))\n`
            }
        })
        pCode += 'f.close()\n'
        this.execute(pCode)
    }
    /**
    * Removes file on a given path
    * @param {String} path File's path
    */
    removeFile(path) {
        this.execute(codeRemoveFile(path))
    }

    /**
    * Handles data comming from connection
    * @param {Buffer} buffer Data comming from connection
    */
    _eventHandler(buffer) {
        const data = buffer.toString()
        this.emit('output', data)

        if (this.rawRepl && data.indexOf('>>>') != -1) {
            this.emit('execution-finished')
            this.rawRepl = false
        }

        if (!this.rawRepl && data.indexOf('raw REPL;') != -1) {
            this.emit('execution-started')
            this.rawRepl = true
        }
    }
    /**
    * Put REPL in raw mode
    */
    _enterRawRepl() {
        console.log('enter raw repl')
        this.port.write('\r\x01') // CTRL-A
    }
    /**
    * Exit REPL raw mode
    */
    _exitRawRepl() {
        this.port.write('\r\x04\r\x02') // CTRL-D // CTRL-B
    }
    /**
    * Writes a command to connected port
    * @param {String} command Command to be written on connected port
    */
    _executeRaw(command) {
        const writePromise = (buffer) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.port.write(buffer, (err) => {
                        if (err) return reject()
                        resolve()
                    })
                }, 1)
            })
        }
        const l = 1024
        let slices = []
        for(let i = 0; i < command.length; i+=l) {
            let slice = command.slice(i, i+l)
            slices.push(slice)
        }
        return new Promise((resolve, reject) => {
            slices.reduce((cur, next) => {
                return cur.then(() => {
                    return writePromise(next)
                })
            }, Promise.resolve())
            .then()
            .then(() => {
                resolve()
            })
        })
    }
}

module.exports = SerialConnection
