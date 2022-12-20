/*
 * @Date: 2022-12-08 17:58:08
 * @LastEditors: chexx
 * @LastEditTime: 2022-12-20 09:50:10
 * @FilePath: \voicesys\electron-main\index.ts
 */
import { app, BrowserWindow, screen, dialog } from 'electron';
import is_dev from 'electron-is-dev';
import path from 'path';
import { autoUpdater } from 'electron-updater';
let mainWindow: BrowserWindow | null = null;
class createWin {
  constructor() {
    const displayWorkAreaSize = screen.getAllDisplays()[0].workArea;
    mainWindow = new BrowserWindow({
      width: parseInt(`${displayWorkAreaSize.width * 0.85}`, 10),
      height: parseInt(`${displayWorkAreaSize.height * 0.85}`, 10),
      movable: true,
      // frame: false,
      show: false,
      center: true,
      resizable: true,
      // transparent: true,
      titleBarStyle: 'default',
      webPreferences: {
        devTools: true,
        contextIsolation: false,
        nodeIntegration: true,
        // enableRemoteModule: true,
      },
      backgroundColor: '#fff',
    });
    const URL = is_dev
      ? `https://localhost:${process.env.PORT}` // vite 启动的服务器地址
      : `file://${path.join(__dirname, '../index.html')}`; // vite 构建后的静态文件地址

    mainWindow.loadURL(URL);

    mainWindow.on('ready-to-show', () => {
      mainWindow && mainWindow.show();
    });
  }
}

app.whenReady().then(() => new createWin());

const isFirstInstance = app.requestSingleInstanceLock();


if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.focus();
    }
  });
}


Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  }
})

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin();
  }
});

function checkUpdate(){
  if(process.platform == 'darwin'){  
      // 安装包放在了服务端`darwin`目录下
      autoUpdater.setFeedURL('http://1.117.107.94/mac')  //设置要检测更新的路径
  }else{
      // 同理
      autoUpdater.setFeedURL("http://1.117.107.94/win/")
  }
  //检测更新
  autoUpdater.checkForUpdates()
  autoUpdater.autoDownload = false
  //监听'error'事件
  autoUpdater.on('error', (err) => {
      console.log(err)
  })

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
      type: 'info',
      title: '更新提示',
      message: '发现有新版本'+ info.version +'，是否更新？',
      buttons: ['更新', '不了'],
      cancelId: 1,
    }).then(index => {
      if (index.response == 0) {
        autoUpdater.downloadUpdate();
      }
      else {
        return
      }
    })
  })
  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      title: '提示',
      message: '暂无更新'
    })
  })
  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow?.setProgressBar(progressObj.percent.toFixed(2) / 100);
    mainWindow?.setTitle('已下载：' + progressObj.percent.toFixed(2) + '%')
  });
  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '安装更新',
      buttons: ['安装', '稍后安装'],
      message: '安装包已经下载完毕，是否现在安装？',
      cancelId: 1,
    }).then(index => {
      if (index.response == 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })
}

app.on('ready', () => {
  //每次启动程序，就检查更新
  checkUpdate()
})
