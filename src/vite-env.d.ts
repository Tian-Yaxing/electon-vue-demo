/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
  // Float window API
  electronAPI: {
    floatShow: () => Promise<void>
    floatHide: () => Promise<void>
    floatToggle: () => Promise<void>
    screenshotCaptureFull: () => Promise<{ dataUrl: string; width: number; height: number }>
    screenshotCaptureSelection: () => Promise<void>
    onScreenshotComplete: (callback: (result: any) => void) => void
    copyImageToClipboard: (dataUrl: string) => Promise<boolean>
    saveImageToFile: (dataUrl: string) => Promise<string | null>
    getClipboardImage: () => Promise<{ dataUrl: string } | null>
  }
}
