<template>
  <MainLayout>

    <h1 class="page-title">Registro de Ventas</h1>

    <div class="ventas-container">
      <!-- Selector de Productos -->
      <div class="product-selector">
        <h3>Seleccionar Productos</h3>
        
        <div class="search-box">
          <Search class="search-icon" />
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar por código nombre" 
          />
        </div>

        <div class="filter-row">
          <select v-model="filtroCategoria" class="category-select">
            <option :value="undefined">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
          <button v-if="filtroCategoria !== undefined" class="clear-filter-btn" @click="filtroCategoria = undefined">
            <Eraser class="icon-small" />
            Limpiar
          </button>
        </div>

        <div class="product-list">
          <TransitionGroup name="list">
            <div 
              v-for="p in productosFiltrados" 
              :key="p.id" 
              class="product-item"
              :class="{ 'no-stock': p.stock === 0 }"
            >
              <div class="product-image">
                <img v-if="p.imagen?.url" :src="obtenerUrlImagen(p.imagen?.url)" :alt="p.nombre" />
                <div v-else class="no-img">📦</div>
              </div>
              <div class="product-info">
                <span class="nombre">{{ p.nombre }}</span>
                <span class="codigo">{{ p.codigo }}</span>
                <div class="price-stock">
                  <span class="precio">Bs {{ Number(p.precio).toFixed(2) }}</span>
                  <span class="stock" :class="getStockClass(p.stock)">Stock: {{ p.stock }}</span>
                </div>
              </div>
              <button 
                @click="agregarProducto(p)" 
                :disabled="p.stock === 0"
                class="add-btn"
                :title="p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'"
              >
                <Plus class="icon" />
              </button>
            </div>
          </TransitionGroup>
          
          <div v-if="productosFiltrados.length === 0" class="empty-list">
            <Search class="empty-list-icon" />
            <p>No hay productos que coincidan</p>
            <span class="empty-list-hint">Intenta con otro término de búsqueda o cambia el filtro</span>
          </div>
        </div>
      </div>

      <!-- Carrito de Ventas -->
      <div class="cart-section">
        <div class="section-header">
          <h3>
            <ShoppingCart class="header-icon" />
            Carrito de Venta
            <span v-if="carrito.length > 0" class="cart-badge">{{ totalItems }}</span>
          </h3>
        </div>
        
        <div class="cart-items">
          <TransitionGroup name="list">
            <div v-for="(item, index) in carrito" :key="item.id" class="cart-item">
              <div class="cart-item-accent"></div>
              <div class="item-image">
                <img v-if="item.imagenUrl" :src="obtenerUrlImagen(item.imagenUrl)" :alt="item.nombre" />
                <div v-else class="no-img">📦</div>
              </div>
              <div class="item-info">
                <span class="item-nombre">{{ item.nombre }}</span>
                <span class="item-precio">Bs {{ Number(item.precio).toFixed(2) }} c/u</span>
              </div>
              <div class="item-qty">
                <button @click="decrementarCantidad(index)" class="qty-btn">−</button>
                <span class="qty-value">{{ item.cantidad }}</span>
                <button @click="incrementarCantidad(index, item.stock)" class="qty-btn">+</button>
              </div>
              <div class="item-subtotal">
                Bs {{ (Number(item.precio) * item.cantidad).toFixed(2) }}
              </div>
              <button @click="quitarProducto(index)" class="remove-btn" title="Quitar producto">
                <Trash2 class="icon-small" />
              </button>
            </div>
          </TransitionGroup>

          <div v-if="carrito.length === 0" class="empty-cart">
            <div class="empty-cart-icon-wrap">
              <ShoppingCart class="empty-cart-icon" />
            </div>
            <p class="empty-cart-title">Carrito vacío</p>
            <p class="empty-cart-hint">Agrega productos desde la lista de la izquierda</p>
          </div>
        </div>

        <div class="cart-footer">
          <div class="total-row">
            <div class="total-line">
              <span>Total a pagar</span>
              <span class="total-amount">Bs {{ total.toFixed(2) }}</span>
            </div>
            <div class="total-line total-items-line">
              <span>Productos</span>
              <span>{{ totalItems }} unidades</span>
            </div>
          </div>

          <div class="cliente-section">
            <div class="form-group">
              <label for="clienteNombre">
                <User class="icon-small" />
                Cliente
              </label>
              <input
                id="clienteNombre"
                v-model="clienteNombre"
                type="text"
                placeholder="Nombre del cliente"
                class="cliente-input"
              />
            </div>
            <div class="form-group">
              <label for="clienteTelefono">
                <Phone class="icon-small" />
                Teléfono
              </label>
              <input
                id="clienteTelefono"
                v-model="clienteTelefono"
                type="tel"
                placeholder="Opcional"
                class="cliente-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="metodoPago">Método de Pago</label>
            <div class="payment-options">
              <button
                v-for="mp in metodosPago"
                :key="mp.value"
                :class="['payment-option', { active: metodoPago === mp.value }]"
                @click="metodoPago = mp.value"
              >
                <component :is="mp.icon" class="payment-icon" />
                <span>{{ mp.label }}</span>
              </button>
            </div>
          </div>

          <button 
            @click="registrarVenta" 
            class="register-btn"
            :disabled="carrito.length === 0 || saving"
          >
            <div :class="['btn-content', { loading: saving }]">
              <ShoppingCart v-if="!saving" class="icon" />
              <span v-if="!saving">Registrar Venta</span>
              <template v-else>
                <span class="spinner"></span>
                <span>Registrando...</span>
              </template>
            </div>
          </button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Swal from 'sweetalert2'
