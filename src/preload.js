const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('titleBarAPI', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
});

contextBridge.exposeInMainWorld('analytics', {
  trackEvent: (eventName, props) => ipcRenderer.invoke("analytics:trackEvent", eventName, props)
});

contextBridge.exposeInMainWorld('offlineApi', {
  getLibrary: () => ipcRenderer.invoke('offline:getLibrary'),
  openFolder: () => ipcRenderer.invoke('offline:openFolder'),
  deleteEpisode: (animeId, episodeId) => ipcRenderer.invoke('offline:deleteEpisode', animeId, episodeId),
  downloadEpisode: (animeMeta, episodeMeta, url) => ipcRenderer.invoke('offline:downloadEpisode', animeMeta, episodeMeta, url),
  cancelDownload: (animeId, episodeId) => ipcRenderer.invoke('offline:cancelDownload', animeId, episodeId),
  getActiveDownloads: () => ipcRenderer.invoke('offline:getActiveDownloads'),
  onProgress: (callback) => ipcRenderer.on('offline:progress', (_event, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('offline:error', (_event, data) => callback(data)),
});

contextBridge.exposeInMainWorld('winApi', {
  openLink: (link) => ipcRenderer.invoke('winApi:openLink', link),
});

contextBridge.exposeInMainWorld('Sibnet', {
  Parse: (link) => ipcRenderer.invoke('sibnet:parse', link),
});

contextBridge.exposeInMainWorld('elecWindow', {
  getSize: () => ipcRenderer.invoke('window:getSize'),
  exitFullscreen: () => ipcRenderer.invoke('window:leaveFullScreen'),
  enterFullscreen: () => ipcRenderer.invoke('window:enterFullScreen'),
});

contextBridge.exposeInMainWorld('netElec', {
  fetch: (url, requestInfo) => ipcRenderer.invoke('netElec:fetch', url, requestInfo),
});

contextBridge.exposeInMainWorld('prc', {
  getVersions: () => ipcRenderer.invoke('prc:getVersions'),
});

contextBridge.exposeInMainWorld('discordRPC', {
  setActivity: (activity) => ipcRenderer.invoke('discordRPC:setActivity', activity),
});

contextBridge.exposeInMainWorld('settings', {
  getAll: () => ipcRenderer.invoke('settings:getAll'),
  get: (key) => ipcRenderer.invoke('settings:get', key),
  set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
});

contextBridge.exposeInMainWorld('notificationsApi', {
  get: () => ipcRenderer.invoke('notifications:get'),
  save: (data) => ipcRenderer.invoke('notifications:save', data),
});