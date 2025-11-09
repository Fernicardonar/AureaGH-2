import { createContext, useState, useContext, useEffect } from 'react'
import { getAllProducts, getProductsByCategory } from '../services/productService'

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

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getAllProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getProductsByCategory = async (category) => {
    try {
      const data = await getProductsByCategory(category)
      return data
    } catch (err) {
      console.error('Error fetching products by category:', err)
      return []
    }
  }

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductsByCategory
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}
