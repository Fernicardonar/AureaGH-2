import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite, loaded } = useFavorites()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleWhatsApp = () => {
    const telefono = "573054412261"
    const productUrl = `${window.location.origin}/producto/${product._id}`
    const mensaje = `Hola, estoy interesado/a en este producto:

*${product.name}*
💰 Precio: $${product.price.toLocaleString('es-CO')}
🔗 Ver producto: ${productUrl}

¿Está disponible?`
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
  }

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    await toggleFavorite(product._id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <Link to={`/producto/${product._id}`} className="block relative group">
        <img 
          src={product.image || '/images/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.badge}
          </span>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleFavorite}
            title={isAuthenticated ? (isFavorite(product._id) ? 'Quitar de favoritos' : 'Agregar a favoritos') : 'Inicia sesión para guardar favoritos'}
            className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 mb-2 ${isFavorite(product._id) ? 'text-red-500' : 'text-gray-700'}`}
          >
            <i className={`${isFavorite(product._id) ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/producto/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-2">
          {Number(product.originalPrice) > 0 && (
            <span className="text-gray-400 line-through mr-2">
              ${Number(product.originalPrice).toLocaleString('es-CO')}
            </span>
          )}
          <span className="text-xl font-bold text-primary">
            ${product.price.toLocaleString('es-CO')}
          </span>
        </div>

        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index}
              className={`fas fa-star text-sm ${
                index < Math.floor(product.rating || 4) 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
              }`}
            ></i>
          ))}
          <span className="text-gray-600 text-sm ml-2">({product.rating || 4.0})</span>
        </div>

        <div className="flex flex-col space-y-2">
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary w-full text-sm"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            Agregar al Carrito
          </button>
          <button 
            onClick={handleWhatsApp}
            className="btn bg-green-500 text-white hover:bg-green-600 w-full text-sm"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            Comprar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
