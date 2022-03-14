class Emitter extends EventTarget {
  on(eventName, callback) {
  	this.addEventListener(eventName, callback)
  }
  emit(eventName, args) {
  	const e = new CustomEvent(eventName, { detail: args })
  	this.dispatchEvent(e)
  }
}

export default Emitter
