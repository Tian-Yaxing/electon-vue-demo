export interface MenuItem {
  id: string
  name: string
  icon: string
}

export const menuItems: MenuItem[] = [
  { id: 'notepad', name: '记事本', icon: '📝' },
  { id: 'calculator', name: '计算器', icon: '🧮' },
  { id: 'timer', name: '计时器', icon: '⏱️' },
  { id: 'todo', name: '待办事项', icon: '✅' },
]