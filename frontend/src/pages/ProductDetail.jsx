import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById, addReview } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import SizeGuide from '../components/SizeGuide'

// Mapeo de nombres de colores en español a códigos hexadecimales
const colorMap = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Gris': '#808080',
  'Azul': '#1E40AF',
  'Rojo': '#DC2626',
  'Verde': '#059669',
  'Amarillo': '#FBBF24',
  'Naranja': '#F97316',
  'Rosa': '#EC4899',
  'Morado': '#9333EA',
  'Beige': '#D4B896',
  'Café': '#7C3416',
  'Vino': '#722F37',
  'Dorado': '#FFD700',
  'Plateado': '#C0C0C0',
  'Multicolor': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)'
}

// Función para determinar si un color necesita texto blanco (colores oscuros)
const needsWhiteText = (colorName) => {
  const darkColors = ['Negro', 'Azul', 'Rojo', 'Verde', 'Morado', 'Café', 'Vino']
  return darkColors.includes(colorName)
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [availableStock, setAvailableStock] = useState(0)
  const [myRating, setMyRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  // Calcular stock disponible según la variante seleccionada
  useEffect(() => {
    if (!product || !selectedSize || !selectedColor) {
      setAvailableStock(product?.stock || 0)
      return
    }

    // Buscar la variante específica
    const variant = product.variants?.find(
      v => v.size === selectedSize && v.color === selectedColor
    )

    setAvailableStock(variant?.stock || 0)
  }, [product, selectedSize, selectedColor])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
        // Seleccionar automáticamente la primera talla y color disponibles
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor)
  }

  const handleWhatsApp = () => {
    const telefono = "573054412261"
    const productUrl = `${window.location.origin}/producto/${id}`
    let mensaje = `Hola, estoy interesado/a en este producto:

*${product.name}*
💰 Precio: $${product.price.toLocaleString('es-CO')}
📦 Cantidad: ${quantity}`
    
    if (selectedSize) {
      mensaje += `\n📏 Talla: ${selectedSize}`
    }
    if (selectedColor) {
      mensaje += `\n🎨 Color: ${selectedColor}`
    }
    
    mensaje += `\n🔗 Ver producto: ${productUrl}\n\n¿Está disponible?`
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
  }

  const submitRating = async () => {
    if (!isAuthenticated) return
    if (!myRating) return
    try {
      setSubmitting(true)
      const data = await addReview(id, { rating: myRating })
      // Actualizar rating promedio y conteo en pantalla
      setProduct(prev => prev ? { ...prev, rating: data.rating, reviewsCount: data.reviewsCount } : prev)
    } catch (e) {
      console.error('Error enviando calificación', e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
        </div>
      </div>
    )
  }

  const gallery = [product.image, ...(product.images || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <nav className="mb-8 text-gray-600">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to={`/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Gallery */}
          <div>
            <div className="w-full rounded-lg shadow-lg overflow-hidden bg-white">
              <img 
                src={(gallery[activeImage]) || '/images/placeholder.jpg'} 
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mt-3">
                {gallery.map((img, idx) => (
                  <button
                    key={img+idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative border rounded overflow-hidden ${activeImage===idx ? 'ring-2 ring-primary' : ''}`}
                  >
                    <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                {product.badge}
              </span>
            )}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, index) => {
                const filled = index < Math.floor(product.rating || 0)
                return (
                  <i
                    key={index}
                    className={`fas fa-star ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                  ></i>
                )
              })}
              <span className="text-gray-600 ml-2">({product.rating?.toFixed?.(1) || 0})</span>
            </div>

            {/* Interactive rating for authenticated users */}
            {isAuthenticated && (
              <div className="mb-6">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMyRating(star)}
                      className="mr-1"
                      aria-label={`Calificar ${star} estrellas`}
                    >
                      <i className={`${myRating >= star ? 'fas' : 'far'} fa-star text-2xl ${myRating >= star ? 'text-yellow-400' : 'text-gray-400'}`}></i>
                    </button>
                  ))}
                  <button
                    onClick={submitRating}
                    disabled={!myRating || submitting}
                    className="ml-3 btn btn-primary btn-sm disabled:opacity-50"
                  >
                    {submitting ? 'Guardando...' : 'Guardar calificación'}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6">
              {Number(product.originalPrice) > 0 && (
                <span className="text-2xl text-gray-400 line-through mr-3">
                  ${Number(product.originalPrice).toLocaleString('es-CO')}
                </span>
              )}
              <span className="text-4xl font-bold text-primary">
                ${product.price.toLocaleString('es-CO')}
              </span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description || 'Producto de alta calidad y diseño exclusivo. Perfecto para cualquier ocasión.'}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Talla</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    // Verificar si hay stock para esta talla en el color seleccionado
                    const hasStock = selectedColor 
                      ? product.variants?.some(v => v.size === size && v.color === selectedColor && v.stock > 0)
                      : product.variants?.some(v => v.size === size && v.stock > 0) || true
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`px-4 py-2 border-2 rounded-md font-medium transition ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-white'
                            : !hasStock
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'border-gray-300 text-gray-700 hover:border-primary'
                        }`}
                      >
                        {size}
                        {!hasStock && <span className="ml-1 text-xs">✗</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Color {selectedColor && <span className="text-sm text-gray-500">({selectedColor})</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const colorHex = colorMap[color] || '#CCCCCC'
                    const isMulticolor = color === 'Multicolor'
                    const textColor = needsWhiteText(color) ? 'text-white' : 'text-gray-800'
                    
                    // Verificar si hay stock para este color en la talla seleccionada
                    const hasStock = selectedSize
                      ? product.variants?.some(v => v.color === color && v.size === selectedSize && v.stock > 0)
                      : product.variants?.some(v => v.color === color && v.stock > 0) || true
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!hasStock}
                        className={`px-4 py-2 border-2 rounded-md font-medium transition capitalize relative overflow-hidden ${
                          selectedColor === color
                            ? 'border-gray-800 shadow-lg scale-105'
                            : !hasStock
                            ? 'opacity-40 cursor-not-allowed'
                            : 'border-gray-300 hover:border-gray-500'
                        } ${textColor}`}
                        style={{
                          background: !hasStock ? '#E5E7EB' : (isMulticolor ? colorHex : colorHex),
                        }}
                      >
                        {selectedColor === color && (
                          <i className="fas fa-check absolute top-1 right-1 text-xs"></i>
                        )}
                        {!hasStock && (
                          <i className="fas fa-ban absolute top-1 right-1 text-xs text-red-600"></i>
                        )}
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium">Cantidad</label>
                {selectedSize && selectedColor && (
                  <span className={`text-sm font-medium ${
                    availableStock > 10 ? 'text-green-600' : 
                    availableStock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {availableStock > 0 ? `${availableStock} disponibles` : 'Sin stock'}
                  </span>
                )}
              </div>
              <div className="flex items-center border border-gray-300 rounded-md w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock || 999, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={availableStock === 0 || (selectedSize && selectedColor && quantity > availableStock)}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                {availableStock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
              <button 
                onClick={handleWhatsApp}
                className="w-full btn bg-green-500 text-white hover:bg-green-600"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Comprar por WhatsApp
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Detalles del Producto</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-primary hover:text-secondary flex items-center text-sm font-medium"
                >
                  <i className="fas fa-ruler mr-2"></i>
                  Guía de Tallas
                </button>
              </div>
              
              {/* Información básica */}
              <ul className="space-y-2 text-gray-700 mb-6">
                <li><strong>Categoría:</strong> <span className="capitalize">{product.category}</span></li>
                {selectedSize && selectedColor && (
                  <li>
                    <strong>SKU:</strong>{' '}
                    {product.variants?.find(v => v.size === selectedSize && v.color === selectedColor)?.sku || 'N/A'}
                  </li>
                )}
                <li>
                  <strong>Disponibilidad:</strong>{' '}
                  <span className={availableStock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {availableStock > 0 ? 'En stock' : 'Agotado'}
                  </span>
                </li>
              </ul>

              {/* Detalles adicionales */}
              {product.details && (
                <div className="space-y-4 border-t pt-4">
                  {product.details.materials && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                        <i className="fas fa-layer-group mr-2 text-primary"></i>
                        Materiales
                      </h4>
                      <p className="text-gray-700">{product.details.materials}</p>
                    </div>
                  )}
                  
                  {product.details.care && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                        <i className="fas fa-hand-sparkles mr-2 text-primary"></i>
                        Cuidados
                      </h4>
                      <p className="text-gray-700">{product.details.care}</p>
                    </div>
                  )}
                  
                  {product.details.features && product.details.features.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                        <i className="fas fa-star mr-2 text-primary"></i>
                        Características
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {product.details.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.details.fit && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                        <i className="fas fa-user-check mr-2 text-primary"></i>
                        Ajuste
                      </h4>
                      <p className="text-gray-700">{product.details.fit}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Size Guide Modal */}
        <SizeGuide
          category={product.category}
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
        />
      </div>
    </div>
  )
}

export default ProductDetail
