const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/573054412261" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contactar por WhatsApp"
    >
      <i className="fab fa-whatsapp text-3xl"></i>
    </a>
  )
}

export default WhatsAppButton
