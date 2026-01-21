

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAdminLoggedIn = ref(false)
  // Senha do admin lida da variável de ambiente
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || ''
  // DEBUG: logar valor da env no store
  // @ts-ignore
  console.log('VITE_ADMIN_PASSWORD (store):', adminPassword)

  const loginAdmin = (password: string): boolean => {
    if (adminPassword && password === adminPassword) {
      isAdminLoggedIn.value = true
      localStorage.setItem('adminLoggedIn', 'true')
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    isAdminLoggedIn.value = false
    localStorage.removeItem('adminLoggedIn')
  }

  const checkAdminLogin = () => {
    const savedLogin = localStorage.getItem('adminLoggedIn')
    if (savedLogin === 'true') {
      isAdminLoggedIn.value = true
    }
  }

  return {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    checkAdminLogin
  }
})
