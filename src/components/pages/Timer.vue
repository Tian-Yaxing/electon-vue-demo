<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const time = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const hours = Math.floor(time.value / 3600)
  const minutes = Math.floor((time.value % 3600) / 60)
  const seconds = time.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const start = () => {
  if (!isRunning.value) {
    isRunning.value = true
    isPaused.value = false
    interval = setInterval(() => {
      time.value++
    }, 1000)
  }
}

const pause = () => {
  if (isRunning.value && !isPaused.value) {
    isPaused.value = true
    clearInterval(interval!)
    interval = null
  }
}

const resume = () => {
  if (isPaused.value) {
    isPaused.value = false
    interval = setInterval(() => {
      time.value++
    }, 1000)
  }
}

const reset = () => {
  clearInterval(interval!)
  interval = null
  time.value = 0
  isRunning.value = false
  isPaused.value = false
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="timer-page">
    <h2>计时器</h2>
    <div class="timer-container">
      <div class="time-display">{{ formattedTime }}</div>
      <div class="status">
        <span v-if="!isRunning">准备开始</span>
        <span v-else-if="isPaused">已暂停</span>
        <span v-else>运行中...</span>
      </div>
      <div class="controls">
        <button v-if="!isRunning" class="btn primary" @click="start">开始</button>
        <template v-else>
          <button v-if="!isPaused" class="btn warning" @click="pause">暂停</button>
          <button v-else class="btn primary" @click="resume">继续</button>
          <button class="btn danger" @click="reset">重置</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-page {
  padding: 20px;
}

h2 {
  color: var(--color-text-1);
  margin-bottom: 20px;
}

.timer-container {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  max-width: 400px;
}

.time-display {
  font-size: 48px;
  font-weight: bold;
  color: var(--theme);
  font-family: monospace;
  margin-bottom: 16px;
}

.status {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 24px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn.primary {
  background: var(--theme);
  color: white;
}

.btn.warning {
  background: #f39c12;
  color: white;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}
</style>