import { useState, useEffect } from 'react'
import { getProductsByCategory } from '../services/productService'
import ProductCard from '../components/ProductCard'

const Accesorios = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('accesorios')
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Accesorios</h1>
          <p className="text-gray-600 text-lg">Completa tu look con nuestros accesorios exclusivos</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">No hay accesorios disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Accesorios
