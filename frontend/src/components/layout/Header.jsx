import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuCloseTimeout = useRef(null)
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Handlers to keep the user menu open briefly when moving the cursor
  const openUserMenu = () => {
    if (userMenuCloseTimeout.current) {
      clearTimeout(userMenuCloseTimeout.current)
      userMenuCloseTimeout.current = null
    }
    setIsUserMenuOpen(true)
  }

  const closeUserMenuWithDelay = () => {
    if (userMenuCloseTimeout.current) {
      clearTimeout(userMenuCloseTimeout.current)
    }
    userMenuCloseTimeout.current = setTimeout(() => {
      setIsUserMenuOpen(false)
      userMenuCloseTimeout.current = null
    }, 300) // delay hide to allow moving from icon to panel
  }

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container-custom">
          <p className="text-center text-sm">Envío GRATIS en compras superiores a $200.000</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/categories/Marca/logo.jpg" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition">Inicio</Link>
            <Link to="/mujer" className="text-gray-700 hover:text-primary transition">Mujer</Link>
            <Link to="/hombre" className="text-gray-700 hover:text-primary transition">Hombre</Link>
            <Link to="/accesorios" className="text-gray-700 hover:text-primary transition">Accesorios</Link>
            <Link to="/destacados" className="text-gray-700 hover:text-primary transition">Destacados</Link>
            <Link to="/promociones" className="text-gray-700 hover:text-primary transition">Promociones</Link>
            <Link to="/contacto" className="text-gray-700 hover:text-primary transition">Contacto</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/products" className="text-gray-700 hover:text-primary transition">
                Admin
              </Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={openUserMenu}
                onMouseLeave={closeUserMenuWithDelay}
              >
                <button
                  type="button"
                  className="flex items-center text-gray-700 hover:text-primary transition"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                >
                  
                  {/* Username next to the icon (hide on very small screens) */}
                  {user?.nombre && (
                    <span className="ml-2 hidden sm:inline text-sm text-gray-700">
                      {user.nombre}
                    </span>
                  )}
                  <i className="fas fa-user text-xl"></i>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary transition">
                <i className="fas fa-user text-xl"></i>
              </Link>
            )}
            
            <Link to="/carrito" className="relative text-gray-700 hover:text-primary transition">
              <i className="fas fa-shopping-cart text-xl"></i>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary transition">Inicio</Link>
              <Link to="/mujer" className="text-gray-700 hover:text-primary transition">Mujer</Link>
              <Link to="/hombre" className="text-gray-700 hover:text-primary transition">Hombre</Link>
              <Link to="/accesorios" className="text-gray-700 hover:text-primary transition">Accesorios</Link>
              <Link to="/destacados" className="text-gray-700 hover:text-primary transition">Destacados</Link>
              <Link to="/promociones" className="text-gray-700 hover:text-primary transition">Promociones</Link>
              <Link to="/contacto" className="text-gray-700 hover:text-primary transition">Contacto</Link>
              {user?.role === 'admin' && (
                <Link to="/admin/products" className="text-gray-700 hover:text-primary transition">Admin</Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
