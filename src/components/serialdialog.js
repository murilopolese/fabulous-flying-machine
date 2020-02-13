import React from 'react'
import {
	Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Dialog
} from '@material-ui/core';
import {
	Power, PowerOff, Refresh
} from '@material-ui/icons';

function SerialDialog({
	open = false,
	ports = [],
	connectToPort,
	refreshPorts,
	handleClose
}) {
	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="serial-dialog-title">
			<DialogTitle id="serial-dialog-title">Select a serial port to connect</DialogTitle>
			<List>
				{ports.map(port => (
					<ListItem button onClick={() => connectToPort(port.path)} key={port.path}>
						<ListItemAvatar>
							<Avatar>
								<Power />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={port.path} />
					</ListItem>
				))}
				<ListItem autoFocus button onClick={() => refreshPorts()}>
					<ListItemAvatar>
						<Avatar>
							<Refresh />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Refresh ports" />
				</ListItem>
			</List>
		</Dialog>
	)
}

export default SerialDialog
