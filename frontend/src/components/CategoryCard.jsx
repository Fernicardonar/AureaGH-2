import { Link } from 'react-router-dom'

const CategoryCard = ({ image, title, link }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img 
        src={image} 
        alt={title}
        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white text-2xl font-bold mb-3">{title}</h3>
        <Link 
          to={link} 
          className="btn btn-outline border-white text-white hover:bg-white hover:text-primary w-max"
        >
          Ver productos
        </Link>
      </div>
    </div>
  )
}

export default CategoryCard
