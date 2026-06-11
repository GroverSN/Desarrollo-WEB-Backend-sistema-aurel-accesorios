<template>
  <div class="container page">
    <div v-if="loading" class="loading">Cargando producto...</div>
    <div v-else-if="!producto" class="empty">Producto no encontrado.</div>

    <template v-else>
      <router-link to="/catalogo" class="back-link">
        ← Volver al catálogo
      </router-link>

      <div class="detail">
        <div class="detail-img">
          <img
            :src="producto.imagen?.url ? apiUrl + producto.imagen.url : '/placeholder.svg'"
            :alt="producto.nombre"
          />
        </div>

        <div class="detail-info">
          <div class="detail-header">
            <h1>{{ producto.nombre }}</h1>
            <span class="badge-code">{{ producto.codigo }}</span>
          </div>

          <p v-if="producto.categoria" class="detail-category">
            {{ producto.categoria.nombre }}
          </p>

          <p class="detail-price">Bs {{ formatPrice(producto.precio) }}</p>

          <p v-if="producto.descripcion" class="detail-desc">
            {{ producto.descripcion }}
          </p>

          <div v-if="producto.stock > 0" class="detail-actions">
            <div class="qty-selector">
              <button class="qty-btn" @click="decrementarCantidad" :disabled="cantidad <= 1">-</button>
              <span class="qty-value">{{ cantidad }}</span>
              <button class="qty-btn" @click="incrementarCantidad" :disabled="cantidad >= producto.stock">+</button>
            </div>
            <button class="btn btn-primary add-btn" @click="agregarAlCarrito">
              <ShoppingCart :size="20" />
              Agregar al carrito
            </button>
          </div>
          <div v-else class="agotado-msg">
            <p>Producto agotado</p>
          </div>

          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline consultar-btn"
          >
            <MessageCircle :size="18" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProducto, type Producto } from '../services/productos'
import { useCarritoStore } from '../stores/carrito'
import { useToast } from '../composables/useToast'
import { MessageCircle, ShoppingCart } from 'lucide-vue-next'

const route = useRoute()
const producto = ref<Producto | null>(null)
const loading = ref(true)
const cantidad = ref(1)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const carrito = useCarritoStore()
const { showToast } = useToast()

const formatPrice = (price: number | string) => {
  return Number(price).toFixed(2)
}

const whatsappLink = computed(() => {
  if (!producto.value) return '#'
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '5491112345678'
  const text = `Hola, me interesa el producto: ${producto.value.nombre} (Código: ${producto.value.codigo})`
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
})

function incrementarCantidad() {
  if (producto.value && cantidad.value < producto.value.stock) {
    cantidad.value++
  }
}

function decrementarCantidad() {
  if (cantidad.value > 1) {
    cantidad.value--
  }
}

function agregarAlCarrito() {
  if (!producto.value) return
  carrito.agregar(producto.value, cantidad.value)
  showToast(`${producto.value.nombre} agregado al carrito`, 'success')
  cantidad.value = 1
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    loading.value = false
    return
  }
  try {
    const res = await getProducto(id)
    producto.value = res.data
  } catch {
    producto.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page {
  padding: 32px 20px 64px;
}

.back-link {
  display: inline-block;
  color: var(--soft-moss);
  font-weight: 500;
  margin-bottom: 24px;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--primary-olive);
}

.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.detail-img {
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
  aspect-ratio: 1;
}

.detail-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.detail-header h1 {
  font-size: 1.8rem;
  color: var(--text-main);
}

.badge-code {
  background: var(--primary-olive);
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.detail-category {
  color: var(--soft-moss);
  font-weight: 500;
}

.detail-price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-olive);
}

.detail-desc {
  color: #555;
  line-height: 1.7;
  font-size: 1rem;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.qty-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid var(--soft-moss);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--primary-olive);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(68, 90, 20, 0.1);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-main);
}

.add-btn {
  flex: 1;
  justify-content: center;
}

.agotado-msg {
  margin-top: 12px;
}

.agotado-msg p {
  color: var(--danger);
  font-weight: 700;
  font-size: 1.1rem;
}

.consultar-btn {
  align-self: flex-start;
  margin-top: 8px;
  font-size: 0.9rem;
  padding: 10px 20px;
}

.loading, .empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--soft-moss);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .detail-header h1 {
    font-size: 1.35rem;
  }

  .detail-price {
    font-size: 1.5rem;
  }

  .detail-actions {
    flex-direction: column;
  }

  .qty-selector {
    width: 100%;
    justify-content: center;
  }

  .add-btn {
    width: 100%;
  }

  .consultar-btn {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
