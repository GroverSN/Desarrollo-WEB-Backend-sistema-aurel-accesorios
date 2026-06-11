import api from './api'

export interface Consulta {
  id: number
  nombre: string
  telefono: string | null
  productos: string | null
  fecha: string
  status: string
}

export interface CreateConsultaDto {
  nombre: string
  telefono?: string
  productos?: string
}

export interface UpdateConsultaDto {
  nombre?: string
  telefono?: string
  productos?: string
  status?: string
}

export const getConsultas = () => api.get<Consulta[]>('/consultas')

export const getConsulta = (id: number) => api.get<Consulta>(`/consultas/${id}`)

export const createConsulta = (data: CreateConsultaDto) =>
  api.post<Consulta>('/consultas', data)

export const updateConsulta = (id: number, data: UpdateConsultaDto) =>
  api.put<Consulta>(`/consultas/${id}`, data)

export const deleteConsulta = (id: number) =>
  api.delete(`/consultas/${id}`)
