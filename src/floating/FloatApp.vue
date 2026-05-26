<script setup lang="ts">
import { ref, onMounted } from 'vue'

const screenshot = ref<string | null>(null)
const isCapturing = ref(false)
const showPermissionTip = ref(false)

// 截屏按钮
const handleCaptureFull = async () => {
  isCapturing.value = true
  try {
    const result = await window.electronAPI?.screenshotCaptureFull()
    if (result?.dataUrl) {
      screenshot.value = result.dataUrl
      showPermissionTip.value = false
    }
  } catch (e: any) {
    console.error('截屏失败:', e)
    showPermissionTip.value = true
  } finally {
    isCapturing.value = false
  }
}

// 清除截图
const handleClearScreenshot = () => {
  screenshot.value = null
}

// 关闭窗口（隐藏）
const handleClose = () => {
  window.electronAPI?.floatHide()
}

// 复制截图到剪贴板
const handleCopyScreenshot = async () => {
  if (!screenshot.value) return

  try {
    // 通过 Electron 主进程复制图片
    await window.electronAPI?.copyImageToClipboard(screenshot.value)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

// 保存截图到文件
const handleSaveScreenshot = async () => {
  if (!screenshot.value) return

  try {
    await window.electronAPI?.saveImageToFile(screenshot.value)
  } catch (e) {
    console.error('保存失败:', e)
  }
}

onMounted(() => {
  // 检查剪贴板是否有图片
  checkClipboardImage()
})

const checkClipboardImage = async () => {
  try {
    const result = await window.electronAPI?.getClipboardImage()
    if (result?.dataUrl) {
      screenshot.value = result.dataUrl
    }
  } catch (e) {
    // 忽略错误
  }
}
</script>

<template>
  <div class="float-wrapper">
    <!-- 标题栏 - 可拖拽区域 -->
    <div class="header-bar">
      <span class="title">截图工具</span>
      <div class="header-actions">
        <button class="close-btn" @click="handleClose">×</button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 权限提示 -->
      <div v-if="showPermissionTip" class="permission-tip">
        <p>⚠️ 需要屏幕录制权限</p>
        <p class="tip-detail">请前往 系统设置 → 隐私与安全性 → 屏幕录制，授权后重试</p>
      </div>

      <!-- 截图预览 -->
      <div v-if="screenshot" class="screenshot-preview">
        <img :src="screenshot" alt="Screenshot" class="screenshot-img" />
        <div class="screenshot-actions">
          <button class="action-btn" @click="handleCopyScreenshot">📋 复制</button>
          <button class="action-btn" @click="handleSaveScreenshot">💾 保存</button>
          <button class="action-btn danger" @click="handleClearScreenshot">🗑️ 清除</button>
        </div>
      </div>

      <!-- 截屏按钮 -->
      <div v-if="!screenshot" class="capture-buttons">
        <button
          class="capture-btn primary"
          :disabled="isCapturing"
          @click="handleCaptureFull"
        >
          <span class="icon">📷</span>
          <span>{{ isCapturing ? '截屏中...' : '全屏截图' }}</span>
        </button>
      </div>

      <!-- 使用提示 -->
      <div v-if="!screenshot && !showPermissionTip" class="tips">
        <p>💡 快捷键唤醒: Cmd + Alt + A</p>
        <p>截图后会显示在这里，可复制或保存</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.float-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 40, 0.95);
  border-radius: 12px;
  overflow: hidden;
}

/* 标题栏 - Electron 拖拽区域 */
.header-bar {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: rgba(20, 20, 30, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  -webkit-app-region: drag;
  user-select: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  -webkit-app-region: no-drag;
}

/* 权限提示 */
.permission-tip {
  padding: 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.permission-tip p {
  margin: 0;
}

.tip-detail {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 截图预览 */
.screenshot-preview {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.screenshot-img {
  width: 100%;
  max-height: 280px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.3);
}

.screenshot-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(20, 20, 30, 0.8);
}

/* 截屏按钮 */
.capture-buttons {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.capture-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 12px;
  background: rgba(100, 108, 255, 0.3);
  border: 1px solid rgba(100, 108, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 16px;
}

.capture-btn:hover {
  background: rgba(100, 108, 255, 0.5);
}

.capture-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.capture-btn .icon {
  font-size: 24px;
}

/* 操作按钮 */
.action-btn {
  padding: 10px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* 使用提示 */
.tips {
  padding: 16px;
  border-radius: 12px;
  background: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.tips p {
  margin: 4px 0;
  font-size: 13px;
}
</style>