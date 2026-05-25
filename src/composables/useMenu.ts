import { ref } from 'vue'
import type { MenuItem } from '../types/menu'
import { menuItems } from '../types/menu'

const currentMenu = ref<MenuItem>(menuItems[0])

export function useMenu() {
  const setCurrentMenu = (menu: MenuItem) => {
    currentMenu.value = menu
  }

  return {
    menuItems,
    currentMenu,
    setCurrentMenu,
  }
}