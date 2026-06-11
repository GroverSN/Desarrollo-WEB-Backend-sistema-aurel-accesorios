<template>
  <div class="container page">
    <h1 class="page-title">Carrito de Compras</h1>

    <div v-if="store.items.length === 0" class="empty-cart">
      <div class="empty-icon">
        <ShoppingBag :size="64" />
      </div>
      <h2>Tu carrito está vacío</h2>
      <p>Explorá nuestro catálogo y agregá los productos que te gusten.</p>
      <router-link to="/catalogo" class="btn btn-primary">
        Ver Catálogo
      </router-link>
    </div>

    <template v-else>
      <div class="cart-layout">
        <div class="cart-items">
          <div
            v-for="item in store.items"
            :key="item.producto.id"
            class="cart-item"
          >
            <div class="cart-item-img">
              <img
                :src="item.producto.imagen?.url ? apiUrl + item.producto.imagen.url : '/placeholder.svg'"
                :alt="item.producto.nombre"
              />
            </div>

            <div class="cart-item-info">
              <router-link :to="`/producto/${item.producto.id}`" class="cart-item-name">
                {{ item.producto.nombre }}
              </router-link>
              <span class="cart-item-code">{{ item.producto.codigo }}</span>
              <p class="cart-item-price">Bs {{ formatPrice(item.producto.precio) }}</p>
            </div>

            <div class="cart-item-qty">
              <button
                class="qty-btn"
                @click="store.decrementar(item.producto.id)"
                :disabled="item.cantidad <= 1"
              >
                -
              </button>
              <span class="qty-value">{{ item.cantidad }}</span>
              <button
                class="qty-btn"
                @click="store.incrementar(item.producto.id)"
                :disabled="item.cantidad >= item.producto.stock"
              >
                +
              </button>
            </div>

            <div class="cart-item-subtotal">
              <p class="subtotal-label">Subtotal</p>
              <p class="subtotal-value">Bs {{ formatPrice(item.producto.precio * item.cantidad) }}</p>
            </div>

            <button
              class="cart-item-remove"
              @click="store.quitar(item.producto.id)"
              title="Eliminar"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Resumen del pedido</h3>

          <div class="summary-row">
            <span>Productos ({{ store.totalItems }} uds.)</span>
            <span>Bs {{ formatPrice(store.totalPrecio) }}</span>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span class="total-value">Bs {{ formatPrice(store.totalPrecio) }}</span>
          </div>

          <div class="summary-form">
            <div class="form-group">
              <label for="cart-nombre">Tu nombre *</label>
              <input
                id="cart-nombre"
                v-model="nombre"
                type="text"
                placeholder="Ej: María López"
                :disabled="enviando"
              />
            </div>
            <div class="form-group">
              <label for="cart-telefono">Tu teléfono *</label>
              <input
                id="cart-telefono"
                v-model="telefono"
                type="tel"
                placeholder="Ej: 59169577432"
                :disabled="enviando"
              />
            </div>
          </div>

          <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>

          <button
            class="btn btn-whatsapp btn-block"
            :disabled="enviando"
            @click="enviarPedido"
          >
            <MessageCircle :size="20" v-if="!enviando" />
            {{ enviando ? 'Enviando...' : 'Enviar pedido por WhatsApp' }}
          </button>

          <button
            class="btn btn-outline btn-block btn-vaciar"
            @click="confirmarVaciar"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'
import { createConsulta } from '../services/consultas'
import { useToast } from '../composables/useToast'
import { ShoppingBag, MessageCircle, Trash2 } from 'lucide-vue-next'

const store = useCarritoStore()
const router = useRouter()
const { showToast } = useToast()

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || ''

const nombre = ref('')
const telefono = ref('')
const enviando = ref(false)
const errorMsg = ref('')

const formatPrice = (price: number | string) => {
  return Number(price).toFixed(2)
}

