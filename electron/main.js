const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    // set up IPC handler 
    ipcMain.handle('ping', () => 'pong')

    // display index in window
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'frontend', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.whenReady().then(() => {
    createWindow()

    // mac behavior: app runs in background, open window if app activates
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// windows/linux behavior: quit app when windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})