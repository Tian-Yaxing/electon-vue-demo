/**
 * 悬浮窗口管理服务
 */

import { BrowserWindow, app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLOAT_WINDOW_CONFIG = {
  width: 420,
  height: 600,
  minWidth: 320,
  minHeight: 400,
  maxWidth: 600,
  maxHeight: 800,
};

export class FloatWindowManager {
  private floatWindow: BrowserWindow | null = null;

  create(): BrowserWindow {
    if (this.floatWindow) {
      return this.floatWindow;
    }

    this.floatWindow = new BrowserWindow({
      width: FLOAT_WINDOW_CONFIG.width,
      height: FLOAT_WINDOW_CONFIG.height,
      minWidth: FLOAT_WINDOW_CONFIG.minWidth,
      minHeight: FLOAT_WINDOW_CONFIG.minHeight,
      maxWidth: FLOAT_WINDOW_CONFIG.maxWidth,
      maxHeight: FLOAT_WINDOW_CONFIG.maxHeight,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.mjs'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      // macOS 毛玻璃效果
      ...(process.platform === 'darwin' && {
        vibrancy: 'under-window',
        visualEffectState: 'active',
      }),
      // Windows 亚克力效果
      ...(process.platform === 'win32' && {
        backgroundMaterial: 'acrylic',
      }),
    });

    // 加载悬浮窗口入口
    if (process.env.VITE_DEV_SERVER_URL) {
      this.floatWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}floating.html`);
      this.floatWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      this.floatWindow.loadFile(path.join(__dirname, '../renderer/floating.html'));
    }

    // 阻止关闭，改为隐藏
    this.floatWindow.on('close', (e) => {
      if (this.floatWindow && !app.isQuitting) {
        e.preventDefault();
        this.floatWindow.hide();
      }
    });

    this.floatWindow.on('closed', () => {
      this.floatWindow = null;
    });

    return this.floatWindow;
  }

  show(): void {
    if (!this.floatWindow) {
      this.create();
    }
    this.floatWindow?.show();
    this.floatWindow?.focus();
  }

  hide(): void {
    this.floatWindow?.hide();
  }

  toggle(): void {
    if (this.floatWindow?.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  getWindow(): BrowserWindow | null {
    return this.floatWindow;
  }

  send(channel: string, data?: any): void {
    this.floatWindow?.webContents.send(channel, data);
  }
}