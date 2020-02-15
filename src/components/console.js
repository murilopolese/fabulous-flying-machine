import React from 'react'
import { Box } from '@material-ui/core'

class Console extends React.Component {
	constructor(props) {
		super(props)
	}
	handleKeyDown(e) {
		e.preventDefault()
		if (this.props.onKeyDown) {
			this.props.onKeyDown(e)
		}
		if (this.refs.content) {
			this.refs.term.scrollTo(0, this.refs.content.offsetHeight)
		}
		return false
	}
	render() {
		const termStyle = {
				position: 'relative',
				overflow: 'scroll',
				width: '100%',
				height: '100%',
				padding: '10px',
				boxSizing: 'border-box'
		}
		const inputStyle = {
			position: 'absolute',
			top: 0,
			left: 0	,
			width: '100%',
			minHeight: '100%',
			height: this.refs.content ? this.refs.content.offsetHeight : '100%',
			background: 'none',
			outline: 'none',
			border: 'none',
			color: 'transparent'
		}
		setTimeout(() => {
			if (this.refs.content) {
				this.refs.term.scrollTo(0, this.refs.content.offsetHeight)
			}
		}, 0)
		return (
				<div ref='term' style={termStyle}>
					<pre ref='content'>{this.props.data}</pre>
					<input type="text" onKeyDown={this.handleKeyDown.bind(this)} style={inputStyle}/>
				</div>
		)
	}
}

export default Console
