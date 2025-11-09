import { useState } from 'react'

const SizeGuide = ({ category = 'mujer', isOpen, onClose }) => {
  if (!isOpen) return null

  const sizeData = {
    mujer: {
      title: 'Guía de Tallas - Mujer',
      tables: [
        {
          title: 'Ropa',
          headers: ['Talla COL', 'USA', 'EUR', 'Busto (cm)', 'Cintura (cm)', 'Cadera (cm)'],
          rows: [
            ['XS', '2', '32', '78-82', '60-64', '86-90'],
            ['S', '4-6', '34-36', '82-86', '64-68', '90-94'],
            ['M', '8-10', '38-40', '86-90', '68-72', '94-98'],
            ['L', '12-14', '42-44', '90-96', '72-78', '98-104'],
            ['XL', '16-18', '46-48', '96-102', '78-84', '104-110'],
            ['XXL', '20', '50', '102-110', '84-92', '110-118']
          ]
        },
        {
          title: 'Calzado',
          headers: ['Talla COL', 'USA', 'EUR', 'CM'],
          rows: [
            ['34', '4', '35', '21.5'],
            ['35', '5', '36', '22.0'],
            ['36', '6', '37', '22.5'],
            ['37', '7', '38', '23.5'],
            ['38', '8', '39', '24.0'],
            ['39', '9', '40', '25.0'],
            ['40', '10', '41', '25.5']
          ]
        }
      ],
      howToMeasure: [
        {
          title: 'Busto',
          description: 'Mide alrededor de la parte más llena del busto, manteniendo la cinta métrica horizontal.',
          image: '📏'
        },
        {
          title: 'Cintura',
          description: 'Mide la parte más estrecha de tu cintura natural, generalmente justo arriba del ombligo.',
          image: '📐'
        },
        {
          title: 'Cadera',
          description: 'Mide alrededor de la parte más ancha de tus caderas y glúteos.',
          image: '📏'
        },
        {
          title: 'Calzado',
          description: 'Coloca el pie sobre una hoja de papel, marca el talón y el dedo más largo, y mide la distancia.',
          image: '👟'
        }
      ]
    },
    hombre: {
      title: 'Guía de Tallas - Hombre',
      tables: [
        {
          title: 'Ropa',
          headers: ['Talla COL', 'USA', 'EUR', 'Pecho (cm)', 'Cintura (cm)', 'Cadera (cm)'],
          rows: [
            ['XS', 'XS', '44', '86-90', '70-74', '90-94'],
            ['S', 'S', '46', '90-94', '74-78', '94-98'],
            ['M', 'M', '48-50', '94-98', '78-82', '98-102'],
            ['L', 'L', '52-54', '98-104', '82-88', '102-108'],
            ['XL', 'XL', '56', '104-110', '88-94', '108-114'],
            ['XXL', 'XXL', '58-60', '110-118', '94-102', '114-122']
          ]
        },
        {
          title: 'Calzado',
          headers: ['Talla COL', 'USA', 'EUR', 'CM'],
          rows: [
            ['38', '6', '39', '24.5'],
            ['39', '7', '40', '25.0'],
            ['40', '8', '41', '26.0'],
            ['41', '9', '42', '26.5'],
            ['42', '10', '43', '27.5'],
            ['43', '11', '44', '28.0'],
            ['44', '12', '45', '29.0']
          ]
        }
      ],
      howToMeasure: [
        {
          title: 'Pecho',
          description: 'Mide alrededor de la parte más ancha del pecho, manteniendo la cinta horizontal bajo las axilas.',
          image: '📏'
        },
        {
          title: 'Cintura',
          description: 'Mide alrededor de tu cintura natural, donde normalmente usarías el pantalón.',
          image: '📐'
        },
        {
          title: 'Cadera',
          description: 'Mide alrededor de la parte más ancha de las caderas.',
          image: '📏'
        },
        {
          title: 'Calzado',
          description: 'Mide tu pie de talón a punta en centímetros. Hazlo al final del día cuando el pie esté más dilatado.',
          image: '👞'
        }
      ]
    },
    accesorios: {
      title: 'Guía de Tallas - Accesorios',
      tables: [
        {
          title: 'Cinturones',
          headers: ['Talla', 'Cintura (cm)', 'Largo Total (cm)'],
          rows: [
            ['S', '70-80', '95'],
            ['M', '80-90', '105'],
            ['L', '90-100', '115'],
            ['XL', '100-110', '125']
          ]
        },
        {
          title: 'Bolsos y Carteras',
          headers: ['Tipo', 'Ancho (cm)', 'Alto (cm)', 'Fondo (cm)'],
          rows: [
            ['Cartera pequeña', '18-20', '10-12', '2-3'],
            ['Cartera mediana', '20-25', '12-15', '3-5'],
            ['Bolso mano', '25-35', '20-30', '8-12'],
            ['Morral', '30-40', '35-45', '12-18']
          ]
        },
        {
          title: 'Otros',
          headers: ['Tipo', 'Talla', 'Medida'],
          rows: [
            ['Gorro', 'Única', '56-58 cm'],
            ['Bufanda', 'Única', '160-180 cm'],
            ['Guantes', 'S', '17-18 cm'],
            ['Guantes', 'M', '19-20 cm'],
            ['Guantes', 'L', '21-22 cm']
          ]
        }
      ],
      howToMeasure: [
        {
          title: 'Cinturón',
          description: 'Mide tu cintura donde normalmente usarías el cinturón. La talla del cinturón debe ser 2-3 cm mayor.',
          image: '📏'
        },
        {
          title: 'Gorro',
          description: 'Mide la circunferencia de tu cabeza, pasando la cinta por encima de las orejas.',
          image: '🎩'
        },
        {
          title: 'Guantes',
          description: 'Mide el contorno de tu mano alrededor de los nudillos, sin incluir el pulgar.',
          image: '🧤'
        }
      ]
    }
  }

  const data = sizeData[category] || sizeData.mujer

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Cerrar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {data.tables.map((table, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{table.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      {table.headers.map((header, i) => (
                        <th key={i} className="px-4 py-3 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Consejos */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Consejos para medir
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Toma las medidas directamente sobre la piel o ropa interior ligera</li>
              <li>• Usa una cinta métrica flexible</li>
              <li>• Mantente en posición relajada y natural</li>
              <li>• Si estás entre dos tallas, elige la talla mayor para mayor comodidad</li>
            </ul>
          </div>

          {/* Cómo medir */}
          {data.howToMeasure && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                <i className="fas fa-ruler-combined mr-2 text-primary"></i>
                Cómo Tomar las Medidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.howToMeasure.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start">
                      <div className="text-3xl mr-3">{item.image}</div>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 text-center">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide
