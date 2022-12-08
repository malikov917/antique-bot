const { app, BrowserWindow, ipcMain } = require('electron');
const mongoose = require('mongoose');
const bot = require('../../bot/bot');
const path = require('path');
const { scrapItems } = require('../../scrappers/get-2hand-links');
const { mapBeforeSaving } = require('../../services/utils')
let antiqueRepository = require('../../api/antique-repository');
let mockAntiqueRepository = require('../../api/mock-antique-repository');
// antiqueRepository = mockAntiqueRepository;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nativeWindowOpen: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  attachWebListeners();
  connectToDB();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function attachWebListeners() {
  ipcMain.on('parse-page', (event, link) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    parsePage(win, link);
  });
}

function connectToDB() {
  mongoose.connect(process.env.ANTIQUE_DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(errors => console.error(errors));
}

async function parsePage(win, link) {
  const items = await scrapItems(link);
  const oldIds = await antiqueRepository.getSavedIds();
  const newItems = items.filter(item => !oldIds.includes(item.href));
  for (const item of newItems) {
    await bot.sendMessage(`[link](${item.href})`);
  }
  const mappedItems = newItems.filter(x => x.href).map(x => mapBeforeSaving(x))
  await antiqueRepository.saveBulk(mappedItems).catch(x => console.error(x));
  win.webContents.send('on-scrap-result', items);
}
