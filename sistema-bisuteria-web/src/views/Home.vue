<template>
  <div>
    <HeroSection
      title="Accesorios de Bisuteria con Estilo"
      subtitle="Descubre nuestra colección de accesorios únicos, hechos para ti. Perfectos para cada ocasión."
    />

    <section class="container section">
      <h2 class="section-title">Categorías</h2>
      <p class="section-subtitle">Explora por tipo de accesorio</p>

      <div v-if="loadingCats" class="loading">Cargando categorías...</div>
      <div v-else class="grid-categories">
        <router-link
          v-for="cat in categorias"
          :key="cat.id"
          :to="`/catalogo?categoriaId=${cat.id}`"
          class="category-card"
        >
          <h3>{{ cat.nombre }}</h3>
        </router-link>
      </div>
    </section>

    <section class="container section">
      <h2 class="section-title">Productos Destacados</h2>
      <p class="section-subtitle">Lo más nuevo de nuestra colección</p>

      <div v-if="loadingProd" class="loading">Cargando productos...</div>
      <div v-else-if="productos.length === 0" class="empty">
        No hay productos disponibles en este momento.
      </div>
      <div v-else class="grid-products">
        <ProductCard v-for="p in productos" :key="p.id" :producto="p" />
      </div>

      <div class="ver-mas">
        <router-link to="/catalogo" class="btn btn-primary">
          Ver todos los productos
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategorias, type Categoria } from '../services/categorias'
import { getProductos, type Producto } from '../services/productos'
import HeroSection from '../components/HeroSection.vue'
import ProductCard from '../components/ProductCard.vue'

const categorias = ref<Categoria[]>([])
const productos = ref<Producto[]>([])
const loadingCats = ref(true)
const loadingProd = ref(true)

onMounted(async () => {
  try {
    const res = await getCategorias()
    categorias.value = res.data
  } catch {
    categorias.value = []
  } finally {
    loadingCats.value = false
  }

  try {
    const res = await getProductos()
    productos.value = res.data.slice(0, 8)
  } catch {
    productos.value = []
  } finally {
    loadingProd.value = false
  }
})
</script>

<style scoped>
.section {
  padding: 64px 20px;
  text-align: center;
}

.grid-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.category-card {
  background: var(--surface);
  border: 2px solid var(--soft-moss);
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  transition: all 0.3s;
}

.category-card:hover {
  background: var(--primary-olive);
  border-color: var(--primary-olive);
}

.category-card:hover h3 {
  color: white;
}

.category-card h3 {
  color: var(--primary-olive);
  font-size: 1.05rem;
  transition: color 0.3s;
}

.loading, .empty {
  padding: 40px;
  color: var(--soft-moss);
  font-size: 1.1rem;
}

.ver-mas {
  margin-top: 32px;
}

@media (max-width: 768px) {
  .section {
    padding: 40px 20px;
  }

  .grid-categories {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
