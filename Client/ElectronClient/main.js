const electron = require('electron');
const wallpaper = require('wallpaper');
const axios = require('axios');
const macaddress = require('macaddress');
const url = require('url');
const path = require('path');
let fs = require('fs');
const qs = require('qs');
const { app, BrowserWindow, Menu, Tray, dialog, ipcMain } = electron;

let iconPath = path.join(__dirname, 'icon.ico');
let mainWindow = null;
let tray = null;
let apiUrl = "https://singf.space/pixiv/select_paper.php";

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [

        ]
    }
]

async function setWallpaper(filePath) {
    await wallpaper.set(filePath);
    console.log('Wallpaper set!');
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

ipcMain.on('set', (e) => {
    macaddress.one((err, mac) => {
        if (err) {
            console.log('Cannot get MAC address');
        } else {
            let data = qs.stringify({
                ar: 16 / 9,
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
                responseType: 'arraybuffer'
            }).then((res) => {
                //console.log(res);
                fs.writeFile('wallpaper.png', res.data, 'binary', (err) => {
                    if (err) {
                        console.log('Filed to save wallpaper to local disk');
                    } else {
                        console.log('Download complete');
                        setWallpaper(path.join(__dirname, 'wallpaper.png'));
                    }
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    });
});