import { Plus, Search, Trash2, Eraser, Banknote, QrCode, Building2, CreditCard, User, Phone } from 'lucide-vue-next'
import { getProductos as getProductosAPI, type Producto } from '../services/productos'
import { createVenta } from '../services/ventas'
import { getCategorias, type Categoria } from '../services/categorias'

interface CarritoItem {
  id: number
  nombre: string
  codigo: string
  precio: number
  cantidad: number
  stock: number
  imagenUrl?: string
}

const metodosPago = [
  { value: 'efectivo', label: 'Efectivo', icon: Banknote },
  { value: 'qr', label: 'QR', icon: QrCode },
  { value: 'transferencia', label: 'Transferencia', icon: Building2 },
  { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
]

const router = useRouter()

const obtenerUrlImagen = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://localhost:3000')) return url
  if (url.startsWith('/uploads/')) {
    return `http://localhost:3000${url}`
  }
  return `http://localhost:3000/uploads/${url}`
}

const productos = ref<Producto[]>([])
const productosFiltrados = ref<Producto[]>([])
const busqueda = ref('')
const categorias = ref<Categoria[]>([])
const filtroCategoria = ref<number | undefined>(undefined)
const carrito = ref<CarritoItem[]>([])
const metodoPago = ref('efectivo')
const saving = ref(false)
const clienteNombre = ref('')
const clienteTelefono = ref('')

const total = computed(() => {
  return carrito.value.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0)
})

const totalItems = computed(() => {
  return carrito.value.reduce((sum, item) => sum + item.cantidad, 0)
})

const getStockClass = (stock: number) => {
  if (stock === 0) return 'stock-out'
  if (stock < 5) return 'stock-low'
  return 'stock-ok'
}

