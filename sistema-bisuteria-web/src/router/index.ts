import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Catalogo from '../views/Catalogo.vue'
import ProductoDetalle from '../views/ProductoDetalle.vue'
import Nosotros from '../views/Nosotros.vue'
import Contacto from '../views/Contacto.vue'
import Carrito from '../views/Carrito.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: Catalogo,
  },
  {
    path: '/producto/:id',
    name: 'producto-detalle',
    component: ProductoDetalle,
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: Carrito,
  },
  {
    path: '/nosotros',
    name: 'nosotros',
    component: Nosotros,
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: Contacto,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
