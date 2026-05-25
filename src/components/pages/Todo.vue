<script setup lang="ts">
import { ref, watch } from 'vue'

interface TodoItem {
  id: number
  text: string
  done: boolean
  createdAt: string
}

const todos = ref<TodoItem[]>([])
const input = ref('')
const filter = ref<'all' | 'active' | 'done'>('all')

// 从 localStorage 加载
const loadTodos = () => {
  const saved = localStorage.getItem('todo-list')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
}

// 保存到 localStorage
watch(todos, (val) => {
  localStorage.setItem('todo-list', JSON.stringify(val))
}, { deep: true })

loadTodos()

const addTodo = () => {
  if (input.value.trim()) {
    todos.value.unshift({
      id: Date.now(),
      text: input.value.trim(),
      done: false,
      createdAt: new Date().toLocaleDateString(),
    })
    input.value = ''
  }
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.done = !todo.done
  }
}

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter(t => t.id !== id)
}

const filteredTodos = ref<TodoItem[]>([])

watch([todos, filter], () => {
  switch (filter.value) {
    case 'active':
      filteredTodos.value = todos.value.filter(t => !t.done)
      break
    case 'done':
      filteredTodos.value = todos.value.filter(t => t.done)
      break
    default:
      filteredTodos.value = todos.value
  }
}, { immediate: true })

const stats = ref({ total: 0, active: 0, done: 0 })

watch(todos, () => {
  stats.value = {
    total: todos.value.length,
    active: todos.value.filter(t => !t.done).length,
    done: todos.value.filter(t => t.done).length,
  }
}, { immediate: true })
</script>

<template>
  <div class="todo-page">
    <h2>待办事项</h2>
    <div class="input-section">
      <input
        v-model="input"
        type="text"
        placeholder="添加新的待办事项..."
        class="todo-input"
        @keyup.enter="addTodo"
      />
      <button class="add-btn" @click="addTodo">添加</button>
    </div>

    <div class="stats">
      <span>总计: {{ stats.total }}</span>
      <span>未完成: {{ stats.active }}</span>
      <span>已完成: {{ stats.done }}</span>
    </div>

    <div class="filters">
      <button
        :class="['filter-btn', { active: filter === 'all' }]"
        @click="filter = 'all'"
      >全部</button>
      <button
        :class="['filter-btn', { active: filter === 'active' }]"
        @click="filter = 'active'"
      >未完成</button>
      <button
        :class="['filter-btn', { active: filter === 'done' }]"
        @click="filter = 'done'"
      >已完成</button>
    </div>

    <div class="todo-list">
      <div v-if="filteredTodos.length === 0" class="empty">暂无待办事项</div>
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ done: todo.done }"
      >
        <input
          type="checkbox"
          :checked="todo.done"
          @change="toggleTodo(todo.id)"
        />
        <span class="text">{{ todo.text }}</span>
        <span class="date">{{ todo.createdAt }}</span>
        <button class="delete-btn" @click="deleteTodo(todo.id)">删除</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-page {
  padding: 20px;
  max-width: 600px;
}

h2 {
  color: var(--color-text-1);
  margin-bottom: 20px;
}

.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.todo-input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--color-bg-3);
  border-radius: 8px;
  background: var(--color-bg-2);
  color: var(--color-text-1);
  font-size: 14px;
}

.todo-input:focus {
  outline: none;
  border-color: var(--theme);
}

.add-btn {
  padding: 12px 24px;
  background: var(--theme);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--color-text-2);
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-btn {
  padding: 8px 16px;
  background: var(--color-bg-2);
  color: var(--color-text-2);
  border: 1px solid var(--color-bg-3);
  border-radius: 6px;
  cursor: pointer;
}

.filter-btn.active {
  background: var(--theme);
  color: white;
  border-color: var(--theme);
}

.todo-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty {
  color: var(--color-text-3);
  font-size: 14px;
  padding: 20px;
  text-align: center;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  margin-bottom: 8px;
}

.todo-item.done .text {
  color: var(--color-text-3);
  text-decoration: line-through;
}

.todo-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.text {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-1);
}

.date {
  font-size: 12px;
  color: var(--color-text-3);
}

.delete-btn {
  font-size: 12px;
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}
</style>