const cargarProductos = async () => {
  try {
    const res = await getProductosAPI()
    productos.value = res.data.filter((p: Producto) => p.status === true && p.stock > 0)
    productosFiltrados.value = [...productos.value]
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const cargarCategorias = async () => {
  try {
    const res = await getCategorias()
    categorias.value = res.data.filter((c: Categoria) => c.status)
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const filtrarProductos = () => {
  const query = busqueda.value.toLowerCase()
  productosFiltrados.value = productos.value.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(query) ||
      p.codigo.toLowerCase().includes(query)
    const matchCategoria = filtroCategoria.value === undefined ||
      p.categoriaId === filtroCategoria.value
    return matchBusqueda && matchCategoria
  })
}

const agregarProducto = (producto: Producto) => {
  const existente = carrito.value.find(item => item.id === producto.id)
  
  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad++
    } else {
      Swal.fire('Stock máximo', 'No hay más unidades disponibles', 'warning')
    }
  } else {
    carrito.value.push({
      id: producto.id,
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: Number(producto.precio),
      cantidad: 1,
      stock: producto.stock,
      imagenUrl: obtenerUrlImagen(producto.imagen?.url)
    })
  }
}

const quitarProducto = (index: number) => {
  carrito.value.splice(index, 1)
}

const incrementarCantidad = (index: number, maxStock: number) => {
  const item = carrito.value[index]
  if (item.cantidad < maxStock) {
    item.cantidad++
  }
}

const decrementarCantidad = (index: number) => {
  const item = carrito.value[index]
  if (item.cantidad > 1) {
    item.cantidad--
  } else {
    quitarProducto(index)
  }
}

