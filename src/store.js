import { createStore } from 'redux'

const initialState = {
	isConsoleOpen: false,
	connected: false,
	selectedPort: null,
	editorValue: `print('hello micropython')`,
	isPortDialogOpen: false,
	isSaveDialogOpen: false,
	ports: [],
	running: false,
	consoleContent: null
}
const reducer = function(state, action) {
	if (typeof state === 'undefined') {
		return initialState
	}
	switch (action.type) {
		case 'LOAD_PORTS':
			return {
				...state,
				ports: action.payload
			}
			break;
		case 'SELECT_PORT':
			return {
				...state,
				selectedPort: action.payload
			}
			break;
		case 'CHANGE_EDITOR':
			return {
				...state,
				editorValue: action.payload
			}
			break;
		case 'TOGGLE_CONSOLE':
			return {
				...state,
				isConsoleOpen: !state.isConsoleOpen
			}
			break;
		case 'OPEN_CONSOLE':
			return {
				...state,
				isConsoleOpen: true
			}
			break;
		case 'CLOSE_CONSOLE':
			return {
				...state,
				isConsoleOpen: false
			}
			break;
		case 'LOAD_CONSOLE_CONTENT':
			return {
				...state,
				consoleContent: action.payload
			}
			break;
		case 'APPEND_CONSOLE_CONTENT':
			return {
				...state,
				consoleContent: `${state.consoleContent}${action.payload}`
			}
			break;
		case 'POP_CONSOLE_CONTENT':
			return {
				...state,
				consoleContent: `${state.consoleContent.slice(0, -1)}`
			}
			break;
		case 'OPEN_PORT_DIALOG':
			return {
				...state,
				isPortDialogOpen: true
			}
			break;
		case 'CLOSE_PORT_DIALOG':
			return {
				...state,
				isPortDialogOpen: false
			}
			break;
		case 'OPEN_SAVE_DIALOG':
			return {
				...state,
				isSaveDialogOpen: true
			}
			break;
		case 'CLOSE_SAVE_DIALOG':
			return {
				...state,
				isSaveDialogOpen: false
			}
			break;
		case 'CONNECTED':
			return {
				...state,
				connected: true
			}
			break;
		case 'DISCONNECTED':
			return {
				...state,
				connected: false
			}
			break;
		case 'RUNNING':
			return {
				...state,
				running: true
			}
			break;
		case 'STOPPED':
			return {
				...state,
				running: false
			}
			break;
		default:
		return state
	}
}

const store = createStore(reducer)

export default store
