# 🎨 Frontend - Áurea Virtual Shop

Frontend moderno desarrollado con React + Vite + Tailwind CSS

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

## 📦 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build de producción

## 🏗️ Estructura

```
src/
├── components/        # Componentes reutilizables
│   ├── layout/       # Header, Footer, Layout
│   ├── ProductCard.jsx
│   ├── CategoryCard.jsx
│   ├── WhatsAppButton.jsx
│   └── PrivateRoute.jsx
├── context/          # Context API
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ProductContext.jsx
├── pages/            # Páginas/Vistas
│   ├── Home.jsx
│   ├── Mujer.jsx
│   ├── Hombre.jsx
│   ├── Accesorios.jsx
│   ├── Destacados.jsx
│   ├── Promociones.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Cart.jsx
│   ├── ProductDetail.jsx
│   └── Dashboard.jsx
├── services/         # Servicios API
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   └── generalService.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Características

- ⚛️ React 18 con Hooks
- 🎨 Tailwind CSS para estilos
- 🧭 React Router para navegación
- 📡 Axios para peticiones HTTP
- 🔐 Autenticación con JWT (rutas protegidas)
- 🛒 Carrito de compras con variantes (talla/color)
- ❤️ Favoritos por usuario
- 🖼️ Galería de imágenes por producto (miniaturas y principal)
- 📏 Guía de tallas con conversión internacional
- 📃 Modal de Términos y Condiciones (Footer y Carrito)
- 🧩 Panel de Administración (CRUD) con:
  - Matriz visual de variantes (Talla × Color) con stock y SKU por variante
  - Gestor de imágenes (agregar, eliminar, reordenar, definir principal)
  - Filtros por estado/categoría, búsqueda por nombre/SKU y ordenamientos
  - Campo SKU de producto como identidad
  - Entradas de tallas y colores con soporte para comas durante tipeo
- � Flujo de WhatsApp con enlace al producto y atributos seleccionados
- �📱 Diseño responsive
- ⚡ Vite para desarrollo rápido

## 🔧 Configuración

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 Catálogo y Seed (referencia)

El panel de administración escribe directamente en la base de datos. Si quieres convertir el estado actual del catálogo en un seed JSON reutilizable (para clonar o resetear entornos), usa los scripts del backend:

```bash
# En backend/
npm run export:products                 # DB → src/seeds/products.json
npm run import:products:overwrite       # JSON → DB (por SKU)
```

Consulta el README del backend para todos los modos (additive/overwrite/reset) y las variantes `seed:from-json`.

## 🧪 Detalles de UX y validaciones

- El precio original (`originalPrice`) puede dejarse vacío (no se fuerza a 0). Se muestra solo si es un número > 0.
- Selección de talla y color deshabilita combinaciones sin stock y muestra stock disponible para la variante.
- El input de tallas y colores permite escribir comas; el valor se consolida al salir del campo o al guardar.
- La imagen principal se toma de `image` o, si está vacío, del primer elemento de `images[]`.

## 📱 Páginas

- **Home** - Página principal con categorías y destacados
- **Mujer/Hombre/Accesorios** - Catálogos por categoría
- **Destacados** - Productos destacados
- **Promociones** - Ofertas especiales
- **Producto** - Detalle de producto
- **Carrito** - Carrito de compras
- **Login/Register** - Autenticación
- **Dashboard** - Panel de usuario (protegido)
- **Contacto** - Formulario de contacto

## 🎨 Componentes Principales

### Context API

- **AuthContext**: Gestión de autenticación
- **CartContext**: Gestión del carrito
- **ProductContext**: Gestión de productos

### Servicios

- **authService**: Login, registro, perfil
- **productService**: CRUD de productos
- **orderService**: Gestión de pedidos
- **generalService**: Newsletter, contacto

## 🔒 Rutas Protegidas

Las rutas que requieren autenticación usan el componente `PrivateRoute`:

```jsx
<Route 
  path="dashboard" 
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } 
/>
```

## 📞 Integración WhatsApp

Botón flotante y funcionalidad de compra por WhatsApp incluida en ProductCard y Cart.

## 📸 Sugerencias de capturas (para documentación/demo)

Incluye screenshots de:
- Home con destacados y tarjetas de producto (sin “0” previo al precio).
- Página de Producto: galería, selector de talla/color, disponibilidad y WhatsApp.
- Carrito: ítems con talla/color y control de cantidad respetando stock.
- Modal Guía de Tallas y Modal Términos y Condiciones.
- Panel Admin: listado con filtros/búsqueda/orden y columnas de SKU.
- Editor de Producto en Admin: gestor de imágenes y matriz de variantes.
- Ejecución de `npm run export:products` y `seed:from-json:*` mostrando resultados en terminal.

---

Desarrollado con ❤️ usando React + Vite
