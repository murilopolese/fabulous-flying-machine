import React from 'react'
import {
	Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
	TextField, Button
} from '@material-ui/core';

function SaveDialog(props) {
	return (
		<Dialog open={true} onClose={() => console.log('close')} aria-labelledby="save-dialog-title">
			<DialogTitle id="save-dialog-title">Save current code as</DialogTitle>
			<DialogContent>
				<DialogContentText>
					xxxUse the filenames <code>boot.py</code> and <code>main.py</code> to execute, in this order, every time the board turns on.
				</DialogContentText>
				<TextField
					autoFocus
					placeholder="main.py"
					margin="dense"
					id="savefilename"
					label="File Name"
					type="text"
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={true} onClick={() => console.log('save')} color="primary">
					Save
				</Button>
				<Button onClick={() => console.log('close')} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default SaveDialog
