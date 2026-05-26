/**
 * IPC 通道常量定义
 * 主进程和渲染进程共享
 */

export const IPC_CHANNELS = {
  // 悬浮窗口管理
  FLOATING: {
    SHOW: 'floating:show',
    HIDE: 'floating:hide',
    TOGGLE: 'floating:toggle',
    CLOSE: 'floating:close',
  },

  // 截屏
  SCREENSHOT: {
    CAPTURE_FULLSCREEN: 'screenshot:capture-full',
    CAPTURE_SELECTION: 'screenshot:capture-selection',
    SELECTION_COMPLETE: 'screenshot:selection-complete',
    CANCEL: 'screenshot:cancel',
  },

  // Ollama AI
  OLLAMA: {
    CHAT: 'ollama:chat',
    VISION: 'ollama:vision',
    STREAM: 'ollama:stream',
    CHECK_STATUS: 'ollama:check-status',
    LIST_MODELS: 'ollama:list-models',
  },

  // 全局事件
  GLOBAL: {
    SHORTCUT_TRIGGERED: 'global:shortcut-triggered',
    ERROR: 'global:error',
  },
} as const;