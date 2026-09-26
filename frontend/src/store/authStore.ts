import { create } from 'zustand'
import axios from 'axios'

interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: string
}

interface AuthStore {
  token: string | null
  usuario: Usuario | null
  cargando: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, nombre: string, apellido: string, password: string, passwordConfirm: string) => Promise<void>
  logout: () => void
  verificarAuth: () => Promise<void>
}

const API_URL = 'http://localhost:5000/api'

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('token'),
  usuario: null,
  cargando: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ cargando: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })
      const { token, usuario } = response.data
      localStorage.setItem('token', token)
      set({ token, usuario, cargando: false })
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'Error al iniciar sesión'
      set({ error: mensaje, cargando: false })
      throw error
    }
  },

  register: async (email: string, nombre: string, apellido: string, password: string, passwordConfirm: string) => {
    set({ cargando: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        nombre,
        apellido,
        password,
        passwordConfirm,
      })
      const { token, usuario } = response.data
      localStorage.setItem('token', token)
      set({ token, usuario, cargando: false })
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'Error al registrarse'
      set({ error: mensaje, cargando: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, usuario: null })
  },

  verificarAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ token: null, usuario: null })
      return
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      set({ usuario: response.data, token })
    } catch (error) {
      localStorage.removeItem('token')
      set({ token: null, usuario: null })
    }
  },
}))
