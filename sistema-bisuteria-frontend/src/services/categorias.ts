import api from './api'

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  status: boolean
  productos?: Producto[]
}

interface Producto {
  id: number
  nombre: string
}

export interface CreateCategoriaDto {
  nombre: string
  descripcion?: string
}

export interface UpdateCategoriaDto {
  nombre?: string
  descripcion?: string
  status?: boolean
}

export const getCategorias = () => api.get<Categoria[]>('/categorias')

export const getCategoria = (id: number) => api.get<Categoria>(`/categorias/${id}`)

export const createCategoria = (data: CreateCategoriaDto) => api.post<Categoria>('/categorias', data)

export const updateCategoria = (id: number, data: UpdateCategoriaDto) =>
  api.put<Categoria>(`/categorias/${id}`, data)

export const deleteCategoria = (id: number) => api.delete(`/categorias/${id}`)