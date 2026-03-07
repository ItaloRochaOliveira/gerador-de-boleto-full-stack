import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface BoletoData {
  nomeEmpresa: string
  cpfCnpj: string
  endereco: string
  descricaoReferencia: string
  valor: number
  vencimento: string
}

export interface Boleto {
  id: string
  nomeEmpresa: string
  cpfCnpj: string
  endereco: string
  descricaoReferencia: string
  valor: number
  vencimento: string
  createdAt: string
  updatedAt: string
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },
}

export const boletoAPI = {
  list: async (): Promise<{ boletos: Boleto[], total: number, page: number, limit: number }> => {
    const response = await api.get('/boleto')
    return response.data
  },

  get: async (id: string): Promise<Boleto> => {
    const response = await api.get(`/boleto/${id}`)
    return response.data
  },

  create: async (data: BoletoData): Promise<Boleto> => {
    const response = await api.post('/boleto/create', data)
    return response.data
  },

  generatePdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/boleto/${id}/pdf`, {
      responseType: 'blob',
    })
    return response.data
  },

  generateAllPdf: async (): Promise<Blob> => {
    const response = await api.get('/boleto/pdf/all', {
      responseType: 'blob',
    })
    return response.data
  },
}

export default api
