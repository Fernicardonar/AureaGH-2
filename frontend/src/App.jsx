import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Mujer from './pages/Mujer'
import Hombre from './pages/Hombre'
import Destacados from './pages/Destacados'
import Promociones from './pages/Promociones'
import Accesorios from './pages/Accesorios'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ProductsAdmin from './pages/admin/ProductsAdmin'

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <ProductProvider>
            <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="mujer" element={<Mujer />} />
                <Route path="hombre" element={<Hombre />} />
                <Route path="destacados" element={<Destacados />} />
                <Route path="promociones" element={<Promociones />} />
                <Route path="accesorios" element={<Accesorios />} />
                <Route path="contacto" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="carrito" element={<Cart />} />
                <Route path="producto/:id" element={<ProductDetail />} />
                <Route 
                  path="dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                  <Route 
                    path="admin/products" 
                    element={
                      <AdminRoute>
                        <ProductsAdmin />
                      </AdminRoute>
                    }
                  />
              </Route>
            </Routes>
            </CartProvider>
          </ProductProvider>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
