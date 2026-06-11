import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

interface AuthResponse {
  message: string
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuth: false,
    user: null as User | null,
    token: null as string | null,
  }),

  actions: {
    async login(email: string, password: string, captcha: string) {
      try {
        const response = await api.post<AuthResponse>('/auth/login', {
          email,
          password,
          captcha,
        })

        const { token, user } = response.data

        this.token = token
        this.user = user
        this.isAuth = true

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } }
        const message = err.response?.data?.message || 'Error al iniciar sesión'
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
        })
        return { success: false, message }
      }
    },

    async register(nombre: string, email: string, password: string, captcha?: string) {
      try {
        const response = await api.post<AuthResponse>('/auth/register', {
          nombre,
          email,
          password,
          ...(captcha !== undefined && { captcha }),
        })

        const { token, user } = response.data

        this.token = token
        this.user = user
        this.isAuth = true

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } }
        const message = err.response?.data?.message || 'Error al registrar'
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
        })
        return { success: false, message }
      }
    },

    async checkPasswordStrength(password: string) {
      try {
        const response = await api.post<{ isValid: boolean; strength: string; message: string }>(
          '/auth/password-strength',
          { password }
        )
        return response.data
      } catch {
        return { isValid: false, strength: 'weak', message: 'Error al verificar' }
      }
    },

    logout() {
      this.isAuth = false
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuth = true
        } catch {
          this.logout()
        }
      }
    },
  },
})