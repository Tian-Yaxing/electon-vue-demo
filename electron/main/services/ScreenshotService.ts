/**
 * 截屏服务
 * 使用 Electron desktopCapturer 实现截屏功能
 */

import { desktopCapturer, screen, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { IPC_CHANNELS } from '../../common/ipcChannels'
import type { ScreenshotResult, SelectionArea } from '../../common/types'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ScreenshotService {
  private selectionWindow: BrowserWindow | null = null

  async captureFullScreen(): Promise<ScreenshotResult> {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.bounds

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: width * primaryDisplay.scaleFactor,
        height: height * primaryDisplay.scaleFactor,
      },
    })

    const source = sources[0]
    if (!source) {
      throw new Error('No screen source found')
    }

    return {
      dataUrl: source.thumbnail.toDataURL(),
      width,
      height,
      displayId: primaryDisplay.id,
    }
  }

  async captureSelection(): Promise<void> {
    const { width, height } = screen.getPrimaryDisplay().bounds

    // 创建全屏透明选区窗口
    this.selectionWindow = new BrowserWindow({
      width,
      height,
      x: 0,
      y: 0,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.mjs'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    // 选区窗口加载特殊 HTML（开发环境用 hash 路由）
    if (process.env.VITE_DEV_SERVER_URL) {
      this.selectionWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}selection.html`)
    } else {
      this.selectionWindow.loadFile(path.join(__dirname, '../renderer/selection.html'))
    }

    // 监听选区完成事件
    ipcMain.once(IPC_CHANNELS.SCREENSHOT.SELECTION_COMPLETE, async (_, area: SelectionArea) => {
      const fullScreenshot = await this.captureFullScreen()
      // 这里可以添加裁剪逻辑，暂时直接返回全屏截图
      this.selectionWindow?.close()
      this.selectionWindow = null
      // 发送给悬浮窗口
      // 需要从 FloatWindowManager 获取悬浮窗口发送
    })

    // 监听取消事件
    ipcMain.once(IPC_CHANNELS.SCREENSHOT.CANCEL, () => {
      this.selectionWindow?.close()
      this.selectionWindow = null
    })
  }

  cancelSelection(): void {
    if (this.selectionWindow) {
      this.selectionWindow.close()
      this.selectionWindow = null
    }
  }
}