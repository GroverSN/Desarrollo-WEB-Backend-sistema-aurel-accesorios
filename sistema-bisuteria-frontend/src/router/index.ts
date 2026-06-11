import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Productos from '../views/Productos.vue'
import Ventas from '../views/Ventas.vue'
import Reportes from '../views/Reportes.vue'
import Consultas from '../views/Consultas.vue'
import { useAuthStore } from '../store/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    name: 'productos',
    component: Productos,
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: Ventas,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: Reportes,
    meta: { requiresAuth: true }
  },
  {
    path: '/consultas',
    name: 'consultas',
    component: Consultas,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (to.meta.requiresAuth && !auth.isAuth) {
    return next('/')
  }
  
  if (to.path === '/' && auth.isAuth) {
    return next('/dashboard')
  }
  
  return next()
})

export default router