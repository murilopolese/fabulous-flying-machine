import React from 'react'
import { Box } from '@material-ui/core'
import Menu from './menu.js'
import Editor from './editor.js'
import Console from './console.js'
import SerialDialog from './serialdialog.js'
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
	upload() {
		console.log('save file')
		window.serialBus.emit('save-file', 'pixelkit.py', this.props.state.editorValue)
	}
	download() {
		console.log('load file')
		window.serialBus.emit('load-file', 'pixelkit.py')
	}
	handleKeyDown(key) {
		switch(key) {
			case 'Control':
			case 'Meta':
			case 'Shift':
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
				window.serialBus.emit('write', key)
			}
	}
	handleKeyDownLocal(key) {
		let state = this.props.state.consoleContent
		switch(key) {
			case 'Control':
			case 'Meta':
			case 'Shift':
				break
			case 'Tab':
				store.dispatch({
					type: 'APPEND_CONSOLE_CONTENT',
					payload: `\t`
				})
				break
			case 'Backspace':
				if (
					state.slice(-1) !== `\n`
					&& state.slice(-5) !== `\n>>> `
				) {
					store.dispatch({
						type: 'POP_CONSOLE_CONTENT'
					})
				}
				break;
			case 'Enter':
				store.dispatch({
					type: 'APPEND_CONSOLE_CONTENT',
					payload: `\n>>> `
				})
				break
			default:
				store.dispatch({
					type: 'APPEND_CONSOLE_CONTENT',
					payload: key
				})
		}
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
						upload={this.upload.bind(this)}
						download={this.download.bind(this)}
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
