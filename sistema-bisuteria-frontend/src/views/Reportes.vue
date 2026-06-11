<template>
    <MainLayout>

        <h1 class="page-title">Reportes</h1>

        <!-- FILTROS PARA PDF -->
        <div class="filters">
            <div class="filter-group">
                <label>Fecha inicio</label>
                <input type="date" v-model="startDate" />
            </div>
            <div class="filter-group">
                <label>Fecha fin</label>
                <input type="date" v-model="endDate" />
            </div>
            <div class="filter-group">
                <label>Cliente (opcional)</label>
                <input type="text" v-model="clienteFilter" placeholder="Filtrar por cliente" />
            </div>
            <button class="generate-btn" @click="generarPDF" :disabled="loading">
                <Download class="icon" />
                <span>{{ loading ? 'Generando...' : 'Descargar PDF' }}</span>
                <span v-if="loading" class="spinner"></span>
            </button>
        </div>

        <!-- ESTADÍSTICAS MENSUALES -->
        <div class="section">
            <div class="section-header-row">
                <h2 class="section-title">Ventas por Mes</h2>
                <div class="year-selector">
                    <button class="year-btn" @click="selectedYear--" :disabled="selectedYear <= 2020">&larr;</button>
                    <span class="year-label">{{ selectedYear }}</span>
                    <button class="year-btn" @click="selectedYear++" :disabled="selectedYear >= currentYear">&rarr;</button>
                </div>
            </div>
            <div class="chart">
                <VueApexCharts type="bar" height="350" :options="monthlyBarOptions" :series="monthlyBarSeries"></VueApexCharts>
            </div>
        </div>

        <div class="sections-grid">
            <!-- TOP PRODUCTOS -->
            <div class="section">
                <h2 class="section-title">Productos Más Vendidos</h2>
                <div class="top-products">
                    <TransitionGroup name="list">
                        <div v-for="(p, index) in topProducts" :key="p.productoId" class="top-product-card">
                            <span class="rank">#{{ index + 1 }}</span>
                            <div class="product-info">
                                <h4>{{ p.nombre }}</h4>
                                <p>{{ p.totalVendido }} unidades vendidas</p>
                            </div>
                            <div class="product-stats">
                                <div class="progress-bar-track">
                                    <div class="progress-bar-fill" :style="{ width: productPercent(p.ingresos) + '%' }"></div>
                                </div>
                                <span class="ingresos">Bs {{ Number(p.ingresos).toFixed(2) }}</span>
                            </div>
                        </div>
                    </TransitionGroup>
                    <div v-if="topProducts.length === 0" class="empty-state-mini">
                        <p>Aún no hay ventas registradas</p>
                    </div>
                </div>
            </div>

            <!-- ÚLTIMAS VENTAS -->
            <div class="section">
                <h2 class="section-title">Últimas Ventas</h2>
                <div class="latest-sales">
                    <TransitionGroup name="list">
                        <div v-for="v in latestVentas" :key="v.id" class="sale-row">
                            <div class="sale-info">
                                <span class="sale-client">{{ v.clienteNombre || 'Sin cliente' }}</span>
                                <span class="sale-date">{{ formatDate(v.fecha) }}</span>
                            </div>
                            <div class="sale-meta">
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
        </div>

        <!-- RESUMEN GENERAL -->
        <div class="section">
            <h2 class="section-title">Resumen General</h2>
            <div class="resumen-grid">
                <div class="resumen-card">
                    <BarChart3 class="resumen-icon" />
                    <h3>Total Ventas</h3>
                    <p>{{ resumen.totalVentas }}</p>
                </div>
                <div class="resumen-card">
                    <DollarSign class="resumen-icon" />
                    <h3>Ingresos Totales</h3>
                    <p>Bs {{ Number(resumen.totalIngresos).toFixed(2) }}</p>
                </div>
                <div class="resumen-card highlight">
                    <TrendingUp class="resumen-icon" />
                    <h3>Ticket Promedio</h3>
                    <p>Bs {{ ticketPromedio }}</p>
                </div>
                <div class="resumen-card">
                    <Package class="resumen-icon" />
                    <h3>Productos Activos</h3>
                    <p>{{ resumen.totalProductos }}</p>
                </div>
                <div class="resumen-card warning">
                    <AlertTriangle class="resumen-icon" />
                    <h3>Stock Bajo</h3>
                    <p>{{ resumen.productosStockBajo }}</p>
                </div>
            </div>
        </div>

    </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { getMonthlyStats, getTopProducts, getResumenGeneral, downloadPDFReport, type MonthlyStats, type TopProduct, type ResumenGeneral } from '../services/reportes'
import { getLatestVentas, type VentaResumen } from '../services/ventas'
import { Download, BarChart3, DollarSign, TrendingUp, Package, AlertTriangle } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const startDate = ref(`${currentYear}-01-01`)
const endDate = ref(`${currentYear}-12-31`)
const clienteFilter = ref('')
const loading = ref(false)

const monthlyStats = ref<MonthlyStats[]>([])
const topProducts = ref<TopProduct[]>([])
const latestVentas = ref<VentaResumen[]>([])
const resumen = ref<ResumenGeneral>({
    totalVentas: 0,
    totalIngresos: 0,
    totalProductos: 0,
    productosStockBajo: 0,
    productosStockBajoDetalle: [],
})

const maxIngresos = computed(() => {
    if (topProducts.value.length === 0) return 1
    return Math.max(...topProducts.value.map(p => Number(p.ingresos)))
})

const ticketPromedio = computed(() => {
    if (resumen.value.totalVentas === 0) return '0.00'
    return (Number(resumen.value.totalIngresos) / resumen.value.totalVentas).toFixed(2)
})

const productPercent = (ingresos: number) => {
    return maxIngresos.value > 0 ? (Number(ingresos) / maxIngresos.value) * 100 : 0
}

const monthlyBarSeries = computed(() => [{
    name: 'Ingresos',
    data: monthlyStats.value.map(m => m.totalVentas)
}])

const monthlyBarOptions = computed(() => ({
    chart: {
        type: 'bar' as const,
        height: 350,
        toolbar: { show: false },
        animations: {
            enabled: true,
            easing: 'easeinout' as const,
            speed: 600,
            animateGradually: { enabled: true, delay: 100 },
            dynamicAnimation: { enabled: true, speed: 300 }
        }
    },
    colors: ['#445a14'],
    fill: {
        type: 'gradient' as const,
        gradient: {
            shadeIntensity: 1,
            gradientToColors: ['#7e9d57'],
            opacityFrom: 0.9,
            opacityTo: 0.8,
            stops: [0, 100]
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded' as const,
            borderRadius: 4
        }
    },
    dataLabels: { enabled: false },
    grid: {
        borderColor: 'rgba(68, 90, 20, 0.1)',
        strokeDashArray: 4
    },
    xaxis: {
        categories: monthlyStats.value.map(m => m.mes),
        labels: { style: { colors: '#6b6375', fontSize: '12px' } }
    },
    yaxis: {
        labels: {
            style: { colors: '#6b6375' },
            formatter: (val: number) => `Bs ${val.toFixed(0)}`
        }
    },
    tooltip: {
        y: {
            formatter: (val: number) => `Bs ${val.toFixed(2)}`
        }
    }
}))

const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const cargarDatos = async () => {
    try {
        const [resMensual, resTop, resResumen, resLatest] = await Promise.all([
            getMonthlyStats(selectedYear.value),
            getTopProducts(5),
            getResumenGeneral(),
            getLatestVentas(5)
        ])

        monthlyStats.value = resMensual.data
        topProducts.value = resTop.data
        resumen.value = resResumen.data
        latestVentas.value = resLatest.data
    } catch (error) {
        console.error('Error cargando reportes:', error)
    }
}

const generarPDF = async () => {
    if (!startDate.value || !endDate.value) return

    loading.value = true
    try {
        await downloadPDFReport(startDate.value, endDate.value, clienteFilter.value.trim() || undefined)
    } catch (error) {
        console.error('Error generando PDF:', error)
    } finally {
        loading.value = false
    }
}

watch(selectedYear, cargarDatos)

onMounted(() => {
    cargarDatos()
})
</script>

<style scoped>
/* --- Filters --- */
.filters {
    display: flex;
    gap: 14px;
    align-items: flex-end;
    margin-bottom: 30px;
    background: var(--surface);
    padding: 20px;
    border-radius: 12px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-width: 140px;
}

.filter-group label {
    color: var(--text-main);
    font-weight: 600;
    font-size: 0.85rem;
}

