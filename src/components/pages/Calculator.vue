<script setup lang="ts">
import { ref, computed } from 'vue'

const input = ref('')
const result = ref('')
const history = ref<string[]>([])

const buttons = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

const handleClick = (btn: string) => {
  switch (btn) {
    case 'C':
      input.value = ''
      result.value = ''
      break
    case '±':
      if (input.value) {
        if (input.value.startsWith('-')) {
          input.value = input.value.slice(1)
        } else {
          input.value = '-' + input.value
        }
      }
      break
    case '%':
      if (input.value) {
        const num = parseFloat(input.value)
        if (!isNaN(num)) {
          input.value = (num / 100).toString()
        }
      }
      break
    case '=':
      calculate()
      break
    default:
      input.value += btn
  }
}

const calculate = () => {
  try {
    let expr = input.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
    // eslint-disable-next-line no-eval
    const res = eval(expr)
    result.value = res.toString()
    history.value.unshift(`${input.value} = ${res}`)
    if (history.value.length > 10) {
      history.value.pop()
    }
    input.value = res.toString()
  } catch {
    result.value = '错误'
  }
}

const displayValue = computed(() => {
  if (result.value) return result.value
  return input.value || '0'
})
</script>

<template>
  <div class="calculator-page">
    <h2>计算器</h2>
    <div class="calculator">
      <div class="display">{{ displayValue }}</div>
      <div class="buttons">
        <div v-for="(row, ri) in buttons" :key="ri" class="row">
          <button
            v-for="btn in row"
            :key="btn"
            :class="['btn', { operator: ['÷', '×', '-', '+', '=', '%'].includes(btn), zero: btn === '0' }]"
            @click="handleClick(btn)"
          >
            {{ btn }}
          </button>
        </div>
      </div>
    </div>
    <div class="history">
      <h3>历史记录</h3>
      <div v-for="(item, i) in history" :key="i" class="history-item">
        {{ item }}
      </div>
      <div v-if="history.length === 0" class="empty">暂无记录</div>
    </div>
  </div>
</template>

<style scoped>
.calculator-page {
  padding: 20px;
  max-width: 500px;
}

h2 {
  margin-bottom: 20px;
  color: var(--color-text-1);
}

.calculator {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.display {
  background: var(--color-bg-3);
  padding: 16px;
  border-radius: 8px;
  font-size: 32px;
  text-align: right;
  color: var(--color-text-1);
  margin-bottom: 16px;
  min-height: 60px;
  overflow: hidden;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  background: var(--color-bg-3);
  color: var(--color-text-1);
  transition: background 0.2s;
}

.btn:hover {
  background: var(--color-bg-4);
}

.btn.operator {
  background: var(--theme);
  color: white;
}

.btn.operator:hover {
  opacity: 0.9;
}

.btn.zero {
  flex: 2;
}

.history {
  margin-top: 24px;
}

.history h3 {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 12px;
}

.history-item {
  padding: 8px 12px;
  background: var(--color-bg-2);
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--color-text-2);
}

.empty {
  color: var(--color-text-3);
  font-size: 14px;
}
</style>