const registrarVenta = async () => {
  if (carrito.value.length === 0) {
    Swal.fire('Error', 'Agrega productos al carrito', 'error')
    return
  }

  if (!clienteNombre.value.trim()) {
    Swal.fire('Cliente requerido', 'Ingresa el nombre del cliente', 'warning')
    return
  }

  const detalles = carrito.value.map(item => ({
    productoId: item.id,
    cantidad: item.cantidad
  }))

  saving.value = true

  try {
    await createVenta({
      metodoPago: metodoPago.value,
      clienteNombre: clienteNombre.value.trim(),
      clienteTelefono: clienteTelefono.value.trim() || undefined,
      detalles
    })

    Swal.fire({
      title: '¡Venta registrada!',
      text: `Total: Bs ${total.value.toFixed(2)} | ${metodoPago.value.toUpperCase()}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    carrito.value = []
    metodoPago.value = 'efectivo'
    clienteNombre.value = ''
    clienteTelefono.value = ''
    await cargarProductos()
    
    router.push('/dashboard')
  } catch (error) {
    console.error('Error registrando venta:', error)
    Swal.fire('Error', 'No se pudo registrar la venta', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  cargarProductos()
  cargarCategorias()
})

watch(busqueda, filtrarProductos)
watch(filtroCategoria, filtrarProductos)
</script>

<style scoped>
.ventas-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.product-selector, .cart-section {
  background: var(--surface);
  padding: 20px;
  border-radius: 12px;
}

h3 {
  color: var(--primary-olive);
  margin: 0 0 15px;
}

.search-box {
  position: relative;
  margin-bottom: 15px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-olive);
  width: 18px;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 2px solid rgba(68, 90, 20, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--white-pure);
  color: var(--text-main);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.category-select {
  flex: 1;
  padding: 10px;
  border: 2px solid rgba(68, 90, 20, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--primary-olive);
  color: var(--white-pure);
  cursor: pointer;
}

.category-select option {
  background-color: var(--white-pure);
  color: var(--text-main);
}

.clear-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: var(--danger);
  color: var(--white-pure);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.clear-filter-btn:hover {
  background: rgba(195, 71, 71, 0.1);
  color: var(--danger);
  border-color: var(--danger);
  transform: scale(1.04);
}

.product-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-cream);
  border-radius: 8px;
}

.product-item.no-stock {
  opacity: 0.5;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  font-size: 1.5rem;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.product-info .nombre {
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info .codigo {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.7;
}

.price-stock {
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
}

.precio {
  color: var(--primary-olive);
  font-weight: bold;
}

.stock {
  font-size: 0.75rem;
}

.stock-ok { color: var(--primary-olive); }
.stock-low { color: #f39c12; }
.stock-out { color: var(--danger); }

.add-btn {
  background: var(--primary-olive);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-section {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-olive) transparent;
}

.cart-items::-webkit-scrollbar {
  width: 5px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: var(--primary-olive);
  border-radius: 4px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-cream);
  border-radius: 10px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
}

.cart-item:hover {
  border-color: rgba(68, 90, 20, 0.2);
  box-shadow: 0 2px 8px rgba(68, 90, 20, 0.08);
  transform: translateX(3px);
}

.cart-item-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-olive);
  border-radius: 0 3px 3px 0;
  opacity: 0.4;
}

.cart-item:hover .cart-item-accent {
  opacity: 1;
}

.item-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(68, 90, 20, 0.1);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-nombre {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-precio {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.7;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  background: var(--primary-olive);
  color: white;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background: var(--soft-moss);
  transform: scale(1.1);
}

.qty-value {
  min-width: 20px;
  text-align: center;
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.95rem;
}

.item-subtotal {
  font-weight: 700;
  color: var(--primary-olive);
  min-width: 72px;
  text-align: right;
  font-size: 0.95rem;
}

.remove-btn {
  background: transparent;
  color: var(--danger);
  border: 1.5px solid rgba(195, 71, 71, 0.3);
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
  transform: scale(1.1);
}

.icon-small {
  width: 15px;
  height: 15px;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-main);
}

.empty-cart-icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  background: rgba(68, 90, 20, 0.06);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-cart-icon {
  width: 32px;
  height: 32px;
  opacity: 0.25;
}

.empty-cart-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-main);
}

.empty-cart-hint {
  font-size: 0.85rem;
  opacity: 0.6;
  margin: 0;
}

.empty-list {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-main);
}

.empty-list-icon {
  width: 36px;
  height: 36px;
  opacity: 0.2;
  margin-bottom: 12px;
}

.empty-list p {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.empty-list-hint {
  font-size: 0.85rem;
  opacity: 0.6;
}

.cliente-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
  padding: 14px;
  background: rgba(68, 90, 20, 0.04);
  border-radius: 10px;
  border: 1.5px solid rgba(68, 90, 20, 0.1);
}

.cliente-section .form-group {
  margin-bottom: 0;
}

.cliente-section label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.cliente-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid rgba(68, 90, 20, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--white-pure);
  color: var(--text-main);
  transition: border-color 0.2s;
}

.cliente-input:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.cliente-input::placeholder {
  color: var(--text-main);
  opacity: 0.4;
}

/* --- Cart Footer --- */
.cart-footer {
  flex-shrink: 0;
  border-top: 2px solid rgba(68, 90, 20, 0.12);
  padding-top: 15px;
}

.total-row {
  background: linear-gradient(135deg, var(--primary-olive), var(--soft-moss));
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.total-line span:first-child {
  opacity: 0.85;
  font-size: 0.9rem;
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 800;
}

.total-items-line {
  font-size: 0.8rem;
  opacity: 0.75;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border: 2px solid rgba(68, 90, 20, 0.2);
  border-radius: 8px;
  background: var(--white-pure);
  color: var(--text-main);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: var(--primary-olive);
  background: rgba(68, 90, 20, 0.04);
}

.payment-option.active {
  background: var(--primary-olive);
  color: white;
  border-color: var(--primary-olive);
  font-weight: 600;
}

.payment-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.register-btn {
  width: 100%;
  background: var(--primary-olive);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.register-btn:hover:not(:disabled) {
  background: var(--soft-moss);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(68, 90, 20, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-content.loading {
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon {
  width: 18px;
  height: 18px;
}

.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: var(--danger);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 11px;
  margin-left: 8px;
  vertical-align: middle;
  line-height: 1;
}

/* --- TransitionGroup animations --- */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}

.list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .ventas-container {
    grid-template-columns: 1fr;
  }
}
</style>