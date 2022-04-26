const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

let win = null // main window

async function openFolderDialog() {
  // https://stackoverflow.com/questions/46027287/electron-open-folder-dialog
  let dir = await dialog.showOpenDialog(win, { properties: [ 'openDirectory' ] })
  return dir.filePaths[0] || null
}

ipcMain.handle('list-folder', async (event) => {
  console.log('ipcMain', 'list-folder')
  const folder = await openFolderDialog()
  let files = fs.readdirSync(path.resolve(folder))
  // Filter out directories
  files = files.filter(f => {
    let filePath = path.resolve(folder, f)
    return !fs.lstatSync(filePath).isDirectory()
  })
  return { folder, files }
})

ipcMain.handle('load-file', (event, folder, filename) => {
  console.log('ipcMain', 'load-file', folder, filename )
  let filePath = path.resolve(folder, filename)
  let content = fs.readFileSync(filePath)
  return content
})

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    x: 10,
    y: 10,
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
  win.webContents.toggleDevTools()
  // win.loadFile('ui/material/index.html')
}

app.whenReady().then(createWindow)
