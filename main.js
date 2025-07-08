import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true, // Node.js integration
            contextIsolation: true,
            devTools: true,        // Developer tools
        },
    });

    // Check if in development or production
    if (process.env.NODE_ENV === 'development') {   // Set by scripts in Package.json
        console.log('Running in development mode');                     // -> Debug Console in VS Code, or Command prompt
        mainWindow.loadURL('http://127.0.0.1:3000');                    // Connect to Vite server
    } else {
        console.log('Running in production mode');                      // -> Debug Console in VS Code, or Command prompt
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));// Load index.html
    }

    //mainWindow.setMenu(null);             // Remove the default menu//
    mainWindow.webContents.openDevTools();  // open DevTools in the renderer process

    // Event Listeners for main window: ready-to-show, close, resize, focus, blur, minimize, maximize
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.commandLine.appendSwitch('remote-debugging-port', '9222'); // Enable renderer debugging
//YR Until using internet-connected server ^^
app.commandLine.appendSwitch('ignore-certificate-errors');   // Ignore SSL errors (ed certificates)

// Attach the event listener to app.whenReady
app.whenReady().then(handleAppReady);

// Event Listeners for app: ready, window-all-closed, and activate
app.on('window-all-closed', handleWindowAllClosed);
app.on('activate', handleAppActivate);

// Register the IPC message listener
ipcMain.on('send-message-to-main', handleIPCMsgToMain);

// Function to handle the app's readiness
function handleAppReady() {
    if (process.env.NODE_ENV === 'development') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
    }
    createWindow();
}

// Function to handle 'window-all-closed' event
function handleWindowAllClosed() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}

// Function to handle 'activate' event
function handleAppActivate() {
    if (mainWindow === null) {
        createWindow();
    }
}

// function to handle the IPC message
function handleIPCMsgToMain(event, message) {
    console.log('Main process received:', message);                         // -> Debug Console in VS Code, or Command prompt
    mainWindow.webContents.send('main-log', 'Main process received:' + message);

    event.reply('reply-message', `Main Process Ack: ${message}`);  // -> onIPCMsgToRenderer in Controller.js
}
