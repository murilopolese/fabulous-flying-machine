import React from 'react'
import {
	Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
	TextField, Button, List, ListItem, ListItemText, Typography
} from '@material-ui/core';

class LoadDialog extends React.Component {
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
	onFilenameClick(filename) {
		this.setState({
			filename: filename,
			isFilenameEmpty: filename === ''
		})
	}

	handleLoad() {
		if (this.props.handleLoad) {
			this.props.handleLoad(this.state.filename)
		}
	}
	handleClose() {
		if (this.props.handleClose()) {
			this.props.handleClose()
		}
	}
	render() {
		let files = []
		if (this.props.files) {
			files = this.props.files
		}
		return (
			<Dialog open={this.props.open}
				onClose={this.handleClose.bind(this)}
				aria-labelledby="save-dialog-title">
				<DialogTitle id="save-dialog-title">Load file from board to editor</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Make sure to save the work you have done. This will replace the
						content of the editor.
					</DialogContentText>
					<List>
						{files.map((file) => {
							return (
								<ListItem button onClick={() => this.onFilenameClick(file)} key={file}>
									<ListItemText primary={file} />
								</ListItem>
							)
						})}
					</List>
					<Typography>{this.state.filename}</Typography>
				</DialogContent>
				<DialogActions>
					<Button disabled={this.state.isFilenameEmpty} onClick={this.handleLoad.bind(this)} color="secondary">
						Load
					</Button>
					<Button onClick={this.handleClose.bind(this)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

export default LoadDialog
