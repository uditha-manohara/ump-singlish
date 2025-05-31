const { app, BrowserWindow, Tray, Menu, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

// Only use electron-reload in development
if (!app.isPackaged) {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
  } catch (err) {
    console.warn('electron-reload failed to load:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 730,
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'ump.ico'),
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Auto updater — only run in packaged (production) app
  if (app.isPackaged) {
    const { autoUpdater } = require('electron-updater');

    mainWindow.once('ready-to-show', () => {
      autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on('update-available', () => {
      console.log('✅ Update available.');
    });

    autoUpdater.on('update-downloaded', () => {
      console.log('⬇️ Update downloaded. Will install on quit.');
    });

    autoUpdater.on('error', (error) => {
      console.error('❌ Auto-updater error:', error);
    });
  }

  mainWindow.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:isMaximized', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:isMaximized', false);
  });
}

// ✅ IPC handlers
ipcMain.on('window:minimize', () => mainWindow.minimize());

ipcMain.on('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
  mainWindow.webContents.send('window:isMaximized', mainWindow.isMaximized());
});

ipcMain.on('window:close', () => mainWindow.close());

app.whenReady().then(() => {
  createWindow();

  // Tray setup
  tray = new Tray(path.join(__dirname, 'ump_logo1.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open App',
      click: () => {
        mainWindow.show();
      }
    },
    { type: 'separator' },
    {
      label: 'Developed by UMP',
      click: () => {
        shell.openExternal('https://github.com/umplk/');
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('UMP Singlish');
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});
