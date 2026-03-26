const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateChecking: (callback) => ipcRenderer.on('update_checking', callback),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
  onUpdateDownloadProgress: (callback) => ipcRenderer.on('update_download_progress', (_event, payload) => callback(payload)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  onUpdateError: (callback) => ipcRenderer.on('update_error', (_event, payload) => callback(payload)),
  restartApp: () => ipcRenderer.send('restart_app')
});
