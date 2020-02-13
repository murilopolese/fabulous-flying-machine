# Fabulous Flying Machine

A MicroPython IDE. Tested on following devices:

- ESP8266
- ESP32
- Micro:bit

I draw much of the inspiration for this project from [Processing](https://processing.org) and [Mu Editor](https://codewith.mu/).

## Running from source

1. Build front end
	1. `cd src`
	1. `npm install`
	1. `npm run dev` (this will watch changes on files)
	1. `cd ..` or start a new terminal session
1. Run electron
	1. `npm install`
	1. `npm run dev`

## Where is what?

### Front end (Renderer Process)

Interface lives inside `src` folder and builds to `src/dist`. Build is powered by [Parcel](https://parceljs.org/).

- `components`: React components
	- `app.js`: This is the main app component. This component is the only component that should interact with the redux `store` and `window.serialBus`
- `dist`: Static build of frontend
- `index.html`: Build process entry point
- `main.css`: Main Cascade Style Sheet
- `main.js`: Main Javascript file that will be built with Parcel.
- `serial.js`: Register callback to register `serialBus` event handlers. This function will be called by the `renderer.js` file that runs on the main process of Electron.
- `store.js`: Redux store

### Electron back end (Main Process)

Electron backend consist in two files, `index.js` and `renderer.js`.

- `index.js`: Creates Electron app window and core Electron properties.
- `renderer.js`: Has access to the `window` object that will be available to the renderer process. This file is responsible for creating the `serialBus` and handling the events executing the correct serial functions.

### Serial Bus

The front end will be able to communicate with the hardware serial over this nodejs `EventEmitter` instance that should live at `window.serialBus`.

The events the front end can emit are:
- `list-ports`: Request the list of available serial ports.
- `connect`: Connect to serial port. Called with a string argument `port`.
- `disconnect`: Close current connection.
- `run`: Enters RAW REPL mode, paste content, execute and leaves RAW REPL mode. Called with a string argument `code`.
- `stop`: Sends an interrupt to the board (`ctrl c` or `\r\x03`).
- `reset`: Resets board (`ctrl d` or `\r\x04`).
- `write`: Writes to serial. Called with a string argument `command`.

The events the back end emits are:
- `connected`: When connected to serial port
- `disconnected`: When disconnected to serial port
- `running`: When code is running
- `stopped`: When code is stopped
- `data`: When received data from serial
- `ports`: List all available serial ports. Called with array of serial ports.
