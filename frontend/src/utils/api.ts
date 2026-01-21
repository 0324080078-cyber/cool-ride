import axios from 'axios'
import { storage } from './storage'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const client = axios.create({ baseURL })

client.interceptors.request.use((config) => {
  const auth = storage.get<{ token: string }>('auth')
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export const authApi = client
export const ridesApi = client
export const pricingApi = client
export const paymentApi = client
export const adminApi = client
