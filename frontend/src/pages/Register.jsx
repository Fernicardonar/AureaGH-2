import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const result = await register({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono
    })

    setLoading(false)

    if (result.success) {
      setSuccess(`¡Cuenta creada exitosamente! Bienvenido/a ${formData.nombre}`)
      // Redirigir después de 2 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
            <p className="text-gray-600 mt-2">Únete a Áurea Virtual Shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tu nombre"
              />
            </div>

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
              <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+57 3054412261"
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

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : success ? 'Redirigiendo...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
