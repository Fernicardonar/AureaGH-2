import { createContext, useState, useContext, useEffect } from 'react'
import { loginUser, registerUser, getCurrentUser } from '../services/authService'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          const userData = await getCurrentUser()
          setUser(userData)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  // Normaliza el objeto de usuario recibido desde backend (puede venir directo o dentro de data.user)
  const normalizeUser = (data) => {
    if (!data) return null
    // Si viene anidado como { user: { ... }, token }
    if (data.user) return data.user
    // Si viene plano con campos del usuario + token
    const { _id, nombre, email, telefono, role, direccion } = data
    if (_id || nombre || email) {
      return { _id, nombre, email, telefono, role, direccion }
    }
    return null
  }

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password)
      localStorage.setItem('token', data.token)
      setUser(normalizeUser(data))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' }
    }
  }

  const register = async (userData) => {
    try {
      const data = await registerUser(userData)
      localStorage.setItem('token', data.token)
      setUser(normalizeUser(data))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al registrarse' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
