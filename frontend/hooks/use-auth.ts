'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { LoginFormData, SignupFormData } from '@/lib/validations'
import { toast } from 'sonner'

interface UseAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginFormData) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(data)
      localStorage.setItem('token', response.message.message.token)
      setIsAuthenticated(true)
      toast.success('Login realizado com sucesso!')
      router.push('/')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      const response = await authAPI.signup(data)
      localStorage.setItem('token', response.message.message.token)
      setIsAuthenticated(true)
      toast.success('Conta criada com sucesso!')
      router.push('/')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    toast.success('Logout realizado com sucesso!')
    router.push('/auth')
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  }
}
