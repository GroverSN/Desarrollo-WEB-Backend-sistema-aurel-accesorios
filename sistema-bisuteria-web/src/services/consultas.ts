import api from './api'

export interface CreateConsultaDto {
  nombre: string
  telefono: string
  productos?: string
}

export const createConsulta = (data: CreateConsultaDto) => {
  return api.post('/consultas', data)
}
