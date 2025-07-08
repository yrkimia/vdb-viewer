const { contextBridge, ipcRenderer } = require('electron');

// APIs exposed to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    SendIPCMsgToMain:   (message)  => ipcRenderer.send('send-message-to-main', message),                    
    onIPCMsgToRenderer: (callback) => ipcRenderer.on('reply-message', (event, reply) => callback(reply)), 
    onIPCLogToRenderer: (callback) => ipcRenderer.on('main-log',      (event, message) => callback(message))
});
