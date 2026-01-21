<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Acesso ao Painel Admin</h1>
      <p class="subtitle">Digite a senha para acessar o painel administrativo</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Digite a senha"
            @keyup.enter="handleLogin"
            autofocus
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary">
          Entrar
        </button>
      </form>

      <router-link to="/" class="back-link">
        ← Voltar ao Início
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
import { onMounted, watchEffect } from 'vue'

const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  if (!password.value) {
    errorMessage.value = 'Por favor, digite a senha'
    return
  }
  if (authStore.loginAdmin(password.value)) {
    password.value = ''
    router.push('/admin')
  } else {
    errorMessage.value = 'Senha incorreta'
    password.value = ''
  }
}

onMounted(() => {
  authStore.checkAdminLogin()
})

watchEffect(() => {
  if (authStore.isAdminLoggedIn.value) {
    router.push('/admin')
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  padding: 2rem;
}

.login-box {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  width: 100%;
}

h1 {
  text-align: center;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
}

input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

input[type="password"]:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.back-link {
  display: block;
  text-align: center;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: var(--primary-dark);
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
