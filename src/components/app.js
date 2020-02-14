import React from 'react'
import { Box } from '@material-ui/core'
import Menu from './menu.js'
import Editor from './editor.js'
import Console from './console.js'
import SerialDialog from './serialdialog.js'
import SaveDialog from './savedialog.js'
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
						console.log('loaded', reader.result)
						store.dispatch({ type: 'CHANGE_EDITOR', payload: reader.result })
						this.refs.fileInput.value = ''
					}
					reader.readAsText(this.refs.fileInput.files[0])
				}
			})
		}
	}
	onEditorChange(value) {
		store.dispatch({ type: 'CHANGE_EDITOR', payload: value })
	}
	toggleConsole() {
		store.dispatch({ type: 'TOGGLE_CONSOLE' })
	}
	run() {
		store.dispatch({ type: 'OPEN_CONSOLE' })
		window.serialBus.emit('run', this.props.state.editorValue)
	}
	stop() {
		window.serialBus.emit('stop')
	}
	openPortDialog() {
		window.serialBus.emit('load-ports')
		store.dispatch({ type: 'OPEN_PORT_DIALOG' })
	}
	closePortDialog() {
		store.dispatch({ type: 'CLOSE_PORT_DIALOG' })
	}
	connect() {
		window.serialBus.emit('connect', this.props.state.selectedPort)
	}
	disconnect() {
		window.serialBus.emit('disconnect')
	}
	reset() {
		window.serialBus.emit('stop')
		window.serialBus.emit('reset')
	}
	connectToPort(port) {
		console.log('selected port', port)
		store.dispatch({ type: 'SELECT_PORT', payload: port })
		window.serialBus.emit('connect', port)
	}
	refreshPorts() {
		console.log('refreshing ports')
		window.serialBus.emit('load-ports')
	}
	openSaveDialog() {
		store.dispatch({ type: 'OPEN_SAVE_DIALOG' })
	}
	closeSaveDialog() {
		store.dispatch({ type: 'CLOSE_SAVE_DIALOG' })
	}
	download() {
	}
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
				window.serialBus.emit('write', Buffer.from('\t'))
				break
			case 'Backspace':
				window.serialBus.emit('write', Buffer.from('\b'))
				break
			case 'Enter':
				window.serialBus.emit('write', Buffer.from(`\r\n`))
				break
			default:
				window.serialBus.emit('write', e.key)
		}
	}
	handleSaveFile(filename) {
		console.log('saving file', filename, this.props.state.editorValue)
		window.serialBus.emit('save-file', filename, this.props.state.editorValue)
	}
	loadLocal() {
		if (this.refs.fileInput) {
			this.refs.fileInput.click()
		}
	}
	saveLocal() {
		console.log('save local')
		let blob = new Blob([this.props.state.editorValue], {type: "text/plain;charset=utf-8"})
		console.log('blob', blob)
		saveAs(blob, "script.py");
		console.log('prompt?')
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
						connect={this.connect.bind(this)}
						openPortDialog={this.openPortDialog}
						disconnect={this.disconnect.bind(this)}
						toggleConsole={this.toggleConsole}
						run={this.run.bind(this)}
						stop={this.stop}
						reset={this.reset}
						upload={this.openSaveDialog}
						download={this.download.bind(this)}
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
