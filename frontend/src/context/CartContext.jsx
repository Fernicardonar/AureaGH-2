import { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    setCartItems(prevItems => {
      // Buscar si existe el mismo producto con la misma talla y color
      const existingItem = prevItems.find(item => 
        item._id === product._id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      )
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevItems, { ...product, quantity, selectedSize, selectedColor }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
