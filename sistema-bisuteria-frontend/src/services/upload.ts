import api from './api'

export interface UploadResponse {
  url: string
  filename: string
  originalName: string
  size: number
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const res = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return res.data
}