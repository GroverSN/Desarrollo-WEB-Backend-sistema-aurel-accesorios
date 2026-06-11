<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <router-link to="/" class="logo">
        <img src="/logo_aurel.png" alt="Aurel Accesorios" class="logo-img" />
        <span class="logo-text">Aurel Accesorios</span>
      </router-link>

      <button class="menu-toggle" @click="menuOpen = !menuOpen">
        <Menu v-if="!menuOpen" :size="24" />
        <X v-else :size="24" />
      </button>

      <nav :class="['nav-links', { open: menuOpen }]">
        <router-link to="/" @click="menuOpen = false">Inicio</router-link>
        <router-link to="/catalogo" @click="menuOpen = false">Catálogo</router-link>
        <router-link to="/carrito" @click="menuOpen = false" class="cart-link">
          Carrito
          <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
        </router-link>
        <router-link to="/nosotros" @click="menuOpen = false">Nosotros</router-link>
        <router-link to="/contacto" @click="menuOpen = false">Contacto</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useCarritoStore } from '../stores/carrito'

const menuOpen = ref(false)
const carrito = useCarritoStore()
const totalItems = computed(() => carrito.totalItems)
</script>

<style scoped>
.navbar {
  background: var(--primary-olive);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  height: 40px;
  width: auto;
  border-radius: 50%;
}

.logo-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  color: rgba(255,255,255,0.85);
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  background: rgba(255,255,255,0.15);
  color: white;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-badge {
  background: #25d366;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  padding: 4px;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--primary-olive);
    flex-direction: column;
    padding: 12px 20px 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .nav-links.open {
    display: flex;
  }

  .logo-text {
    font-size: 1rem;
  }
}
</style>
