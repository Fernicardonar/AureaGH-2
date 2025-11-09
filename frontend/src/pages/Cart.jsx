import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TermsAndConditions from '../components/TermsAndConditions'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [showTerms, setShowTerms] = useState(false)

  const handleWhatsAppOrder = () => {
    const telefono = "573006003786"
    let mensaje = "Hola! Quiero realizar el siguiente pedido:\n\n"
    
    cartItems.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.name}*\n`
      if (item.selectedSize) mensaje += `   Talla: ${item.selectedSize}\n`
      if (item.selectedColor) mensaje += `   Color: ${item.selectedColor}\n`
      mensaje += `   Cantidad: ${item.quantity}\n`
      mensaje += `   Precio: $${item.price.toLocaleString('es-CO')}\n`
      mensaje += `   Subtotal: $${(item.price * item.quantity).toLocaleString('es-CO')}\n\n`
    })
    
    mensaje += `*Total: $${getCartTotal().toLocaleString('es-CO')}*`
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Agrega productos para comenzar tu compra</p>
          <Link to="/" className="btn btn-primary">
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center border-b last:border-b-0 p-6">
                  <img 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-grow ml-6">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Talla:</span> {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Color:</span> {item.selectedColor}
                      </p>
                    )}
                    <p className="text-primary font-bold mt-1">
                      ${item.price.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-700 font-medium"
            >
              <i className="fas fa-trash mr-2"></i>
              Vaciar carrito
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>Calculado al finalizar</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>${getCartTotal().toLocaleString('es-CO')}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full btn bg-green-500 text-white hover:bg-green-600 mb-3"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Ordenar por WhatsApp
              </button>

              <Link to="/" className="block text-center text-primary hover:underline mb-4">
                Continuar comprando
              </Link>

              {/* Términos y Condiciones */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowTerms(true)}
                  className="w-full text-sm text-gray-600 hover:text-primary transition flex items-center justify-center"
                >
                  <i className="fas fa-file-contract mr-2"></i>
                  Ver Términos y Condiciones
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Al realizar el pedido, aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditions isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  )
}

export default Cart
