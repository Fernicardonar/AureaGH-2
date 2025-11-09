import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'

const Home = () => {
  const { products, loading } = useProducts()

  const featuredProducts = products.filter(p => p.featured).slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary to-gray-800 flex items-center">
        <div className="container-custom text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Estilo y Elegancia</h1>
          <p className="text-xl md:text-2xl mb-8">Descubre con nosotros las últimas tendencias en moda</p>
          <Link to="/destacados" className="btn bg-white text-primary hover:bg-gray-100">
            Ver Colección
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Categorías</h2>
            <p className="text-gray-600">Explora nuestras colecciones exclusivas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard 
              image="/images/categories/Mujer/vestido 7.jpg"
              title="Mujer"
              link="/mujer"
            />
            <CategoryCard 
              image="/images/categories/Hombre/BUSO1.jpg"
              title="Hombre"
              link="/hombre"
            />
            <CategoryCard 
              image="/images/categories/Accesorios/Zapatos Hombre.jpg"
              title="Accesorios"
              link="/accesorios"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
            <p className="text-gray-600">Los favoritos de la temporada</p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/destacados" className="btn btn-primary">
              Ver Todos los Destacados
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/images/categories/Marca/logo.jpg" 
                alt="Liliam Boutique"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Sobre Áurea Virtual Shop</h2>
              <p className="text-gray-600 mb-4">
                La tienda virtual Áurea Virtual Shop surge como una evolución natural que busca ofrecer un canal confiable, organizado y eficiente para la venta de productos de moda con sello propio.
              </p>
              <p className="text-gray-600 mb-4">
                
                Su propósito no solo es comercializar prendas y accesorios, también, busca consolidarse como una alternativa digital que se proyecta a ser reconocida como una marca líder en el sector del e-commerce, destacándose por valores como la innovación, la confianza, la calidad y el compromiso.
              </p>
              <p className="text-gray-600 mb-6">
                Áurea Virtual Shop, combina moda y tecnología para ofrecer una experiencia de compra moderna, segura y con proyección de crecimiento hacia el mercado latinoamericano.

              </p>
            </div>
          </div>
        </div>
      </section>     
    </div>
  )
}

export default Home
