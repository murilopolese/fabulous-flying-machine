function store (state, emitter) {

  // FILES: DISK
  emitter.on('OPEN_SAVE_DIALOG', () => {
		console.log('open save')
	})
	emitter.on('OPEN_OPEN_DIALOG', () => {
		console.log('open open')
	})
}

export default store
