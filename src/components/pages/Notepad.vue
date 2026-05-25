<script setup lang="ts">
import { ref, watch } from 'vue'

const notes = ref<string[]>([])
const currentNote = ref('')
const selectedIndex = ref(-1)

// 从 localStorage 加载
const loadNotes = () => {
  const saved = localStorage.getItem('notepad-notes')
  if (saved) {
    notes.value = JSON.parse(saved)
  }
}

// 保存到 localStorage
watch(notes, (val) => {
  localStorage.setItem('notepad-notes', JSON.stringify(val))
}, { deep: true })

loadNotes()

const addNote = () => {
  if (currentNote.value.trim()) {
    notes.value.unshift({
      content: currentNote.value,
      date: new Date().toLocaleString(),
    } as any)
    currentNote.value = ''
  }
}

const selectNote = (index: number) => {
  selectedIndex.value = index
  currentNote.value = notes.value[index].content
}

const deleteNote = (index: number) => {
  notes.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = -1
    currentNote.value = ''
  }
}

const clearAll = () => {
  notes.value = []
  currentNote.value = ''
  selectedIndex.value = -1
}
</script>

<template>
  <div class="notepad-page">
    <h2>记事本</h2>
    <div class="editor">
      <textarea
        v-model="currentNote"
        placeholder="在这里输入内容..."
        class="input-area"
      />
      <div class="actions">
        <button class="btn primary" @click="addNote">保存笔记</button>
        <button class="btn danger" @click="clearAll">清空所有</button>
      </div>
    </div>
    <div class="notes-list">
      <h3>笔记列表 ({{ notes.length }})</h3>
      <div v-if="notes.length === 0" class="empty">暂无笔记</div>
      <div
        v-for="(note, index) in notes"
        :key="index"
        class="note-item"
        :class="{ selected: selectedIndex === index }"
        @click="selectNote(index)"
      >
        <div class="note-content">{{ note.content }}</div>
        <div class="note-meta">
          <span class="date">{{ note.date }}</span>
          <button class="delete-btn" @click.stop="deleteNote(index)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notepad-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: hidden;
}

h2 {
  color: var(--color-text-1);
  margin-bottom: 0;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-area {
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid var(--color-bg-3);
  border-radius: 8px;
  background: var(--color-bg-2);
  color: var(--color-text-1);
  font-size: 14px;
  resize: vertical;
}

.input-area:focus {
  outline: none;
  border-color: var(--theme);
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn.primary {
  background: var(--theme);
  color: white;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.notes-list h3 {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 12px;
}

.empty {
  color: var(--color-text-3);
  font-size: 14px;
}

.note-item {
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid transparent;
}

.note-item:hover {
  border-color: var(--color-bg-3);
}

.note-item.selected {
  border-color: var(--theme);
}

.note-content {
  color: var(--color-text-1);
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 60px;
  overflow: hidden;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
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