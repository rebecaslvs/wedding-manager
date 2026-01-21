

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminLoggedIn: false
  }),
  actions: {
    loginAdmin(password: string): boolean {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || ''
      if (adminPassword && password === adminPassword) {
        this.isAdminLoggedIn = true
        localStorage.setItem('adminLoggedIn', 'true')
        return true
      }
      return false
    },
    logoutAdmin() {
      this.isAdminLoggedIn = false
      localStorage.removeItem('adminLoggedIn')
    },
    checkAdminLogin() {
      const savedLogin = localStorage.getItem('adminLoggedIn')
      if (savedLogin === 'true') {
        this.isAdminLoggedIn = true
      }
    }
  }
})
