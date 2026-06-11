<template>
  <div class="container page">
    <h1 class="page-title">Catálogo de Productos</h1>

    <div class="toolbar">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre o código..."
          class="search-input"
        />
      </div>

      <div class="filtros">
        <button
          :class="['filtro-btn', { active: categoriaActiva === null }]"
          @click="categoriaActiva = null"
        >
          Todas
        </button>
        <button
          v-for="cat in categorias"
          :key="cat.id"
          :class="['filtro-btn', { active: categoriaActiva === cat.id }]"
          @click="categoriaActiva = cat.id"
        >
          {{ cat.nombre }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="skeleton-grid">
        <div v-for="n in 8" :key="n" class="skeleton-card">
          <div class="skeleton-img" />
          <div class="skeleton-text" />
          <div class="skeleton-text short" />
        </div>
      </div>
    </div>
    <template v-else-if="productosFiltrados.length === 0">
      <div class="empty">
        {{ busqueda ? 'No se encontraron productos con ese nombre o código.' : 'No se encontraron productos en esta categoría.' }}
      </div>
    </template>
    <div v-else class="grid-products">
      <ProductCard v-for="p in productosFiltrados" :key="p.id" :producto="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategorias, type Categoria } from '../services/categorias'
import { getProductos, type Producto } from '../services/productos'
import ProductCard from '../components/ProductCard.vue'
import { Search } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const categorias = ref<Categoria[]>([])
const productos = ref<Producto[]>([])
const loading = ref(true)
const busqueda = ref('')
const categoriaActiva = ref<number | null>(
  route.query.categoriaId ? Number(route.query.categoriaId) : null
)

const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return productos.value
  return productos.value.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.codigo.toLowerCase().includes(q)
  )
})

const cargarProductos = async (catId: number | null) => {
  loading.value = true
  try {
    const res = await getProductos(catId ?? undefined)
    productos.value = res.data
  } catch {
    productos.value = []
  } finally {
    loading.value = false
  }
}

watch(categoriaActiva, (val) => {
  router.replace({ query: val ? { categoriaId: String(val) } : {} })
  cargarProductos(val)
})

onMounted(async () => {
  try {
    const res = await getCategorias()
    categorias.value = res.data
  } catch {
    categorias.value = []
  }
  cargarProductos(categoriaActiva.value)
})
</script>

<style scoped>
.page {
  padding: 48px 20px;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--soft-moss);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--surface);
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.search-input::placeholder {
  color: #bbb;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.filtro-btn {
  padding: 8px 20px;
  border: 2px solid var(--soft-moss);
  border-radius: 20px;
  background: transparent;
  color: var(--soft-moss);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  cursor: pointer;
  font-family: inherit;
}

.filtro-btn:hover,
.filtro-btn.active {
  background: var(--primary-olive);
  border-color: var(--primary-olive);
  color: white;
}

.loading {
  padding: 20px 0;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.skeleton-card {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-img {
  aspect-ratio: 1;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  height: 16px;
  background: #eee;
  margin: 12px 14px 8px;
  border-radius: 4px;
}

.skeleton-text.short {
  width: 60%;
  height: 14px;
  margin-bottom: 14px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--soft-moss);
  font-size: 1.1rem;
}
</style>
