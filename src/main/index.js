import {
    app,
    BrowserWindow,
    ipcMain,
    screen,
    Menu
} from "electron";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    global.__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\");
}

export let mainWindow;
const winURL =
    process.env.NODE_ENV === "development" ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`;

// 在主进程中.
//const {ipcMain} = require('electron')
ipcMain.on("asynchronous-message", (event, arg) => {
    event.sender.send("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
    if (arg == "create_window") {
        createWindow();
    }
    //event.returnValue = "pong";
});

/*******************实现代码************************** */
//通信模块，mian process与renderer process（web page）
//监听web page里发出的message
let downloadpath; //下载路径
let savepath; //保存路径
ipcMain.on("download", (event, args) => {
    var arr = args.split("+");
    downloadpath = arr[0];
    savepath = arr[1];
    //下面这句会触发will-download事件
    mainWindow.webContents.downloadURL(downloadpath);
});
/*******************实现代码************************** */

// 实现窗口的定时显示
ipcMain.on("showWindow", (event, args) => {
    if(args == 1) {
        mainWindow.show();
    }
});

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 1040,
        width: 1315,
        center: true,
        minWidth: 1315,
        minHeight: 1040,
        resizable: true,
        closable: true,
        //fullscreen: true,
        fullscreenable: true,
        //skipTaskbar: true,
        hasShadow: true,
        opacity: 1,
        darkTheme: true,
        // titleBarStyle: "hiddenInset",

        textAreasAreResizable: false,
        plugins: false,
        defaultEncoding: "utf-8",
        show: true,
        alwaysOnTop: false,
        acceptFirstMouse: true,
        title: "timebook",
        icon: "../../build/icons/icon.ico",
        webPreferences: {
            webSecurity: false,
            devTools: true
        } //加上这个就可以获取到了本地的图片
    });

    Menu.setApplicationMenu(null);

    //mainWindow.width = screen.getPrimaryDisplay().size.width;
    //mainWindow.height = screen.getPrimaryDisplay().size.height;

    mainWindow.loadURL(winURL);
    mainWindow.webContents.openDevTools();
    //mainWindow.maximize();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */