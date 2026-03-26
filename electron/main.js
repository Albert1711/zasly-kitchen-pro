import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function loadDevUrl() {
  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5178';
  mainWindow.loadURL(devUrl);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Zasly Kitchen Pro",
    icon: path.join(__dirname, '../public/logo zasly inco.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    autoHideMenuBar: true, 
  });

  // Forzar apertura de DevTools en producción para depurar pantalla negra
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Zasly Kitchen Pro - Error</title>
          <style>
            body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b1220;color:#e5e7eb}
            .card{max-width:720px;padding:28px;border-radius:16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12)}
            h1{margin:0 0 8px;font-size:22px}
            p{margin:6px 0;line-height:1.5;color:rgba(229,231,235,0.85)}
            code{background:rgba(0,0,0,0.35);padding:2px 6px;border-radius:8px}
            button{margin-top:14px;padding:10px 14px;border-radius:12px;border:0;background:#8b3dff;color:white;font-weight:700;cursor:pointer}
          </style>
        </head>
        <body>
          <div class="card">
            <h1>No se pudo cargar la app</h1>
            <p>Electron abrió la ventana, pero el servidor de Vite no respondió.</p>
            <p><b>URL:</b> <code>${validatedURL}</code></p>
            <p><b>Error:</b> <code>${errorCode}</code> - <code>${errorDescription}</code></p>
            <p>Solución rápida: cierra procesos viejos y ejecuta <code>npm run electron:dev:clean</code>.</p>
            <button onclick="location.reload()">Reintentar</button>
          </div>
        </body>
      </html>
    `;
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  });

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    loadDevUrl();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    // Check for updates on production
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_checking');
});

autoUpdater.on('update-available', () => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_available');
  try {
    autoUpdater.downloadUpdate();
  } catch (_e) {
    // ignore
  }
});

autoUpdater.on('update-not-available', () => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_not_available');
});

autoUpdater.on('download-progress', (progress) => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_download_progress', {
    percent: progress?.percent,
    transferred: progress?.transferred,
    total: progress?.total,
    bytesPerSecond: progress?.bytesPerSecond,
  });
});

autoUpdater.on('update-downloaded', () => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('error', (err) => {
  if (!mainWindow) return;
  mainWindow.webContents.send('update_error', {
    message: err?.message || String(err),
  });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
