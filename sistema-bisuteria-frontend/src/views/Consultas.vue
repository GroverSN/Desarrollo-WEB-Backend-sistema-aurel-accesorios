<template>
  <MainLayout>

    <h1 class="page-title">Consultas</h1>

    <div class="filters-bar">
      <div class="search-box">
        <Search class="search-icon" />
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre..."
        />
      </div>
      <select v-model="filtroStatus" class="filter-select">
        <option value="all">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="contactado">Contactado</option>
        <option value="resuelto">Resuelto</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Productos</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in consultasFiltradas" :key="c.id">
          <td>{{ c.nombre }}</td>
          <td>{{ c.telefono || '—' }}</td>
          <td class="productos-cell">{{ resumirProductos(c.productos) }}</td>
          <td>{{ formatDate(c.fecha) }}</td>
          <td>
            <span :class="['status-badge', `status-${c.status}`]">
              {{ statusLabel(c.status) }}
            </span>
          </td>
          <td>
            <div class="actions">
              <button class="view" @click="verDetalle(c)" title="Ver detalle">
                <Eye class="icon" />
              </button>
              <button class="edit" @click="abrirCambiarStatus(c)" title="Cambiar estado">
                <CheckCircle class="icon" />
              </button>
              <button class="delete" @click="eliminar(c.id)" title="Eliminar">
                <Trash2 class="icon" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="consultasFiltradas.length === 0">
          <td colspan="6" class="no-results">No se encontraron consultas</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Ver Detalle -->
    <div v-if="mostrarModalVer" class="modal-overlay" @click.self="cerrarModalVer">
      <div class="modal modal-detail">
        <h3 class="modal-title">Detalle de Consulta</h3>

        <div class="detail-info">
          <div class="detail-row">
            <span class="label">Nombre:</span>
            <span class="value">{{ consultaVer.nombre }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Teléfono:</span>
            <span class="value">{{ consultaVer.telefono || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Estado:</span>
            <span class="value">
              <span :class="['status-badge', `status-${consultaVer.status}`]">
                {{ statusLabel(consultaVer.status) }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label">Fecha:</span>
            <span class="value">{{ formatDate(consultaVer.fecha) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Productos:</span>
          </div>
          <div class="detail-productos">
            {{ consultaVer.productos || 'Sin especificar' }}
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

    <!-- Modal Cambiar Status -->
    <div v-if="mostrarModalStatus" class="modal-overlay" @click.self="cerrarModalStatus">
      <div class="modal modal-small">
        <h3 class="modal-title">Cambiar Estado</h3>

        <p class="modal-desc">
          Consulta de <strong>{{ consultaStatus.nombre }}</strong>
        </p>

        <div class="form-group">
          <label for="nuevo-status">Nuevo estado:</label>
          <select id="nuevo-status" v-model="nuevoStatus" class="status-select">
            <option value="pendiente">Pendiente</option>
            <option value="contactado">Contactado</option>
            <option value="resuelto">Resuelto</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="save-btn" @click="guardarStatus" :disabled="guardando">
            <Check class="icon" />
            Guardar
          </button>
          <button class="cancel-btn" @click="cerrarModalStatus" :disabled="guardando">
            <X class="icon" />
            Cancelar
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
import {
  getConsultas,
  updateConsulta,
  deleteConsulta,
  type Consulta,
  type UpdateConsultaDto
} from '../services/consultas'
import { Search, Eye, CheckCircle, Trash2, Check, X } from 'lucide-vue-next'

const busqueda = ref('')
const filtroStatus = ref('all')
const consultas = ref<Consulta[]>([])

const mostrarModalVer = ref(false)
const consultaVer = ref<Consulta>({} as Consulta)

const mostrarModalStatus = ref(false)
const consultaStatus = ref<Consulta>({} as Consulta)
const nuevoStatus = ref('pendiente')
const guardando = ref(false)

const consultasFiltradas = computed(() => {
  let result = consultas.value

  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    result = result.filter(c => c.nombre.toLowerCase().includes(q))
  }

  if (filtroStatus.value !== 'all') {
    result = result.filter(c => c.status === filtroStatus.value)
  }

  return result
})

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    contactado: 'Contactado',
    resuelto: 'Resuelto',
  }
  return labels[status] || status
}

const resumirProductos = (productos: string | null) => {
  if (!productos) return '—'
  const lineas = productos.split('\n').filter(l => l.trim())
  if (lineas.length === 0) return '—'
  if (lineas.length === 1) return lineas[0]
  return `${lineas[0]} (+${lineas.length - 1} más)`
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const verDetalle = (c: Consulta) => {
  consultaVer.value = c
  mostrarModalVer.value = true
}

const cerrarModalVer = () => {
  mostrarModalVer.value = false
}

const abrirCambiarStatus = (c: Consulta) => {
  consultaStatus.value = c
  nuevoStatus.value = c.status
  mostrarModalStatus.value = true
}

const cerrarModalStatus = () => {
  mostrarModalStatus.value = false
}

const guardarStatus = async () => {
  guardando.value = true
  try {
    const data: UpdateConsultaDto = { status: nuevoStatus.value }
    await updateConsulta(consultaStatus.value.id, data)
    Swal.fire('Actualizado', 'Estado actualizado correctamente', 'success')
    mostrarModalStatus.value = false
    cargarConsultas()
  } catch {
    Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
  } finally {
    guardando.value = false
  }
}

const eliminar = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Eliminar consulta?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    try {
      await deleteConsulta(id)
      Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false })
      cargarConsultas()
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la consulta', 'error')
    }
  }
}

