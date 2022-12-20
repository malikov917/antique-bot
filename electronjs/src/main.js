const { app, BrowserWindow, ipcMain } = require('electron');
const mongoose = require('mongoose');
const bot = require('../../bot/bot');
const path = require('path');
const { scrapItems } = require('../../scrappers/get-2hand-links');
const { mapBeforeSaving } = require('../../services/utils')
let antiqueRepository = require('../../api/antique-repository');
let mockAntiqueRepository = require('../../api/mock-antique-repository');
let mainWindow;
// antiqueRepository = mockAntiqueRepository;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

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

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nativeWindowOpen: true
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

function attachWebListeners() {
  ipcMain.on('parse-page', async (event, link) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    await parsePage(win, link);
  });
}

function connectToDB() {
  mongoose.connect(process.env.ANTIQUE_DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      mainWindow.webContents.send('on-info-event', { dbConnectedEvent: true });
    })
    .catch(errors => console.error(errors));
}

async function parsePage(win, link) {
  const items = await scrapItems(link);
  const oldIds = await antiqueRepository.getSavedIds();
  const newItems = items.filter(item => item.href && !oldIds.includes(item.href));
  for (const item of newItems) {
    await bot.sendMessage(`[link](${item.href})`);
  }
  const mappedItems = newItems.map(x => mapBeforeSaving(x))
  await antiqueRepository.saveBulk(mappedItems).catch(x => console.error(x));
  win.webContents.send('on-scrap-result', items);
}
