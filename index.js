const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 700,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js")
    }
  })
  // and load the index.html of the app.
  win.loadFile('ui/blank/index.html')
  // win.loadFile('ui/material/index.html')
}

app.whenReady().then(createWindow)
