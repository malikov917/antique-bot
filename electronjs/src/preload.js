// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    parsePage: (value) => ipcRenderer.send('parse-page', value),
    onScrapResult: (callback) => ipcRenderer.on('on-scrap-result', callback),
    onInfoEvent: (callback) => ipcRenderer.on('on-info-event', callback),
})
