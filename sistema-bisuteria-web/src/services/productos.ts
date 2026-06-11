import api from './api'

export interface Imagen {
  id: number
  url: string
  publicId: string | null
}

export interface CategoriaInfo {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoriaId: number | null
  imagenId: number | null
  status: boolean
  createdAt: string
  categoria: CategoriaInfo | null
  imagen: Imagen | null
}

export const getProductos = (categoriaId?: number) => {
  const params: Record<string, string> = {}
  if (categoriaId) params.categoriaId = String(categoriaId)
  return api.get<Producto[]>('/productos', { params })
}

export const getProducto = (id: number) => {
  return api.get<Producto>(`/productos/${id}`)
}
