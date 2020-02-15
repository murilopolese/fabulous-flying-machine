import React from 'react'
import { Box } from '@material-ui/core'
import Menu from './menu.js'
import Editor from './editor.js'
import Console from './console.js'
import SerialDialog from './serialdialog.js'
import SaveDialog from './savedialog.js'
import LoadDialog from './loaddialog.js'
import { saveAs } from 'file-saver';

import store from '../store.js'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.state
		setTimeout(() => {
			store.dispatch({
				type: 'LOAD_CONSOLE_CONTENT',
				payload: `Hello and Welcome!\nI'm your console.\n>>> `
			})
		}, 0)
	}
	componentDidMount() {
		if (this.refs.fileInput) {
			this.refs.fileInput.addEventListener('change', (e) => {
				const reader = new FileReader()
				if (this.refs.fileInput.files && this.refs.fileInput.files[0]) {
					reader.onload = () => {
						store.dispatch({ type: 'CHANGE_EDITOR', payload: reader.result })
						this.refs.fileInput.value = ''
					}
					reader.readAsText(this.refs.fileInput.files[0])
				}
			})
		}
	}

	// Code editpr
	onEditorChange(value) {
		store.dispatch({ type: 'CHANGE_EDITOR', payload: value })
	}

	// Connecting
	openPortDialog() {
		window.serialBus.emit('load-ports')
		store.dispatch({ type: 'OPEN_PORT_DIALOG' })
	}
	closePortDialog() {
		store.dispatch({ type: 'CLOSE_PORT_DIALOG' })
	}
	connectToPort(port) {
		store.dispatch({ type: 'SELECT_PORT', payload: port })
		window.serialBus.emit('connect', port)
	}
	refreshPorts() {
		window.serialBus.emit('load-ports')
	}
	disconnect() {
		window.serialBus.emit('disconnect')
	}

	// Runtime control
	run() {
		store.dispatch({ type: 'OPEN_CONSOLE' })
		window.serialBus.emit('run', this.props.state.editorValue)
	}
	stop() {
		window.serialBus.emit('stop')
	}
	reset() {
		window.serialBus.emit('stop')
		window.serialBus.emit('reset')
	}

	// Save file to board
	openSaveDialog() {
		store.dispatch({ type: 'OPEN_SAVE_DIALOG' })
	}
	closeSaveDialog() {
		store.dispatch({ type: 'CLOSE_SAVE_DIALOG' })
	}
	handleSaveFile(filename) {
		window.serialBus.emit('save-file', filename, this.props.state.editorValue)
	}

	// Load file from board
	openLoadDialog() {
		store.dispatch({ type: 'START_LOADING_FILE_LIST' })
		window.serialBus.emit('list-files')
		store.dispatch({ type: 'OPEN_LOAD_DIALOG' })
	}
	handleLoadFile(filename) {
		store.dispatch({ type: 'START_LOADING_FILE' })
		window.serialBus.emit('load-file', filename)
	}
	closeLoadDialog() {
		store.dispatch({ type: 'CLOSE_LOAD_DIALOG' })
	}

	// Local files
	loadLocal() {
		if (this.refs.fileInput) {
			this.refs.fileInput.click()
		}
	}
	saveLocal() {
		let blob = new Blob([this.props.state.editorValue], {type: "text/plain;charset=utf-8"})
		saveAs(blob, "script.py");
	}

	// Console
	handleKeyDown(e) {
		switch(e.key) {
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Control':
			case 'Meta':
			case 'Shift':
			case 'Alt':
			case 'Escape':
			case 'NumLock':
			case 'Insert':
			case 'Home':
			case 'End':
			case 'PageUp':
			case 'PageDown':
			case 'CapsLock':
			case 'ContextMenu':
				break
			case 'ArrowDown':
				break
			case 'ArrowUp':
				break
			case 'Tab':
				window.serialBus.emit('write', '\t')
				break
			case 'Backspace':
				window.serialBus.emit('write', '\b')
				break
			case 'Enter':
				window.serialBus.emit('write', `\r\n`)
				break
			default:
				window.serialBus.emit('write', e.key)
		}
	}
	toggleConsole() {
		store.dispatch({ type: 'TOGGLE_CONSOLE' })
	}

	render() {
		const consoleStyle = {
			position: 'relative',
			width: '100%',
			height: '40%',
			position: 'fixed',
			bottom: '0',
			left: '0',
			background: 'black',
			color: 'white',
			zIndex: 99
		}
		return (
			<Box style={{width: '100%', height: '100%'}}>
				<input ref="fileInput" type="file" accept=".py" style={{display: 'none'}} />
				<SaveDialog
					open={this.props.state.isSaveDialogOpen}
					handleSave={this.handleSaveFile.bind(this)}
					handleClose={this.closeSaveDialog.bind(this)}
				/>
				<LoadDialog
					open={this.props.state.isLoadDialogOpen}
					files={this.props.state.files}
					handleLoad={this.handleLoadFile.bind(this)}
					handleClose={this.closeLoadDialog.bind(this)}
				/>
				<SerialDialog
					ports={this.props.state.ports}
					open={this.props.state.isPortDialogOpen}
					handleClose={this.closePortDialog}
					connectToPort={this.connectToPort}
					refreshPorts={this.refreshPorts}
					/>
				<Box style={{width: '100%', height: '70px'}}>
					<Menu
						connected={this.props.state.connected}
						running={this.props.state.running}
						openPortDialog={this.openPortDialog}
						disconnect={this.disconnect.bind(this)}
						toggleConsole={this.toggleConsole}
						run={this.run.bind(this)}
						stop={this.stop}
						reset={this.reset}
						upload={this.openSaveDialog.bind(this)}
						download={this.openLoadDialog.bind(this)}
						loadLocal={this.loadLocal.bind(this)}
						saveLocal={this.saveLocal.bind(this)}
					/>
				</Box>
				<Box style={{width: '100%', height: 'calc(100% - 70px)'}}>
					<Editor
						onChange={this.onEditorChange}
						value={this.props.state.editorValue}
						/>
				</Box>
				<Box hidden={!this.props.state.isConsoleOpen} style={consoleStyle}>
					<Console
						data={this.props.state.consoleContent}
						onKeyDown={this.handleKeyDown}
					/>
				</Box>
			</Box>
		)
	}
}

export default App
