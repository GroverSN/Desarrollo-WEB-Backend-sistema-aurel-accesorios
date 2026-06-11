<template>
  <MainLayout>

    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <button class="quick-sale-btn" @click="irAVentas">
        <ShoppingCart class="icon" />
        Nueva Venta
      </button>
    </div>

    <div class="cards">
      <div class="card">
        <DollarSign class="card-icon" />
        <h3>Total Ventas</h3>
        <p class="stat-value">Bs {{ Number(resumen.totalIngresos).toFixed(2) }}</p>
      </div>

      <div class="card">
        <ShoppingCart class="card-icon" />
        <h3>Ventas Realizadas</h3>
        <p class="stat-value">{{ resumen.totalVentas }}</p>
      </div>

      <div class="card" :class="{ 'alert-card': resumen.productosStockBajo > 0 }">
        <AlertTriangle class="card-icon" />
        <h3>Stock Bajo</h3>
        <p class="stat-value" :class="{ warning: resumen.productosStockBajo > 0 }">{{ resumen.productosStockBajo }}</p>
      </div>

      <div class="card">
        <Package class="card-icon" />
        <h3>Productos Activos</h3>
        <p class="stat-value">{{ resumen.totalProductos }}</p>
      </div>
    </div>

    <!-- Últimas Ventas + Top Productos -->
    <div class="dashboard-grid">
      <div class="section">
        <h2 class="section-title">Últimas Ventas</h2>
        <div class="latest-sales">
          <TransitionGroup name="list">
            <div v-for="v in latestVentas" :key="v.id" class="sale-row" @click="irAVentas">
              <div class="sale-left">
                <span class="sale-client">{{ v.clienteNombre || 'Sin cliente' }}</span>
                <span class="sale-date">{{ formatDate(v.fecha) }}</span>
              </div>
              <div class="sale-right">
                <span class="sale-method" :class="'method-' + v.metodoPago">{{ v.metodoPago }}</span>
                <span class="sale-total">Bs {{ Number(v.total).toFixed(2) }}</span>
              </div>
            </div>
          </TransitionGroup>
          <div v-if="latestVentas.length === 0" class="empty-state-mini">
            <p>Aún no hay ventas registradas</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Productos Más Vendidos</h2>
        <div class="top-products">
          <TransitionGroup name="list">
            <div v-for="(p, index) in topProducts" :key="p.productoId" class="top-product-row" @click="irAProductos">
              <span class="rank-sm">#{{ index + 1 }}</span>
              <span class="top-name">{{ p.nombre }}</span>
              <span class="top-qty">{{ p.totalVendido }} uds</span>
            </div>
          </TransitionGroup>
          <div v-if="topProducts.length === 0" class="empty-state-mini">
            <p>Aún no hay ventas registradas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos recientes con imagen -->
    <div class="section">
      <h2 class="section-title">Productos Recientes</h2>
      <div class="products-grid">
        <TransitionGroup name="list">
          <div v-for="p in productosRecientes" :key="p.id" class="product-card" @click="irAProductos">
            <div class="product-img">
              <img v-if="p.imagen?.url" :src="obtenerUrlImagen(p.imagen?.url)" :alt="p.nombre" />
              <div v-else class="product-no-img">📦</div>
            </div>
            <div class="product-body">
              <h4>{{ p.nombre }}</h4>
              <span class="product-price">Bs {{ Number(p.precio).toFixed(2) }}</span>
              <span class="product-stock" :class="getStockClass(p.stock)">{{ p.stock }} en stock</span>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Stock bajo detalle -->
    <div v-if="resumen.productosStockBajoDetalle?.length" class="stock-warning">
      <h2 class="section-title warning-title">
        <AlertTriangle class="icon" />
        Productos con Stock Bajo
      </h2>
      <div class="warning-list">
        <div v-for="p in resumen.productosStockBajoDetalle" :key="p.id" class="warning-item">
          <span>{{ p.nombre }}</span>
          <span class="stock-count">{{ p.stock }} unidades</span>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductos } from '../services/productos'
import { getResumenGeneral, getTopProducts, type ResumenGeneral, type TopProduct } from '../services/reportes'
import { getLatestVentas, type VentaResumen } from '../services/ventas'
import { ShoppingCart, DollarSign, Package, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()

const resumen = ref<ResumenGeneral>({
  totalVentas: 0,
  totalIngresos: 0,
  totalProductos: 0,
  productosStockBajo: 0,
  productosStockBajoDetalle: [],
})

const latestVentas = ref<VentaResumen[]>([])
const topProducts = ref<TopProduct[]>([])
const productosRecientes = ref<{ id: number; nombre: string; precio: number; stock: number; imagen?: { url: string } }[]>([])

const obtenerUrlImagen = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://localhost:3000')) return url
  if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`
  return `http://localhost:3000/uploads/${url}`
}

