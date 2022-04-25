function App(state, emit) {
  return html`
    <div id="app" class="column fill">
      ${Toolbar(state, emit)}
      ${Editor(state, emit)}
      ${Panel(state, emit)}
      ${state.isPortDialogOpen ? Dialog(state, emit) : null}
    </div>
  `
}

window.addEventListener('load', () => {
  let app = Choo()
  app.use(store);
  app.route('*', App)
  app.mount('#app')
})
