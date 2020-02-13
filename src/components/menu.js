import React from 'react'
import { Box, Fab } from '@material-ui/core'
import {
	Power, PowerOff, PlayArrow, Stop, RotateLeft, Code,
	GetApp, Publish, Save, Folder
} from '@material-ui/icons';

function Menu({
	connected,
	running,
	connect,
	openPortDialog,
	disconnect,
	toggleConsole,
	run,
	stop,
	reset,
	upload,
	download
}) {
	return (
		<Box display="flex" flexDirection="row" justifyContent="space-around">
			<Fab color={connected ? 'primary': 'secondary'}
				aria-label="connect"
				onClick={connected ? disconnect : openPortDialog}>
				{connected ? <PowerOff /> : <Power />}
			</Fab>
			<Fab color="primary" aria-label="run" onClick={run}  disabled={running || !connected}>
				<PlayArrow />
			</Fab>
			<Fab color="primary" aria-label="stop" onClick={stop} disabled={!connected}>
				<Stop />
			</Fab>
			<Fab color="primary" aria-label="reset" onClick={reset} disabled={!connected}>
				<RotateLeft />
			</Fab>
			<Fab color="primary" aria-label="terminal" onClick={toggleConsole} disabled={!connected}>
				<Code />
			</Fab>
			<Fab color="secondary" aria-label="save">
				<Save />
			</Fab>
			<Fab color="secondary" aria-label="open">
				<Folder />
			</Fab>
			<Fab color="primary" aria-label="download" onClick={download} disabled={!connected}>
				<GetApp />
			</Fab>
			<Fab color="primary" aria-label="upload" onClick={upload} disabled={!connected}>
				<Publish />
			</Fab>
		</Box>
	)
}

export default Menu
