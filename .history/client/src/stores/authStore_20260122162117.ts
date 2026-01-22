

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminLoggedIn: false
  }),
  actions: {
    async loginAdmin(password: string): Promise<boolean> {
      try {
        const response = await fetch('/.netlify/functions/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        })
        const result = await response.json()
        if (result.success) {
          this.isAdminLoggedIn = true
          localStorage.setItem('adminLoggedIn', 'true')
          return true
        }
        return false
      } catch (e) {
        return false
      }
    },
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
