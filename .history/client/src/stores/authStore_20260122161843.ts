

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminLoggedIn: false
  }),
  actions: {
    loginAdmin(password: string): boolean {
      // A validação de admin deve ser feita via back-end/API
      // Removido uso de VITE_ADMIN_PASSWORD do front-end por segurança
      // Implemente uma chamada para API que valide a senha do admin
      // Exemplo:
      // const isValid = await apiValidateAdmin(password)
      // if (isValid) {
      //   this.isAdminLoggedIn = true
      //   localStorage.setItem('adminLoggedIn', 'true')
      //   return true
      // }
      // return false
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
