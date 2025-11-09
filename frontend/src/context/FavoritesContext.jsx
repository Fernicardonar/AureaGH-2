import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { getMyFavorites } from '../services/authService'
import { toggleFavorite as toggleFavoriteApi } from '../services/productService'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setFavorites(new Set())
        setLoaded(true)
        return
      }
      try {
        const data = await getMyFavorites()
        const ids = (data.favorites || []).map(p => (p._id || p))
        setFavorites(new Set(ids))
      } catch (e) {
        // noop
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [isAuthenticated])

  const isFavorite = (productId) => favorites.has(productId)

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) return { success: false, requiresAuth: true }
    try {
      const { favorited, favorites: serverFavs } = await toggleFavoriteApi(productId)
      if (serverFavs) {
        setFavorites(new Set(serverFavs.map(id => id.toString())))
      } else {
        setFavorites(prev => {
          const next = new Set(prev)
          if (favorited) next.add(productId)
          else next.delete(productId)
          return next
        })
      }
      return { success: true }
    } catch (e) {
      return { success: false, error: e.response?.data?.message || 'No se pudo actualizar favorito' }
    }
  }

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite, loaded }), [favorites, loaded])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
