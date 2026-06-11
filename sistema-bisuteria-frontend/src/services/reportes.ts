import api from './api'

export interface MonthlyStats {
  mes: string
  totalVentas: number
  cantidadVentas: number
}

export interface TopProduct {
  productoId: number
  nombre: string
  totalVendido: number
  ingresos: number
}

export interface ResumenGeneral {
  totalVentas: number
  totalIngresos: number
  totalProductos: number
  productosStockBajo: number
  productosStockBajoDetalle: { id: number; nombre: string; stock: number }[]
}

export const getMonthlyStats = (year: number) =>
  api.get<MonthlyStats[]>(`/reportes/stats/monthly?year=${year}`)

export const getTopProducts = (limit: number = 10) =>
  api.get<TopProduct[]>(`/reportes/stats/top-products?limit=${limit}`)

export const getResumenGeneral = () =>
  api.get<ResumenGeneral>('/reportes/stats/resumen')

export const downloadPDFReport = async (startDate: string, endDate: string, cliente?: string) => {
  let url_ = `/reportes/pdf?startDate=${startDate}&endDate=${endDate}`
  if (cliente) url_ += `&cliente=${encodeURIComponent(cliente)}`

  const response = await api.get(url_, {
    responseType: 'blob',
  })
  
  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const suffix = cliente ? `-${cliente}` : ''
  const link = document.createElement('a')
  link.href = url
  link.download = `reporte-ventas-${startDate}-${endDate}${suffix}.pdf`
  link.click()
  window.URL.revokeObjectURL(url)
}