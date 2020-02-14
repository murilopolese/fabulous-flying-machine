import React from 'react'
import {
	Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
	TextField, Button
} from '@material-ui/core';

class SaveDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isFilenameEmpty: true,
			filaneme: ''
		}
	}
	onFilenameChange(event) {
		let value = event.target.value
		this.setState({ filename: value })
		if (value === '' && !this.state.isFilenameEmpty) {
			this.setState({ isFilenameEmpty: true })
		}
		if (value !== '' && this.state.isFilenameEmpty) {
			this.setState({ isFilenameEmpty: false })
		}
	}

	handleSave() {
		if (this.props.handleSave) {
			this.props.handleSave(this.state.filename)
		}
	}
	handleClose() {
		if (this.props.handleClose()) {
			this.props.handleClose()
		}
	}
	render() {
		return (
			<Dialog open={this.props.open}
				onClose={this.handleClose.bind(this)}
				aria-labelledby="save-dialog-title">
				<DialogTitle id="save-dialog-title">Save current code as</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Use the filenames <code>boot.py</code> and <code>main.py</code> to execute, in this order, every time the board turns on.
					</DialogContentText>
					<TextField
						autoFocus
						value={this.state.filename}
						onChange={this.onFilenameChange.bind(this)}
						margin="dense"
						id="savefilename"
						label="File Name"
						type="text"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button disabled={this.state.isFilenameEmpty} onClick={this.handleSave.bind(this)} color="secondary">
						Save
					</Button>
					<Button onClick={this.handleClose.bind(this)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

export default SaveDialog
