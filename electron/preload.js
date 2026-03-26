const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateChecking: (callback) => ipcRenderer.on('update_checking', callback),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
  onUpdateDownloadProgress: (callback) => ipcRenderer.on('update_download_progress', (_event, payload) => callback(payload)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  onUpdateError: (callback) => ipcRenderer.on('update_error', (_event, payload) => callback(payload)),
  restartApp: () => ipcRenderer.send('restart_app'),
  checkForUpdates: () => ipcRenderer.send('check_for_updates'),
  getAppVersion: () => ipcRenderer.invoke('app_version'),
  minimizeWindow: () => ipcRenderer.send('window_minimize'),
  toggleMaximizeWindow: () => ipcRenderer.send('window_toggle_maximize'),
  closeWindow: () => ipcRenderer.send('window_close'),
  onMaximizeState: (callback) => ipcRenderer.on('window_maximize_state', (_event, payload) => callback(payload)),
});