.filter-group input {
    padding: 10px 12px;
    border-radius: 8px;
    border: 2px solid rgba(68, 90, 20, 0.2);
    background: var(--white-pure);
    color: var(--text-main);
    font-size: 0.9rem;
    transition: border-color 0.2s;
}

.filter-group input:focus {
    outline: none;
    border-color: var(--primary-olive);
}

.generate-btn {
    background: var(--primary-olive);
    color: var(--white-pure);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    transition: 0.3s;
    min-height: 42px;
    white-space: nowrap;
}

.generate-btn:hover:not(:disabled) {
    background: var(--soft-moss);
    transform: translateY(-2px);
}

.generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.icon {
    width: 18px;
    height: 18px;
}

/* --- Sections --- */
.section {
    margin-top: 30px;
}

.section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
}

.section-title {
    color: var(--primary-olive);
    font-size: 1.3rem;
    margin-bottom: 15px;
}

.year-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.year-btn {
    background: var(--primary-olive);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.year-btn:hover:not(:disabled) {
    background: var(--soft-moss);
    transform: scale(1.08);
}

.year-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.year-label {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-main);
    min-width: 52px;
    text-align: center;
}

.chart {
    background: var(--surface);
    padding: 20px;
    border-radius: 12px;
    box-shadow: var(--shadow);
}

/* --- Grid: Top Products + Latest Sales --- */
.sections-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 30px;
}

/* --- Top Products --- */
.top-products {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.top-product-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--surface);
    padding: 14px 16px;
    border-radius: 10px;
    transition: all 0.2s ease;
    border: 1.5px solid transparent;
}

.top-product-card:hover {
    border-color: rgba(68, 90, 20, 0.15);
    box-shadow: 0 2px 8px rgba(68, 90, 20, 0.06);
}

.rank {
    background: var(--primary-olive);
    color: white;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 700;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-info h4 {
    margin: 0;
    color: var(--text-main);
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-info p {
    margin: 3px 0 0;
    font-size: 0.8rem;
    color: var(--text-main);
    opacity: 0.6;
}

.product-stats {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.progress-bar-track {
    width: 80px;
    height: 6px;
    background: rgba(68, 90, 20, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-olive), var(--soft-moss));
    border-radius: 3px;
    transition: width 0.6s ease;
}

.ingresos {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--primary-olive);
    min-width: 72px;
    text-align: right;
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
    gap: 12px;
    background: var(--surface);
    padding: 12px 16px;
    border-radius: 10px;
    transition: all 0.2s ease;
    border: 1.5px solid transparent;
}

.sale-row:hover {
    border-color: rgba(68, 90, 20, 0.15);
    box-shadow: 0 2px 8px rgba(68, 90, 20, 0.06);
}

.sale-info {
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

.sale-meta {
    display: flex;
    align-items: center;
    gap: 12px;
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
    min-width: 70px;
    text-align: right;
}

.empty-state-mini {
    text-align: center;
    padding: 30px 16px;
    color: var(--text-main);
    opacity: 0.5;
    font-size: 0.9rem;
}

/* --- Resumen Grid --- */
.resumen-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
}

.resumen-card {
    background: var(--surface);
    padding: 20px 16px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.25s ease;
    border: 1.5px solid transparent;
}

.resumen-card:hover {
    border-color: rgba(68, 90, 20, 0.12);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(68, 90, 20, 0.08);
}

.resumen-card h3 {
    color: var(--primary-olive);
    font-size: 0.8rem;
    margin: 0 0 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.resumen-card p {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
}

.resumen-card.warning p {
    color: var(--danger);
}

.resumen-card.highlight p {
    color: var(--soft-moss);
}

.resumen-icon {
    width: 24px;
    height: 24px;
    color: var(--primary-olive);
    opacity: 0.5;
    margin-bottom: 8px;
}

.resumen-card.warning .resumen-icon {
    color: var(--danger);
}

.resumen-card.highlight .resumen-icon {
    color: var(--soft-moss);
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

/* --- Responsive --- */
@media (max-width: 1024px) {
    .resumen-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .sections-grid {
        grid-template-columns: 1fr;
        gap: 0;
    }
}

@media (max-width: 768px) {
    .filters {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-group {
        min-width: unset;
    }

    .generate-btn {
        justify-content: center;
    }

    .resumen-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .product-stats {
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
    }

    .progress-bar-track {
        width: 60px;
    }
}
</style>
