# 🚀 Guía de Despliegue

## Opciones de Hosting

### Frontend

#### Opción 1: Vercel (Recomendado)
1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Variables de entorno:
   - `VITE_API_URL`: URL de tu backend en producción

#### Opción 2: Netlify
1. Crear cuenta en [Netlify](https://www.netlify.com)
2. Conectar repositorio
3. Configurar:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Variables de entorno en Settings

#### Opción 3: GitHub Pages
```bash
cd frontend
npm run build
# Subir carpeta dist a rama gh-pages
```

### Backend

#### Opción 1: Railway (Recomendado - Gratis)
1. Crear cuenta en [Railway](https://railway.app)
2. Nuevo proyecto → Deploy from GitHub
3. Seleccionar repositorio
4. Variables de entorno:
   - `PORT`, `MONGODB_URI`, `JWT_SECRET`, etc.
5. Start Command: `node src/server.js`

#### Opción 2: Render
1. Crear cuenta en [Render](https://render.com)
2. New → Web Service
3. Conectar repositorio
4. Configurar:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Agregar variables de entorno

#### Opción 3: Heroku
```bash
cd backend
heroku create tu-app-name
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
git push heroku main
```

#### Opción 4: DigitalOcean App Platform
1. Crear cuenta en DigitalOcean
2. Apps → Create App
3. Conectar repositorio
4. Configurar componentes y variables

### Base de Datos

#### MongoDB Atlas (Ya configurado)
- Ya está en la nube
- Connection string en variables de entorno
- Gratis hasta 512MB

## 📋 Checklist Pre-Despliegue

### Backend
- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas accesible (IP whitelisting)
- [ ] CORS configurado con URL del frontend
- [ ] JWT_SECRET seguro (no usar el de desarrollo)
- [ ] EMAIL_USER y EMAIL_PASS configurados
- [ ] NODE_ENV=production

### Frontend
- [ ] VITE_API_URL apunta al backend en producción
- [ ] Build exitoso (`npm run build`)
- [ ] Rutas configuradas correctamente
- [ ] Assets e imágenes optimizadas

## 🔒 Seguridad en Producción

1. **Variables de Entorno**
   - Nunca commitear archivos `.env`
   - Usar variables de entorno del hosting
   - JWT_SECRET debe ser complejo

2. **MongoDB**
   - Limitar IPs permitidas (no usar 0.0.0.0/0 en producción)
   - Usuario con permisos mínimos necesarios

3. **CORS**
   - Configurar solo dominios permitidos
   - No usar `*` en producción

4. **Emails**
   - Usar contraseña de aplicación de Gmail
   - O servicio como SendGrid/Mailgun

## 📊 Monitoreo

### Logs
- Railway/Render: Dashboard integrado
- Vercel: Dashboard → Deployments → Logs

### Performance
- Google PageSpeed Insights
- Lighthouse en Chrome DevTools

### Errores
- Configurar Sentry (opcional)
- Logs de servidor

## 🔄 CI/CD Automático

Con GitHub conectado a Vercel/Railway:
1. Push a `main` → Deploy automático
2. Pull Request → Preview deployment
3. Merge → Deploy a producción

## 🌐 Dominio Personalizado

### Frontend (Vercel)
1. Settings → Domains
2. Agregar dominio
3. Configurar DNS según instrucciones

### Backend (Railway)
1. Settings → Networking
2. Custom Domain
3. Configurar DNS

## ✅ Después del Despliegue

1. **Probar funcionalidades:**
   - Registro/Login
   - Catálogo de productos
   - Carrito
   - Formulario de contacto
   - Newsletter

2. **Verificar:**
   - Links funcionando
   - Imágenes cargando
   - API respondiendo
   - Emails enviándose

3. **Optimizar:**
   - Caché de imágenes
   - Comprimir assets
   - Lazy loading

## 🆘 Troubleshooting

### Error de CORS
```javascript
// backend/src/server.js
app.use(cors({
  origin: ['https://tu-dominio.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
```

### Variables de entorno no funcionan
- Verificar nombres exactos
- Rebuild/Redeploy después de cambios
- En Vite deben empezar con `VITE_`

### MongoDB no conecta
- Verificar connection string
- Revisar IP whitelist en Atlas
- Verificar usuario/contraseña

### Build falla
- Revisar logs de error
- Verificar versiones de Node
- `npm install` limpio

## 📱 URLs de Ejemplo

Después del despliegue:
- Frontend: `https://liliam-boutique.vercel.app`
- Backend: `https://liliam-api.railway.app`
- MongoDB: `cluster.mongodb.net`

## 💡 Tips

1. **Usa el tier gratuito** al inicio
2. **Configura alertas** de uso
3. **Haz backup** de MongoDB regularmente
4. **Documenta** tus URLs de producción
5. **Prueba** antes de lanzar oficialmente

---

¡Tu aplicación está lista para el mundo! 🌍
