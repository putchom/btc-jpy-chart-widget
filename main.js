const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')
const url = require('url')

let win
let tray = null

function createWindow () {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    transparent: true,
    frame: false
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    app.quit()
  })
}

function createTray () {
  tray = new Tray(__dirname + "/icon@3x.png")
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Show', click: function () { win.focus(); }},
    {label: 'Quit', click: function () { win.close(); }}
  ])
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
