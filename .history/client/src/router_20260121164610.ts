import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('./pages/Admin.vue')
  },
  {
    path: '/confirmar-presenca',
    name: 'ConfirmarPresenca',
    component: () => import('./pages/ConfirmarPresenca.vue')
  },
  {
    path: '/presentes',
    name: 'Presentes',
    component: () => import('./pages/Presentes.vue')
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: () => import('./pages/Carrinho.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('./pages/Analytics.vue')
  },
  {
    path: '/painel',
    name: 'LoginAdmin',
    component: () => import('./pages/LoginAdmin.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rotas será feita nos componentes

export default router
