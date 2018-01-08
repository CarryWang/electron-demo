const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// ipcMain
const { ipcMain } = electron;

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1366, height: 768, transparent: true, frame: false });

  // and load the index.html of the app. // 加载本地html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 加载远程URL
  // mainWindow.loadURL('http://10.0.5.161:18080/sdp_manage')


  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // 当页面加载完成时，会触发`did-finish-load`事件。
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('test-to-process', '发送消息');
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  // ipMain接收来自渲染进程的消息
  ipcMain.on('sync-msg', (e, arg) => {
    // 接收同步消息，如果不处理，进程停留在这里
    console.log(e, arg, 'tongbu')
    e.returnValue = 'this is main return value!!!';
  })

  ipcMain.on('async-msg', (e, arg) => {
    console.log(e, arg, 'yibu');
    e.sender.send('async-to-render', 'return async msg')
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
