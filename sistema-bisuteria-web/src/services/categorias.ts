import api from './api'

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  status: boolean
  createdAt: string
}

export const getCategorias = () => {
  return api.get<Categoria[]>('/categorias', { params: { status: true } })
}
