import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const STORAGE_KEY = 'loginFormState'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Restaurar estado previo (form y error) para evitar que se pierdan por remounts/renders
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // TTL: 2 minutos
        if (!parsed.ts || Date.now() - parsed.ts < 2 * 60 * 1000) {
          if (parsed.formData) setFormData(parsed.formData)
          if (parsed.error) setError(parsed.error)
        } else {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (_) {}
  }, [])

  // Persistir cada cambio de form o error
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, error, ts: Date.now() })
      )
    } catch (_) {}
  }, [formData, error])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      try { sessionStorage.removeItem(STORAGE_KEY) } catch (_) {}
      navigate('/dashboard')
    } else {
      setError(result.error)
      // Mantener visible; si quieres autocerrar, usa por ejemplo 15000 ms.
      // setTimeout(() => setError(''), 15000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm relative">
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="absolute right-2 top-1 text-red-500 hover:text-red-700"
                  aria-label="Cerrar"
                >
                  ×
                </button>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
