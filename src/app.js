const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let window = null

// Create a new window
function createWindow() {
  window = new BrowserWindow({
    // Set the initial size.
    width: 800,
    height: 550,
    minWidth: 800,
    minHeight: 550,
    // Set the title bar style
    titleBarStyle: 'hiddenInset',
    // Set the background color to white
    backgroundColor: "#FFFFFF",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false,
    // Custom window border.
    frame: false
  })
}

// Wait until the app is ready.
app.once('ready', () => {
  createWindow()

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // debug
  window.webContents.openDevTools()

  window.once('ready-to-show', () => {
    // Show window
    window.show()
  })
})

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })
}