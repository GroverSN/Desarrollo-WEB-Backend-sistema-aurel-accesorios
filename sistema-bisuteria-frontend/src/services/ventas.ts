import api from './api'

export interface Venta {
  id: number
  fecha: string
  usuarioId: number
  usuario?: { id: number; nombre: string }
  total: number
  metodoPago: string
  clienteNombre: string
  clienteTelefono?: string
  detalles: DetalleVenta[]
}

export interface DetalleVenta {
  id: number
  productoId: number
  producto?: { id: number; nombre: string }
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface CreateVentaDto {
  metodoPago?: string
  clienteNombre: string
  clienteTelefono?: string
  detalles: DetalleVentaDto[]
}

export interface DetalleVentaDto {
  productoId: number
  cantidad: number
}

export interface VentaResumen {
  id: number
  fecha: string
  total: number
  metodoPago: string
  clienteNombre: string
  clienteTelefono?: string
  usuario?: { id: number; nombre: string }
}

export const getVentas = () => api.get<Venta[]>('/ventas')

export const getVenta = (id: number) => api.get<Venta>(`/ventas/${id}`)

export const getLatestVentas = (limit: number = 5) =>
  api.get<VentaResumen[]>(`/ventas/latest?limit=${limit}`)

export const createVenta = (data: CreateVentaDto) => api.post<Venta>('/ventas', data)