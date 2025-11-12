import { createContext, useState, useContext, useEffect } from 'react'
import { 
  getAllProducts, 
  getProductsByCategory as getProductsByCategoryService,
  getFeaturedProducts as getFeaturedProductsService
} from '../services/productService'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    // Cargar todos los productos y los destacados en paralelo
    Promise.all([fetchProducts(), fetchFeatured()])
      .catch(() => {/* errores ya manejados individualmente */})
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeatured = async () => {
    try {
      const data = await getFeaturedProductsService()
      setFeaturedProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar productos destacados', err)
    }
  }

  // Mantener API clara: función para obtener categoría on-demand (sin sobrescribir import)
  const fetchProductsByCategory = async (category) => {
    try {
      const data = await getProductsByCategoryService(category)
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error('Error fetching products by category:', err)
      return []
    }
  }

  const value = {
    products,
    featuredProducts,
    loading,
    error,
    fetchProducts,
    fetchFeatured,
    getProductsByCategory: fetchProductsByCategory
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}