function generarMensajeWhatsApp(): string {
  let msg = 'Hola! Quiero hacer el siguiente pedido:\n\n'
  msg += '*Pedido - Aurel Accesorios*\n\n'

  store.items.forEach((item, idx) => {
    const subtotal = item.producto.precio * item.cantidad
    msg += `${idx + 1}. ${item.producto.nombre} (${item.producto.codigo})`
    msg += ` x${item.cantidad} = Bs ${subtotal.toFixed(2)}\n`
  })

  msg += '\n─────────────────\n'
  msg += `*Total: Bs ${store.totalPrecio.toFixed(2)}*\n\n`

  if (nombre.value.trim()) {
    msg += `*Nombre:* ${nombre.value.trim()}\n`
  }
  if (telefono.value.trim()) {
    msg += `*Teléfono:* ${telefono.value.trim()}\n`
  }

  msg += '\nQuedo atento a su confirmación. ¡Gracias!'
  return msg
}

async function enviarPedido() {
  if (!nombre.value.trim() || !telefono.value.trim()) {
    errorMsg.value = 'Por favor completá tu nombre y teléfono.'
    return
  }
  if (store.items.length === 0) return

  errorMsg.value = ''
  enviando.value = true

  const mensaje = generarMensajeWhatsApp()

  try {
    await createConsulta({
      nombre: nombre.value.trim(),
      telefono: telefono.value.trim(),
      productos: store.items.map(i =>
        `${i.producto.nombre} (${i.producto.codigo}) x${i.cantidad}`
      ).join('\n'),
    })
  } catch {
    // El pedido igual se envía por WhatsApp aunque falle el guardado
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`
  window.open(whatsappUrl, '_blank')

  enviando.value = false
  store.vaciar()
  showToast('Pedido enviado correctamente', 'success')
  router.push('/')
}

function confirmarVaciar() {
  store.vaciar()
  showToast('Carrito vaciado', 'info')
}
</script>

<style scoped>
.page {
  padding: 48px 20px 80px;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: var(--soft-moss);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-cart h2 {
  color: var(--text-main);
  margin-bottom: 8px;
}

.empty-cart p {
  color: var(--soft-moss);
  margin-bottom: 24px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.cart-item-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.cart-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-weight: 600;
  color: var(--text-main);
  display: block;
  margin-bottom: 2px;
}

.cart-item-name:hover {
  color: var(--primary-olive);
}

.cart-item-code {
  font-size: 0.8rem;
  color: var(--soft-moss);
}

.cart-item-price {
  font-weight: 700;
  color: var(--primary-olive);
  margin-top: 4px;
}

.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 2px solid var(--soft-moss);
  border-radius: 6px;
  background: transparent;
  color: var(--primary-olive);
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-olive);
  border-color: var(--primary-olive);
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-main);
}

.cart-item-subtotal {
  text-align: right;
  flex-shrink: 0;
}

.subtotal-label {
  font-size: 0.8rem;
  color: var(--soft-moss);
}

.subtotal-value {
  font-weight: 700;
  color: var(--primary-olive);
}

.cart-item-remove {
  background: none;
  border: none;
  color: #ccc;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cart-item-remove:hover {
  color: var(--danger);
  background: rgba(195, 71, 71, 0.1);
}

.cart-summary {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  position: sticky;
  top: 88px;
}

.cart-summary h3 {
  color: var(--text-main);
  margin-bottom: 20px;
  font-size: 1.15rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 2px solid #eee;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-main);
}

.total-value {
  color: var(--primary-olive);
}

.summary-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-group input {
  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.3s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.form-error {
  color: var(--danger);
  font-weight: 500;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.btn-vaciar {
  margin-top: 8px;
  font-size: 0.9rem;
  padding: 10px;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 600px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .cart-item-info {
    flex: 1 1 100%;
    order: -1;
  }

  .cart-item-qty {
    order: 1;
  }

  .cart-item-subtotal {
    order: 2;
    margin-left: auto;
  }

  .cart-item-remove {
    order: 3;
  }
}
</style>
