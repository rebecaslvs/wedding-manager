<template>
  <div id="app" class="app">
    <nav class="navbar">
      <div class="container navbar-content">
        <router-link to="/" class="logo">
          <span class="logo-text">R + M</span>
        </router-link>
        <ul class="nav-links">
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/confirmar-presenca">Confirmar Presença</router-link></li>
          <li><router-link to="/presentes">Presentes</router-link></li>
          <li v-if="authStore.isAdminLoggedIn"><router-link to="/analytics">Análise</router-link></li>
          <li v-if="authStore.isAdminLoggedIn">
            <router-link to="/admin" class="admin-link">Painel Admin</router-link>
          </li>
          <li v-if="authStore.isAdminLoggedIn">
            <button @click="handleLogout" class="logout-btn">Sair</button>
          </li>
          <li v-if="!authStore.isAdminLoggedIn"><router-link to="/admin" class="admin-link">Painel Admin</router-link></li>
        </ul>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 Rebeca e Marcos.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logoutAdmin()
  router.push('/')
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  text-decoration: none;
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary);
}

.admin-link {
  background-color: var(--primary);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.admin-link:hover {
  background-color: var(--primary-dark);
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.logout-btn:hover {
  background-color: #c82333;
}

main {
  flex: 1;
}

.footer {
  background-color: var(--secondary);
  color: white;
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
