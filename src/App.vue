<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import Notepad from './components/pages/Notepad.vue'
import Calculator from './components/pages/Calculator.vue'
import Timer from './components/pages/Timer.vue'
import Todo from './components/pages/Todo.vue'
import { useMenu } from './composables/useMenu'

const { currentMenu } = useMenu()
</script>

<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <Notepad v-if="currentMenu.id === 'notepad'" />
      <Calculator v-if="currentMenu.id === 'calculator'" />
      <Timer v-if="currentMenu.id === 'timer'" />
      <Todo v-if="currentMenu.id === 'todo'" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background: var(--color-bg-1);
}
</style>