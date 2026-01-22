<template>
  <div id="app" class="app">
    <nav class="navbar">
      <div class="container navbar-content">
        <router-link to="/" class="logo">
          <span class="logo-text">R + M</span>
        </router-link>
        <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Abrir menu">
          <span :class="['hamburger-bar', menuOpen ? 'open' : '']"></span>
          <span :class="['hamburger-bar', menuOpen ? 'open' : '']"></span>
          <span :class="['hamburger-bar', menuOpen ? 'open' : '']"></span>
        </button>
        <ul class="nav-links" :class="{ open: menuOpen }">
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/confirmar-presenca">Confirmar Presença</router-link></li>
          <li><router-link to="/presentes">Presentes</router-link></li>
          <li style="position:relative;">
            <router-link to="/carrinho" class="cart-link" aria-label="Carrinho">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M7 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 16l.94-2h7.8a2 2 0 0 0 1.92-1.45l2.54-8.13A1 1 0 0 0 19.4 3H5.21l-.94-2H0v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 4 15a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.24-.18z" fill="currentColor"/>
              </svg>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </router-link>
          </li>
          <li v-if="authStore.isAdminLoggedIn"><router-link to="/analytics">Análise</router-link></li>
          <li v-if="authStore.isAdminLoggedIn">
            <router-link to="/painel" class="admin-link">Painel Admin</router-link>
          </li>
          <li v-if="authStore.isAdminLoggedIn">
            <button @click="handleLogout" class="logout-btn">Sair</button>
          </li>
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
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { useWeddingStore } from './stores/weddingStore'

const router = useRouter()
const authStore = useAuthStore()
const store = useWeddingStore()
const menuOpen = ref(false)

const cartCount = computed(() => store.cartItemsCount)

const handleLogout = () => {
  authStore.logoutAdmin()
  router.push('/')
  menuOpen.value = false
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
  position: relative;
}
.cart-link:hover {
  background: #f5f5f5;
}
.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc3545;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  min-width: 20px;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  pointer-events: none;
  z-index: 2;
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
  transition: max-height 0.3s ease;
}
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 1rem;
  z-index: 101;
}
.hamburger-bar {
  width: 28px;
  height: 4px;
  background: var(--primary);
  margin: 4px 0;
  border-radius: 2px;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 1rem 1.2rem;
  }
  .navbar-content {
    flex-direction: row !important;
    justify-content: space-between;
    align-items: center;
    gap: 0;
    position: relative;
  }
  .logo {
    order: 1;
    margin-right: 0;
    align-self: center;
  }
  .hamburger {
    display: flex;
    order: 2;
    margin-left: 0;
    align-self: center;
  }
  .nav-links {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    z-index: 99;
  }
  .nav-links.open {
    max-height: 500px;
    opacity: 1;
    pointer-events: auto;
  }
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
