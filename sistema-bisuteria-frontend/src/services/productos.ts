import api from './api'

export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoriaId?: number
  categoria?: { id: number; nombre: string }
  imagenId?: number
  imagen?: { id: number; url: string }
  status: boolean
  createdAt?: string | Date
}

export interface CreateProductoDto {
  codigo: string
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoriaId?: number
  imagenId?: number
  imagenUrl?: string
}

export interface UpdateProductoDto {
  codigo?: string
  nombre?: string
  descripcion?: string
  precio?: number
  stock?: number
  categoriaId?: number
  imagenId?: number
  imagenUrl?: string
  status?: boolean
}

export const getProductos = () => api.get<Producto[]>('/productos')

export const getProducto = (id: number) => api.get<Producto>(`/productos/${id}`)

export const getProductosAdmin = () => api.get<Producto[]>('/productos/admin/all')

export const createProducto = (data: CreateProductoDto) => api.post<Producto>('/productos', data)

export const updateProducto = (id: number, data: UpdateProductoDto) =>
  api.put<Producto>(`/productos/${id}`, data)

export const deleteProducto = (id: number) => api.delete(`/productos/${id}`)