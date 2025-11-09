# ❓ Preguntas Frecuentes (FAQ)

## 🔧 Instalación y Configuración

### ¿Cómo obtengo el connection string de MongoDB Atlas?

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Inicia sesión o crea cuenta
3. Crea un cluster (tier gratuito)
4. Ve a "Database" → "Connect"
5. Elige "Connect your application"
6. Copia el connection string
7. Reemplaza `<password>` con tu contraseña
8. Reemplaza `<dbname>` con `liliamboutique`

Ejemplo:
```
mongodb+srv://usuario:password123@cluster0.xxxxx.mongodb.net/liliamboutique?retryWrites=true&w=majority
```

### ¿Cómo genero una contraseña de aplicación de Gmail?

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (actívala)
3. Vuelve a Seguridad → Contraseñas de aplicaciones
4. Selecciona "Correo" y tu dispositivo
5. Copia la contraseña generada (16 caracteres)
6. Úsala en `EMAIL_PASS`

### ¿Qué versión de Node.js necesito?

Node.js v16 o superior. Verifica con:
```bash
node --version
```

### ¿Puedo usar MongoDB local en vez de Atlas?

Sí, instala MongoDB localmente y cambia `MONGODB_URI`:
```env
MONGODB_URI=mongodb://localhost:27017/liliamboutique
```

## 🐛 Errores Comunes

### Error: "Cannot find module 'X'"

```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error: "CORS policy blocked"

Verifica que el backend tenga configurado CORS correctamente:
```javascript
// src/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
```

### Error: "MongoServerError: bad auth"

- Verifica usuario y contraseña en MongoDB Atlas
- Asegúrate de escapar caracteres especiales en la URL
- Verifica que el usuario tenga permisos en la base de datos

### Error: "jwt malformed" o "invalid token"

- El token está corrupto o mal formado
- Cierra sesión y vuelve a iniciar
- Verifica que `JWT_SECRET` sea el mismo en todos los ambientes

### Frontend no carga datos del backend

1. Verifica que el backend esté corriendo (`http://localhost:3001/api`)
2. Verifica `VITE_API_URL` en `.env` del frontend
3. Abre DevTools → Network para ver las peticiones
4. Revisa la consola del navegador

### Error: "Network Error" en Axios

- Backend no está corriendo
- URL incorrecta en `VITE_API_URL`
- Problemas de CORS
- Firewall bloqueando la conexión

## 🔐 Seguridad

### ¿Es seguro el JWT_SECRET que pusiste?

NO. Es solo un ejemplo. Genera uno seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ¿Dónde se almacenan los passwords?

En MongoDB, encriptados con bcrypt (10 rounds de salt). Nunca se almacenan en texto plano.

### ¿El carrito se pierde al cerrar el navegador?

No, se guarda en `localStorage`. Persiste hasta que se limpie el navegador.

### ¿Cómo cambio un usuario a admin?

1. Registra el usuario normalmente
2. Ve a MongoDB Atlas → Collections → users
3. Busca el usuario por email
4. Edita el campo `role` de `"user"` a `"admin"`

## 💳 Pagos y Órdenes

### ¿Tiene integración de pagos?

No por defecto. La aplicación usa WhatsApp para coordinar pagos. Puedes integrar:
- Stripe
- PayPal
- Mercado Pago
- PayU

### ¿Cómo funciona la compra por WhatsApp?

El usuario agrega productos al carrito y hace clic en "Ordenar por WhatsApp". Se abre WhatsApp con un mensaje pre-formateado del pedido.

## 📱 Frontend

### ¿Puedo cambiar los colores del tema?

Sí, edita `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#tu-color-principal',
      secondary: '#tu-color-secundario',
    }
  }
}
```

### ¿Cómo agrego más páginas?

1. Crea componente en `frontend/src/pages/NuevaPagina.jsx`
2. Agrega ruta en `frontend/src/App.jsx`:
```jsx
<Route path="nueva-pagina" element={<NuevaPagina />} />
```
3. Agrega link en Header

### ¿Puedo usar otro framework de CSS?

Sí, puedes remover Tailwind e instalar Bootstrap, Material-UI, etc. Pero tendrás que reescribir los estilos.

## 🔧 Backend

### ¿Cómo agrego un nuevo modelo?

1. Crea `backend-new/src/models/NuevoModelo.model.js`
2. Crea controller en `controllers/`
3. Crea rutas en `routes/`
4. Importa rutas en `server.js`

### ¿Puedo cambiar de MongoDB a PostgreSQL?

Sí, pero requiere trabajo:
- Cambiar Mongoose por Sequelize/TypeORM
- Reescribir todos los modelos
- Ajustar queries
- Configurar PostgreSQL

### ¿Cómo habilito HTTPS en desarrollo?

Vite tiene soporte built-in:
```javascript
// vite.config.js
export default defineConfig({
  server: {
    https: true
  }
})
```

## 🚀 Despliegue

### ¿Cuál es la mejor opción de hosting gratuito?

- **Frontend**: Vercel (recomendado)
- **Backend**: Railway o Render
- **DB**: MongoDB Atlas (ya está en la nube)

### ¿Cuánto cuesta hospearlo?

Con los servicios gratuitos:
- Vercel: Gratis (100GB bandwidth/mes)
- Railway: $5/mes de crédito gratis
- MongoDB Atlas: Gratis (512MB)

### ¿Cómo configuro un dominio personalizado?

En Vercel/Railway:
1. Ve a Settings → Domains
2. Agrega tu dominio
3. Configura DNS según instrucciones
4. Espera propagación (hasta 48h)

## 📊 Datos y Productos

### ¿Cómo agrego productos?

Opción 1 - Manualmente en MongoDB Atlas:
1. Ve a Collections → products
2. Insert Document
3. Llena los campos

Opción 2 - Usando la API (como admin):
```bash
POST /api/products
Authorization: Bearer <admin_token>
{
  "name": "Producto",
  "price": 99900,
  "category": "mujer",
  ...
}
```

### ¿Dónde pongo las imágenes de productos?

Opción 1 - En `frontend/public/images/`
Opción 2 - Servicio de almacenamiento (Cloudinary, AWS S3)
Opción 3 - URL externa

En el producto, guarda la ruta:
```javascript
{
  "image": "/images/productos/vestido.jpg"
}
```

### ¿Cómo importo productos masivamente?

Crea un script seed personalizado o usa una herramienta CSV to JSON.

## 🛠️ Desarrollo

### ¿Puedo usar TypeScript?

Sí, Vite tiene soporte nativo:
```bash
npm install --save-dev typescript @types/react @types/react-dom
```
Renombra `.jsx` a `.tsx` y agrega tipos.

### ¿Hay tests incluidos?

No por defecto, pero puedes agregar:
- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest

### ¿Cómo debuggeo el backend?

1. Agrega breakpoints en VS Code
2. Run → Start Debugging (F5)
3. O usa `console.log()` estratégicamente

## 📞 Soporte

### ¿Dónde reporto bugs?

Abre un issue en el repositorio de GitHub con:
- Descripción del problema
- Pasos para reproducir
- Logs de error
- Versiones (Node, npm, etc.)

### ¿Hay documentación de la API?

Revisa `backend-new/README.md` para todos los endpoints.

Para documentación interactiva, puedes agregar Swagger:
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

¿No encontraste tu pregunta? Revisa:
- `README.md` - Información general
- `GETTING_STARTED.md` - Guía de inicio
- `DEPLOYMENT.md` - Guía de despliegue
- `ARCHITECTURE.md` - Arquitectura del sistema
