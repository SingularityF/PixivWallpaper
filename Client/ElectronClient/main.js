const electron = require('electron');
const wallpaper = require('wallpaper');
const axios = require('axios');
const macaddress = require('macaddress');
const url = require('url');
const path = require('path');
let fs = require('fs');
const qs = require('qs');
const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, screen } = electron;


let version = "1.3.5";
let apiUrl = "https://singf.space/pixiv/select_paper.php";
let downloadUrl = "https://github.com/SingularityF/PixivWallpaper/releases/latest";

let iconPath = path.join(__dirname, 'icon.ico');
let mainWindow = null;
let tray = null;
let timeout = 90000;

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [

        ]
    }
];

async function setWallpaper(filePath) {
    await wallpaper.set(filePath);
    console.log('Wallpaper set!');
    mainWindow.webContents.send('set');
    mainWindow.webContents.send('set:done');
}

async function checkUpdate() {
    mainWindow.webContents.send('updates');
    let versionLatest = await axios.get(downloadUrl, {
        timeout: timeout
    })
        .then(res => {
            responseUrl = res.request.path;
            let versionLatest = responseUrl.split("/").pop();
            return versionLatest;
        })
        .catch(err => {
            console.log(err);
            mainWindow.webContents.send('error:network');
            mainWindow.webContents.send('check:done');
            return null;
        });
    if (versionLatest == null) return;
    if (versionLatest == version) {
        console.log("Latest");
        mainWindow.webContents.send('latest');
        mainWindow.webContents.send('check:done');
    } else {
        mainWindow.webContents.send('hide');
        const options = {
            type: 'info',
            title: 'Attention',
            message: `You're running an outdated version of PixivWallpaper. Please consider updating to the latest version.`,
            buttons: ['OK']
        };
        dialog.showMessageBox(mainWindow, options, (index) => {
        });
        mainWindow.webContents.send('check:done');
    }
}

app.on('ready', () => {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click() {
                mainWindow.show();
            }
        },
        {
            label: 'Quit',
            click() {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({
        icon: iconPath,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file'
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Menu.setApplicationMenu(mainMenu);

    mainWindow.on('minimize', (e) => {
        e.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('close', async (e) => {
        if (!app.isQuiting) {
            e.preventDefault();
            const options = {
                type: 'info',
                title: 'Attention',
                message: `This app will continue to run in background to set wallpaper automatically.
You can shut down the app through tray menu.`,
                buttons: ['OK']
            };
            await dialog.showMessageBox(mainWindow, options, (index) => {
            });
            mainWindow.hide();
        }
        return false;
    });

    tray.on('click', (e) => {
        mainWindow.show();
    });
});

ipcMain.on('ready', () => {
    checkUpdate();
});

ipcMain.on('set', (e) => {
    macaddress.one((err, mac) => {
        if (err) {
            console.log('Cannot get MAC address');
            mainWindow.webContents.send('error:network');
            mainWindow.webContents.send('set:done');
        } else {
            const { width, height } = screen.getPrimaryDisplay().size;
            aspect_ratio = width / height;
            let data = qs.stringify({
                ar: aspect_ratio,
                uuid: mac,
                version: '0.0'
            });
            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data,
                url: apiUrl,
                responseType: 'stream'
            };
            axios.post(apiUrl, data, {
                responseType: 'arraybuffer',
                timeout: timeout
            }).then((res) => {
                //console.log(res);
                let ext = res['headers']['content-type'].split('/')[1];
                fs.writeFile(`wallpaper.${ext}`, res.data, 'binary', (err) => {
                    if (err) {
                        console.log('Filed to save wallpaper to local disk');
                    } else {
                        console.log('Download complete');
                        setWallpaper(path.join(__dirname, `wallpaper.${ext}`));
                    }
                });
            }).catch((err) => {
                console.log(err);
                mainWindow.webContents.send('error:network');
                mainWindow.webContents.send('set:done');
            });
        }
    });
});