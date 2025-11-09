import { useState } from 'react'
import { sendContactMessage } from '../services/generalService'

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await sendContactMessage(formData)
      setStatus({ type: 'success', message: '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.' })
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Contáctanos</h1>
          <p className="text-gray-600 text-lg">Estamos aquí para ayudarte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Asunto *</label>
                <input
                  type="text"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-phone text-primary text-xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-gray-600">+57 3054412261</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-envelope text-primary text-xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">aureavirtualshop@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-primary text-xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Ubicaciones</h3>
                    <p className="text-gray-600 mb-2">Tienda virtual Antioquia Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Horarios de Atención</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Atención virtual</h3>
                  <p className="text-gray-600">Lunes a Sábado: 10:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Domingo: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