const getStockClass = (stock: number) => {
  if (stock === 0) return 'stock-out'
  if (stock < 5) return 'stock-low'
  return 'stock-ok'
}

const formatDate = (dateStr: string | Date) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const irAVentas = () => router.push('/ventas')
const irAProductos = () => router.push('/productos')

onMounted(async () => {
  try {
    const [resResumen, resLatest, resTop, resProductos] = await Promise.all([
      getResumenGeneral(),
      getLatestVentas(4),
      getTopProducts(5),
      getProductos()
    ])
    resumen.value = resResumen.data
    latestVentas.value = resLatest.data
    topProducts.value = resTop.data
    productosRecientes.value = resProductos.data.slice(0, 6)
  } catch (error) {
    console.error('Error cargando dashboard:', error)
  }
})
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dashboard-header .page-title {
  margin: 0;
}

.quick-sale-btn {
  background: var(--primary-olive);
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.quick-sale-btn:hover {
  background: var(--soft-moss);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(68, 90, 20, 0.3);
}

/* --- Cards --- */
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 4px;
}

.card {
  background: var(--surface);
  padding: 22px 20px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1.5px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(68, 90, 20, 0.1);
  border-color: rgba(68, 90, 20, 0.12);
}

.card-icon {
  width: 28px;
  height: 28px;
  color: var(--primary-olive);
  opacity: 0.5;
  margin-bottom: 10px;
}

.card h3 {
  color: var(--primary-olive);
  margin: 0 0 6px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card p {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.alert-card {
  border-color: var(--danger);
}

.alert-card .card-icon {
  color: var(--danger);
  opacity: 0.7;
}

.stat-value.warning {
  color: var(--danger);
}

/* --- Dashboard Grid (Latest + Top) --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 30px;
}

.section-title {
  color: var(--primary-olive);
  margin: 0 0 14px;
  font-size: 1.15rem;
}

.warning-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--danger);
}

/* --- Latest Sales --- */
.latest-sales {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sale-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--surface);
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
}

.sale-row:hover {
  border-color: rgba(68, 90, 20, 0.18);
  box-shadow: 0 2px 10px rgba(68, 90, 20, 0.06);
  transform: translateX(3px);
}

.sale-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.sale-client {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sale-date {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.55;
}

.sale-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.sale-method {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: capitalize;
  background: rgba(68, 90, 20, 0.08);
  color: var(--primary-olive);
}

.sale-total {
  font-weight: 700;
  color: var(--text-main);
  min-width: 62px;
  text-align: right;
}

/* --- Top Products mini --- */
.top-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.top-product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
}

.top-product-row:hover {
  border-color: rgba(68, 90, 20, 0.18);
  box-shadow: 0 2px 10px rgba(68, 90, 20, 0.06);
  transform: translateX(3px);
}

.rank-sm {
  background: var(--primary-olive);
  color: white;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.top-name {
  flex: 1;
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-qty {
  font-size: 0.8rem;
  color: var(--text-main);
  opacity: 0.6;
  flex-shrink: 0;
}

.empty-state-mini {
  text-align: center;
  padding: 24px 12px;
  color: var(--text-main);
  opacity: 0.4;
  font-size: 0.9rem;
}

/* --- Products Grid --- */
.section {
  margin-top: 30px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.product-card {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1.5px solid transparent;
}

.product-card:hover {
  border-color: rgba(68, 90, 20, 0.18);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(68, 90, 20, 0.08);
}

.product-img {
  width: 100%;
  height: 130px;
  overflow: hidden;
  background: var(--bg-cream);
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: var(--bg-cream);
}

.product-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-body h4 {
  margin: 0;
  color: var(--text-main);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-weight: 700;
  color: var(--primary-olive);
  font-size: 1rem;
}

.product-stock {
  font-size: 0.75rem;
}

.stock-ok { color: var(--primary-olive); }
.stock-low { color: #f39c12; }
.stock-out { color: var(--danger); }

/* --- Stock Warning --- */
.stock-warning {
  background: rgba(195, 71, 71, 0.06);
  padding: 20px;
  border-radius: 12px;
  border: 1.5px solid rgba(195, 71, 71, 0.25);
  margin-top: 30px;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warning-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-main);
}

.stock-count {
  color: var(--danger);
  font-weight: bold;
}

/* --- TransitionGroup --- */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.92);
}

.list-move {
  transition: transform 0.3s ease;
}

.icon {
  width: 18px;
  height: 18px;
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .quick-sale-btn {
    justify-content: center;
  }

  .products-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
