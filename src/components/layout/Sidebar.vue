<script setup lang="ts">
import { useMenu } from '../../composables/useMenu'

const { menuItems, currentMenu, setCurrentMenu } = useMenu()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="logo">🛠️</span>
      <span class="title">工具箱</span>
    </div>
    <nav class="menu-list">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        :class="{ active: currentMenu.id === item.id }"
        @click="setCurrentMenu(item)"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="name">{{ item.name }}</span>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100%;
  background: var(--color-bg-2);
  border-right: 1px solid var(--color-bg-3);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--color-bg-3);
}

.logo {
  font-size: 24px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.menu-list {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-text-2);
}

.menu-item:hover {
  background: var(--color-bg-3);
}

.menu-item.active {
  background: var(--theme);
  color: white;
}

.icon {
  font-size: 18px;
}

.name {
  font-size: 14px;
}
</style>