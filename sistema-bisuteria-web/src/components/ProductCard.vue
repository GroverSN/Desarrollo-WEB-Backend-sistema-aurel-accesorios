<template>
  <div class="product-card">
    <router-link :to="`/producto/${producto.id}`" class="product-card-link">
      <div class="product-img">
        <img
          :src="producto.imagen?.url ? apiUrl + producto.imagen.url : '/placeholder.svg'"
          :alt="producto.nombre"
          loading="lazy"
        />
        <span class="product-code">{{ producto.codigo }}</span>
        <span v-if="producto.stock <= 0" class="product-agotado">Agotado</span>
      </div>
      <div class="product-info">
        <h3>{{ producto.nombre }}</h3>
        <p v-if="producto.categoria" class="product-category">{{ producto.categoria.nombre }}</p>
        <p class="product-price">Bs {{ formatPrice(producto.precio) }}</p>
      </div>
    </router-link>
    <div class="product-actions">
      <button
        v-if="producto.stock > 0"
        class="btn-add-cart"
        @click.stop="agregarAlCarrito"
      >
        <ShoppingCart :size="16" />
        Agregar
      </button>
      <button v-else class="btn-add-cart btn-disabled" disabled>
        Agotado
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Producto } from '../services/productos'
import { useCarritoStore } from '../stores/carrito'
import { useToast } from '../composables/useToast'
import { ShoppingCart } from 'lucide-vue-next'

const props = defineProps<{
  producto: Producto
}>()

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const carrito = useCarritoStore()
const { showToast } = useToast()

const formatPrice = (price: number | string) => {
  return Number(price).toFixed(2)
}

function agregarAlCarrito() {
  carrito.agregar(props.producto)
  showToast(`${props.producto.nombre} agregado al carrito`, 'success')
}
</script>

<style scoped>
.product-card {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.product-card-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

.product-img {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-code {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--primary-olive);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.product-agotado {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--danger);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.product-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.product-info h3 {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 600;
}

.product-category {
  font-size: 0.8rem;
  color: var(--soft-moss);
}

.product-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary-olive);
  margin-top: auto;
  padding-top: 8px;
}

.product-actions {
  padding: 0 14px 14px;
}

.btn-add-cart {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: 2px solid var(--primary-olive);
  border-radius: 8px;
  background: transparent;
  color: var(--primary-olive);
  font-size: 0.9rem;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-add-cart:hover {
  background: var(--primary-olive);
  color: white;
}

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #999;
}

.btn-disabled:hover {
  background: transparent;
  color: #999;
}
</style>
