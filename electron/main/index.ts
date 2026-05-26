import { app, BrowserWindow, dialog, ipcMain, Menu, shell, globalShortcut, clipboard, nativeImage } from "electron";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FloatWindowManager } from "./services/FloatWindowManager";
import { ScreenshotService } from "./services/ScreenshotService";
import { IPC_CHANNELS } from "../common/ipcChannels";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // Confirm before quitting
  win.on("close", (e) => {
    const response = dialog.showMessageBoxSync(win!, {
      type: "warning",
      title: "提示",
      message: "是否退出应用？",
      buttons: ["取消", "退出"],
      cancelId: 0,
      defaultId: 1,
    });

    // console.log("close", response);

    if (response !== 1) {
      e.preventDefault();
    }
  });
}

Menu.setApplicationMenu(null);

// 初始化服务
const floatManager = new FloatWindowManager();
const screenshotService = new ScreenshotService();

// 注册悬浮窗口 IPC 处理器
ipcMain.handle(IPC_CHANNELS.FLOATING.SHOW, () => floatManager.show());
ipcMain.handle(IPC_CHANNELS.FLOATING.HIDE, () => floatManager.hide());
ipcMain.handle(IPC_CHANNELS.FLOATING.TOGGLE, () => floatManager.toggle());

// 注册截屏 IPC 处理器
ipcMain.handle(IPC_CHANNELS.SCREENSHOT.CAPTURE_FULLSCREEN, () => screenshotService.captureFullScreen());
ipcMain.handle(IPC_CHANNELS.SCREENSHOT.CAPTURE_SELECTION, () => screenshotService.captureSelection());

// 注册剪贴板和文件 IPC 处理器
ipcMain.handle('clipboard:copy-image', (_event, dataUrl: string) => {
  const image = nativeImage.createFromDataURL(dataUrl);
  clipboard.writeImage(image);
  return true;
});

ipcMain.handle('clipboard:get-image', () => {
  const image = clipboard.readImage();
  if (image.isEmpty()) return null;
  return { dataUrl: image.toDataURL() };
});

ipcMain.handle('file:save-image', async (_event, dataUrl: string) => {
  const result = await dialog.showSaveDialog(win!, {
    title: '保存截图',
    defaultPath: `screenshot-${Date.now()}.png`,
    filters: [{ name: 'PNG Image', extensions: ['png'] }],
  });

  if (result.filePath) {
    const image = nativeImage.createFromDataURL(dataUrl);
    const buffer = image.toPNG();
    const fs = await import('node:fs/promises');
    await fs.writeFile(result.filePath, buffer);
    return result.filePath;
  }
  return null;
});

app.whenReady().then(() => {
  createWindow();

  // 注册全局快捷键 Cmd+Ctrl+A (macOS) / Ctrl+Alt+A (Windows/Linux)
  const shortcutKey = process.platform === 'darwin' ? 'CommandOrControl+Alt+A' : 'Ctrl+Alt+A';
  globalShortcut.register(shortcutKey, () => {
    floatManager.toggle();
  });
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

// 退出时注销全局快捷键
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
