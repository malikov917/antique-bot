// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    parsePage: (value) => ipcRenderer.send('parse-page', value),
    doAction: (value) => ipcRenderer.send('do-action', value),
    handleResponse: (callback) => ipcRenderer.on('handle-response', callback),
    onScrapResult: (callback) => ipcRenderer.on('on-scrap-result', callback)
})
