import { useEffect } from 'react'

const TermsAndConditions = ({ isOpen, onClose }) => {
  // Cerrar modal con la tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Política General de Ventas */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-shopping-bag mr-2"></i>
              Política General de Ventas
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>
                Bienvenido a <strong>Aurea Virtual Shop</strong>. Al realizar una compra en nuestra tienda, 
                aceptas los siguientes términos y condiciones:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Todos los precios están expresados en pesos colombianos (COP)</li>
                <li>Los productos están sujetos a disponibilidad de stock</li>
                <li>Las imágenes son referenciales y pueden variar ligeramente del producto real</li>
                <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
                <li>La compra se considera finalizada al confirmar el pedido por WhatsApp</li>
              </ul>
            </div>
          </section>

          {/* Tiempos de Entrega */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-truck mr-2"></i>
              Tiempos de Entrega
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>Los tiempos de entrega varían según la ubicación:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Bogotá:</strong> 2 a 4 días hábiles</li>
                <li><strong>Principales ciudades:</strong> 3 a 6 días hábiles</li>
                <li><strong>Otras ciudades:</strong> 5 a 10 días hábiles</li>
                <li><strong>Zonas rurales:</strong> 8 a 15 días hábiles</li>
              </ul>
              <p className="mt-2">
                <em>Nota: Los tiempos pueden extenderse en temporadas de alta demanda (Black Friday, Navidad, etc.)</em>
              </p>
            </div>
          </section>

          {/* Política de Devoluciones */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-undo mr-2"></i>
              Política de Devoluciones y Cambios
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>Aceptamos devoluciones y cambios bajo las siguientes condiciones:</p>
              
              <h4 className="font-bold mt-3">✅ Se aceptan devoluciones si:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>El producto presenta defectos de fabricación</li>
                <li>Recibiste un artículo diferente al pedido</li>
                <li>El producto llegó dañado durante el envío</li>
                <li>La solicitud se realiza dentro de los 5 días hábiles posteriores a la entrega</li>
              </ul>

              <h4 className="font-bold mt-3">❌ NO se aceptan devoluciones si:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>El producto fue usado o lavado</li>
                <li>No tiene las etiquetas originales</li>
                <li>Han pasado más de 5 días hábiles desde la entrega</li>
                <li>El daño fue causado por mal uso del cliente</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-3">
                <p className="font-bold">Proceso de devolución:</p>
                <ol className="list-decimal list-inside ml-2 space-y-1">
                  <li>Contáctanos por WhatsApp con fotos del producto</li>
                  <li>Espera la aprobación de nuestro equipo</li>
                  <li>Envía el producto a nuestra dirección (gastos de envío a cargo del cliente)</li>
                  <li>Recibirás reembolso o cambio en 5-10 días hábiles</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Cancelaciones */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-ban mr-2"></i>
              Cancelaciones de Compra
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>Puedes cancelar tu pedido bajo las siguientes condiciones:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Antes del envío:</strong> Cancelación gratuita. Reembolso total</li>
                <li><strong>Durante el envío:</strong> Cancelación posible. Se cobrarán gastos de envío</li>
                <li><strong>Después de la entrega:</strong> Aplica política de devoluciones</li>
              </ul>
              <p className="mt-2">
                Para cancelar, contacta inmediatamente a nuestro equipo por WhatsApp con tu número de pedido.
              </p>
            </div>
          </section>

          {/* Formas de Pago */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-credit-card mr-2"></i>
              Formas de Pago
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>Aceptamos las siguientes formas de pago:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Transferencia bancaria (Bancolombia, Nequi, Daviplata)</li>
                <li>Pago contra entrega (según disponibilidad)</li>
                <li>Tarjetas de crédito y débito</li>
              </ul>
              <p className="mt-2">
                <strong>Importante:</strong> El pedido se procesará una vez confirmemos el pago.
              </p>
            </div>
          </section>

          {/* Garantía */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              Garantía de Calidad
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>
                Todos nuestros productos cuentan con garantía de calidad. Nos aseguramos de que cada 
                artículo cumpla con los más altos estándares antes de ser enviado.
              </p>
              <p>
                Si tienes algún problema con tu pedido, no dudes en contactarnos. 
                Nuestro equipo está comprometido con tu satisfacción.
              </p>
            </div>
          </section>

          {/* Privacidad */}
          <section>
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-user-shield mr-2"></i>
              Privacidad y Datos Personales
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>
                Protegemos tu información personal de acuerdo con la Ley 1581 de 2012. 
                Tus datos solo se utilizarán para procesar pedidos y mejorar tu experiencia de compra.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>No compartimos tu información con terceros sin tu consentimiento</li>
                <li>Tus datos de pago son procesados de forma segura</li>
                <li>Puedes solicitar la eliminación de tus datos en cualquier momento</li>
              </ul>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
              <i className="fas fa-headset mr-2"></i>
              ¿Tienes Preguntas?
            </h3>
            <div className="text-gray-700">
              <p className="mb-2">Estamos aquí para ayudarte:</p>
              <ul className="space-y-1">
                <li><strong>WhatsApp:</strong> +57 305 4412261</li>
                <li><strong>Email:</strong> aureavirtualshop@gmail.com</li>
                <li><strong>Horario:</strong> Lunes a viernes, 9:00 AM - 5:00 PM sábasdos, 9:00 AM - 1:00 PM</li>
                <li><strong>Redes Sociales:</strong> Síguenos en Instagram y Facebook @AureaVirtualShop</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
