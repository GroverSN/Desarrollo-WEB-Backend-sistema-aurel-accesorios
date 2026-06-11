<template>
  <MainLayout>

    <h1 class="page-title">Productos</h1>

    <div class="actions-row">
      <button class="create-btn" @click="abrirModalCrear">
        <Plus class="icon" />
        Nuevo Producto
      </button>
      <button class="create-btn category-btn" @click="abrirModalCategoria">
        <FolderPlus class="icon" />
        Nueva Categoría
      </button>
    </div>

    <!-- Búsqueda y Filtros -->
    <div class="filters-bar">
      <div class="search-box">
        <Search class="search-icon" />
        <input 
          v-model="busqueda" 
          type="text" 
          placeholder="Buscar por código o nombre"
        />
      </div>
      <select v-model="filtroCategoria" class="filter-select">
        <option :value="undefined">Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
          {{ cat.nombre }}
        </option>
      </select>
      <select v-model="filtroStock" class="filter-select">
        <option value="all">Cualquier stock</option>
        <option value="available">Con stock</option>
        <option value="low">Stock bajo (&lt;5)</option>
        <option value="out">Sin stock</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in productosFiltrados" :key="p.id">
          <td class="image-cell">
            <img v-if="p.imagen?.url" :src="obtenerUrlImagen(p.imagen?.url)" :alt="p.nombre" class="product-thumb" />
            <div v-else class="no-image">📦</div>
          </td>
          <td>{{ p.codigo }}</td>
          <td>{{ p.nombre }}</td>
          <td>{{ p.categoria?.nombre || 'Sin categoría' }}</td>
          <td>Bs {{ Number(p.precio).toFixed(2) }}</td>
          <td :class="getStockClass(p.stock)">{{ p.stock }}</td>
          <td>
            <div class="actions">
              <button class="view" @click="verProducto(p)" title="Ver detalle">
                <Eye class="icon" />
              </button>
              <button class="edit" @click="editar(p)">
                <Pencil class="icon" />
              </button>
              <button class="delete" @click="eliminar(p.id)">
                <Trash2 class="icon" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="productosFiltrados.length === 0">
          <td colspan="7" class="no-results">No se encontraron productos</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Crear/Editar -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h3 class="modal-title">{{ editando ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h3>

      <div class="form-columns">
        <div class="form-group">
          <label for="codigo">Código:</label>
          <input id="codigo" v-model="producto.codigo" placeholder="Código único" />
        </div>

        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input id="nombre" v-model="producto.nombre" placeholder="Nombre del producto" />
        </div>
      </div>

      <div class="form-columns">
        <div class="form-group">
          <label for="precio">Precio:</label>
          <input id="precio" v-model.number="producto.precio" type="number" step="0.01" placeholder="Precio" />
        </div>

        <div class="form-group">
          <label for="stock">Stock:</label>
          <input id="stock" v-model.number="producto.stock" type="number" placeholder="Stock" />
        </div>
      </div>

      <div class="form-group">
        <label for="categoria">Categoría:</label>
        <select id="categoria" v-model="producto.categoriaId">
          <option :value="undefined">Seleccionar Categoría</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
        
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="producto.descripcion" placeholder="Descripción opcional" rows="2"></textarea>
      </div>

        <div class="form-group">
          <label for="imagen">Imagen:</label>
          <div class="file-input-container">
            <input 
              type="file" 
              id="imagen" 
              @change="onFileSelected" 
              accept="image/*"
              class="file-input"
            />
            <div class="file-input-buttons">
              <button type="button" class="file-btn" @click="triggerFileInput">
                <Upload class="icon" />
                Seleccionar archivo
              </button>
              <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
            </div>
          </div>
          <input 
            id="imagen-url" 
            v-model="producto.imagenUrl" 
            placeholder="O pega una URL de imagen" 
            class="url-input"
          />
        </div>

        <div v-if="producto.imagenUrl || imagePreview" class="image-preview">
          <img :src="imagePreview || producto.imagenUrl" alt="Preview" />
        </div>

        <div class="modal-actions">
          <button @click="guardarProducto" class="save-btn" :disabled="saving">
            <Check class="icon" />
            {{ editando ? 'Actualizar' : 'Crear' }}
          </button>
          <button class="cancel-btn" @click="cerrarModal" :disabled="saving">
            <X class="icon" />
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Ver Detalle -->
    <div v-if="mostrarModalVer" class="modal-overlay" @click.self="cerrarModalVer">
      <div class="modal modal-detail">
        <h3 class="modal-title">{{ productoVer.nombre }}</h3>
        
        <div class="detail-image">
          <img v-if="productoVer.imagen?.url" :src="obtenerUrlImagen(productoVer.imagen?.url)" :alt="productoVer.nombre" />
          <div v-else class="no-image-large">📦</div>
        </div>

        <div class="detail-info">
          <div class="detail-row">
            <span class="label">Código:</span>
            <span class="value">{{ productoVer.codigo }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Descripción:</span>
            <span class="value">{{ productoVer.descripcion || 'Sin descripción' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Categoría:</span>
            <span class="value">{{ productoVer.categoria?.nombre || 'Sin categoría' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Precio:</span>
            <span class="value price">Bs {{ Number(productoVer.precio).toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Stock:</span>
            <span class="value" :class="getStockClass(productoVer.stock)">{{ productoVer.stock }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value">{{ productoVer.status ? 'Activo' : 'Inactivo' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Creado:</span>
            <span class="value">{{ formatDate(productoVer.createdAt) }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="cerrarModalVer">
            <X class="icon" />
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Categorías -->
    <div v-if="mostrarModalCategoria" class="modal-overlay" @click.self="cerrarModalCategoria">
      <div class="modal modal-categorias">
        <h3 class="modal-title">Gestionar Categorías</h3>

        <div class="categoria-input-section">
          <p class="section-subtitle">Agrega una nueva categoría</p>
          <div class="form-group">
            <label for="nueva-categoria">Nombre:</label>
            <div class="input-with-button">
              <input 
                id="nueva-categoria" 
                v-model="nuevaCategoria" 
                placeholder="Ej: Anillos, Collares, Pulseras..." 
                @keyup.enter="crearCategoria"
              />
              <button @click="crearCategoria" class="add-btn" :disabled="savingCategoria">
                <Plus class="icon" />
              </button>
            </div>
          </div>
        </div>

        <div class="categorias-section">
          <p class="section-subtitle">Categorías existentes ({{ categorias.length }})</p>
          <div v-if="categorias.length === 0" class="empty-state">
            <p>No hay categorías aún. Crea la primera!</p>
          </div>
          <div v-else class="categorias-list-improved">
            <div v-for="cat in categorias" :key="cat.id" class="categoria-item-improved">
              <div class="categoria-info">
                <Tag class="categoria-badge-icon" />
                <span class="categoria-name">{{ cat.nombre }}</span>
              </div>
              <button class="delete-btn-improved" @click="eliminarCategoria(cat.id)" title="Eliminar categoría">
                <Trash2 class="icon-small" />
              </button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="cerrarModalCategoria">
            <X class="icon" />
            Cerrar
          </button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import Swal from 'sweetalert2'
import { uploadImage } from '../services/upload'
import {
  getProductosAdmin,
  createProducto,
  updateProducto,
  deleteProducto,
  type Producto,
  type CreateProductoDto,
  type UpdateProductoDto
} from '../services/productos'
import { getCategorias, createCategoria as apiCrearCategoria, deleteCategoria as apiEliminarCategoria, type Categoria } from '../services/categorias'
import { Pencil, Trash2, Plus, Check, X, FolderPlus, Eye, Search, Upload, Tag } from 'lucide-vue-next'

const obtenerUrlImagen = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://localhost:3000')) return url
  if (url.startsWith('/uploads/')) {
    return `http://localhost:3000${url}`
  }
  return `http://localhost:3000/uploads/${url}`
}

const mostrarModal = ref(false)
const mostrarModalCategoria = ref(false)
const mostrarModalVer = ref(false)
const saving = ref(false)
const savingCategoria = ref(false)
const categorias = ref<Categoria[]>([])
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const uploading = ref(false)

// Filtros
const busqueda = ref('')
const filtroCategoria = ref<number | undefined>(undefined)
const filtroStock = ref('all')

interface ProductoForm {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoriaId?: number
  imagenUrl?: string
}

const productos = ref<Producto[]>([])

const producto = ref<ProductoForm>({
  id: 0,
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  categoriaId: undefined,
  imagenUrl: ''
})

const productoVer = ref<Producto>({} as Producto)
const editando = ref(false)
const productoId = ref<number | null>(null)
const nuevaCategoria = ref('')

const productosFiltrados = computed(() => {
  let filtered = productos.value

  // Filtro búsqueda
  if (busqueda.value) {
    const query = busqueda.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      p.codigo.toLowerCase().includes(query)
    )
  }

  // Filtro categoría
  if (filtroCategoria.value !== undefined) {
    filtered = filtered.filter(p => p.categoriaId === filtroCategoria.value)
  }

  // Filtro stock
  if (filtroStock.value === 'available') {
    filtered = filtered.filter(p => p.stock > 0)
  } else if (filtroStock.value === 'low') {
    filtered = filtered.filter(p => p.stock > 0 && p.stock < 5)
  } else if (filtroStock.value === 'out') {
    filtered = filtered.filter(p => p.stock === 0)
  }

  return filtered
})

const getStockClass = (stock: number) => {
  if (stock === 0) return 'stock-out'
  if (stock < 5) return 'stock-low'
  return 'stock-ok'
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const triggerFileInput = () => {
  const input = document.getElementById('imagen') as HTMLInputElement
  input?.click()
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const uploadSelectedFile = async (): Promise<string | undefined> => {
  if (!selectedFile.value) return undefined
  
  uploading.value = true
  try {
    const result = await uploadImage(selectedFile.value)
    return result.url
  } catch (error) {
    console.error('Error uploading file:', error)
    Swal.fire('Error', 'No se pudo subir la imagen', 'error')
    return undefined
  } finally {
    uploading.value = false
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
  limpiar()
}

const cerrarModalVer = () => {
  mostrarModalVer.value = false
}

const cerrarModalCategoria = () => {
  mostrarModalCategoria.value = false
  nuevaCategoria.value = ''
}

const abrirModalCrear = async () => {
  editando.value = false
  productoId.value = null
  limpiar()
  await cargarCategorias()
  mostrarModal.value = true
}

const abrirModalCategoria = async () => {
  nuevaCategoria.value = ''
  await cargarCategorias()
  mostrarModalCategoria.value = true
}

const crearCategoria = async () => {
  if (!nuevaCategoria.value.trim()) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return
  }
  
  savingCategoria.value = true
  try {
    await apiCrearCategoria({ nombre: nuevaCategoria.value.trim() })
    await cargarCategorias()
    nuevaCategoria.value = ''
    Swal.fire('Éxito', 'Categoría creada', 'success')
  } catch (error) {
    Swal.fire('Error', 'No se pudo crear la categoría', 'error')
  } finally {
    savingCategoria.value = false
  }
}

const eliminarCategoria = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Eliminar categoría?',
    text: 'Los productos asociados quedarán sin categoría',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      await apiEliminarCategoria(id)
      await cargarCategorias()
      Swal.fire('Éxito', 'Categoría eliminada', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar', 'error')
    }
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

const cargarProductos = async () => {
  try {
    const res = await getProductosAdmin()
    productos.value = res.data
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const verProducto = (p: Producto) => {
  productoVer.value = p
  mostrarModalVer.value = true
}

const guardarProducto = async () => {
  if (!producto.value.codigo || !producto.value.nombre) {
    Swal.fire('Error', 'Código y nombre son obligatorios', 'error')
    return
  }

  saving.value = true

  try {
    let imagenUrl = producto.value.imagenUrl
    
    if (selectedFile.value) {
      const uploaded = await uploadSelectedFile()
      if (uploaded) {
        imagenUrl = uploaded
      }
    }

    if (editando.value && productoId.value !== null) {
      const data: UpdateProductoDto = {
        codigo: producto.value.codigo,
        nombre: producto.value.nombre,
        descripcion: producto.value.descripcion || undefined,
        precio: Number(producto.value.precio),
        stock: Number(producto.value.stock),
        categoriaId: producto.value.categoriaId,
        imagenUrl: imagenUrl || undefined,
      }
      await updateProducto(productoId.value, data)
      Swal.fire('Actualizado', 'Producto actualizado', 'success')
    } else {
      const data: CreateProductoDto = {
        codigo: producto.value.codigo,
        nombre: producto.value.nombre,
        descripcion: producto.value.descripcion || undefined,
        precio: Number(producto.value.precio),
        stock: Number(producto.value.stock),
        categoriaId: producto.value.categoriaId,
        imagenUrl: imagenUrl || undefined,
      }
      await createProducto(data)
      Swal.fire('Creado', 'Producto creado', 'success')
    }

    mostrarModal.value = false
    limpiar()
    cargarProductos()
  } catch (error) {
    Swal.fire('Error', 'No se pudo guardar el producto', 'error')
  } finally {
    saving.value = false
  }
}

const editar = async (p: Producto) => {
  await cargarCategorias()
  producto.value = {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    precio: p.precio,
    stock: p.stock,
    categoriaId: p.categoriaId,
    imagenUrl: p.imagen?.url || ''
  }
  productoId.value = p.id
  editando.value = true
  mostrarModal.value = true
}

const eliminar = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'El producto será eliminado (soft delete)',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await deleteProducto(id)
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false })
      cargarProductos()
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el producto', 'error')
    }
  }
}

const limpiar = () => {
  producto.value = {
    id: 0,
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: undefined,
    imagenUrl: ''
  }
  editando.value = false
  productoId.value = null
  selectedFile.value = null
  imagePreview.value = null
}

onMounted(() => {
  cargarProductos()
  cargarCategorias()
})
</script>

<style scoped>
.actions-row {
  display: flex;
  margin-bottom: 15px;
}

.filters-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  position: relative;
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
  width: 90%;
  padding: 10px 10px 10px 40px;
  border: 2px solid rgba(68, 90, 20, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--white-pure);
  color: var(--text-main);
}

.filter-select {
  padding: 10px;
  border: 2px solid rgba(68, 90, 20, 0.3);
  background: var(--primary-olive);
  border-radius: 8px;
  font-size: 1rem;
  min-width: 150px;
  color: var(--white-pure);
}

.filter-select option {
  background-color: var(--white-pure);
  color: var(--primary-olive);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.image-cell {
  width: 60px;
}

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.no-image {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-cream);
  border-radius: 8px;
  font-size: 1.5rem;
}

.stock-ok { color: var(--primary-olive); font-weight: bold; }
.stock-low { color: #f39c12; font-weight: bold; }
.stock-out { color: var(--danger); font-weight: bold; }

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.actions button {
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view {
  background: var(--soft-moss);
  color: white;
}

.edit {
  background: var(--primary-olive);
  color: white;
}

.delete {
  background: var(--danger);
  color: white;
}

.icon {
  width: 16px;
  height: 16px;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: var(--text-main);
  opacity: 0.7;
}

.modal-detail {
  width: 500px;
}

.detail-image {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.detail-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-image-large {
  font-size: 4rem;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(68, 90, 20, 0.2);
}

.detail-row .label {
  font-weight: 600;
  color: var(--text-main);
}

.detail-row .value {
  color: var(--text-main);
}

.detail-row .price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-olive);
}

.image-preview {
  margin: 10px 0;
  text-align: center;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.file-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input {
  display: none;
}

.file-input-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-btn {
  background: var(--soft-moss);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.file-btn:hover {
  background: var(--primary-olive);
}

.file-name {
  font-size: 0.85rem;
  color: var(--text-main);
}

.url-input {
  margin-top: 8px;
}

.create-btn {
  margin-bottom: 0;
  background: var(--primary-olive);
  color: var(--white-pure);
  border: none;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.category-btn {
  background: var(--earth-brown);
  margin-left: 10px;
}

.modal {
  background: var(--surface);
  padding: 30px;
  border-radius: 16px;
  width: 650px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.3s ease;
  box-shadow: var(--shadow);
}

.modal-title {
  margin: 0;
  color: var(--primary-olive);
  font-size: 1.5rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
}

.modal input,
.modal select,
.modal textarea {
  padding: 12px;
  border: 2px solid rgba(68, 90, 20, 0.2);
  border-radius: 8px;
  background: var(--white-pure);
  color: var(--text-main);
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background: var(--primary-olive);
  color: var(--white-pure);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: 0.3s;
  flex: 1;
}

.save-btn:hover:not(:disabled) {
  background: var(--soft-moss);
  transform: translateY(-2px);
}

.cancel-btn {
  background: var(--danger);
  color: var(--white-pure);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: 0.3s;
  flex: 1;
}

.cancel-btn:hover {
  background: #b03a3a;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.input-with-button {
  display: flex;
  gap: 10px;
}

.input-with-button input {
  flex: 1;
  padding: 12px;
  border: 2px solid rgba(68, 90, 20, 0.2);
  border-radius: 8px;
  font-size: 1rem;
}

.input-with-button .save-btn {
  margin: 0;
  padding: 10px;
}

.input-with-button .add-btn {
  background: var(--primary-olive);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 600;
}

.input-with-button .add-btn:hover:not(:disabled) {
  background: var(--soft-moss);
  transform: translateY(-2px);
}

.input-with-button .add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-categorias {
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.categoria-input-section {
  background: linear-gradient(135deg, rgba(152, 175, 75, 0.1) 0%, rgba(152, 175, 75, 0.05) 100%);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid rgba(152, 175, 75, 0.2);
  margin-bottom: 25px;
}

.categoria-input-section .form-group {
  margin-bottom: 0;
}

.section-subtitle {
  margin: 0 0 15px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-olive);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.categorias-section {
  margin-bottom: 20px;
}

.categorias-list-improved {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.categoria-item-improved {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--white-pure);
  border: 2px solid rgba(68, 90, 20, 0.15);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.categoria-item-improved:hover {
  background: var(--bg-cream);
  border-color: var(--primary-olive);
  box-shadow: 0 4px 12px rgba(68, 90, 20, 0.1);
  transform: translateX(4px);
}

.categoria-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.categoria-badge-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-olive);
  flex-shrink: 0;
}

.categoria-name {
  font-weight: 500;
  color: var(--text-main);
  font-size: 0.95rem;
}

.delete-btn-improved {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger);
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.delete-btn-improved:hover {
  background: var(--danger);
  color: white;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--primary-olive);
  font-size: 0.95rem;
  opacity: 0.7;
}

.categorias-list {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 15px 0;
}

.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-cream);
  border-radius: 8px;
}

.delete-small {
  background: var(--danger);
  padding: 4px 8px;
  border-radius: 6px;
}

.icon-small {
  width: 14px;
  height: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white-pure);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
}

th {
  background: var(--primary-olive);
  color: var(--white-pure);
  padding: 12px;
}

td {
  padding: 12px;
  color: var(--text-main);
  text-align: center;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

tr:hover {
  background: var(--accent-bg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
  }
}
</style>