const cargarConsultas = async () => {
  try {
    const res = await getConsultas()
    consultas.value = res.data
  } catch {
    consultas.value = []
  }
}

onMounted(() => {
  cargarConsultas()
})
</script>

<style scoped>
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

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.filter-select {
  padding: 10px;
  border: 2px solid rgba(68, 90, 20, 0.3);
  background: var(--primary-olive);
  border-radius: 8px;
  font-size: 1rem;
  min-width: 180px;
  color: var(--white-pure);
}

.filter-select option {
  background-color: var(--white-pure);
  color: var(--primary-olive);
}

.productos-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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

.view { background: var(--soft-moss); color: white; }
.edit { background: var(--primary-olive); color: white; }
.delete { background: var(--danger); color: white; }

.icon { width: 16px; height: 16px; }

.no-results {
  text-align: center;
  padding: 30px;
  color: var(--text-main);
  opacity: 0.7;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-pendiente {
  background: rgba(243, 156, 18, 0.2);
  color: #e67e22;
}

.status-contactado {
  background: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.status-resuelto {
  background: rgba(39, 174, 96, 0.15);
  color: #27ae60;
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

.modal {
  background: var(--surface);
  padding: 30px;
  border-radius: 16px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.3s ease;
  box-shadow: var(--shadow);
}

.modal-detail {
  width: 550px;
}

.modal-small {
  width: 400px;
}

.modal-title {
  margin: 0;
  color: var(--primary-olive);
  font-size: 1.5rem;
  text-align: center;
}

.modal-desc {
  text-align: center;
  color: var(--text-main);
  font-size: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
}

.status-select {
  padding: 12px;
  border: 2px solid rgba(68, 90, 20, 0.2);
  border-radius: 8px;
  background: var(--white-pure);
  color: var(--text-main);
  font-size: 1rem;
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

.detail-productos {
  background: var(--bg-cream);
  padding: 16px;
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
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
  font-family: inherit;
  font-size: 1rem;
}

.save-btn:hover:not(:disabled) {
  background: var(--soft-moss);
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  font-family: inherit;
  font-size: 1rem;
}

.cancel-btn:hover {
  background: #b03a3a;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
  }
}
</style>
