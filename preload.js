const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  onIsMaximized: (callback) => {
    ipcRenderer.on('window:isMaximized', (event, isMaximized) => {
      callback(isMaximized);
    });
  },
  onToggleSinhala: (callback) => {
    ipcRenderer.on('toggle-sinhala', (event, state) => {
      callback(state);
    });
  }
});
