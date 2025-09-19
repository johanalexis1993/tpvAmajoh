# AMAJOH TPV – Documentación Técnica

## 1. Instalación y arranque

### Requisitos

- Node.js ≥ 18
- MongoDB (local o Atlas)

### Backend

1. Clonar el repositorio.
2. Crear archivo `.env` con:
   PORT=3000
   DB_URL=mongodb+srv://...
   JWT_SECRET=...
   NODE_ENV=development

arduino
Copiar código 3. Instalar dependencias y arrancar:

bash
npm i
npm run dev
Frontend
Clonar el repositorio.

Crear archivo .env con:

bash
Copiar código
VITE_API_BASE_URL=http://localhost:3000/api/
Instalar dependencias y arrancar:

bash
Copiar código
npm i
npm run dev

# build: npm run build

# preview: npm run preview

2. Arquitectura
   Frontend (public/)
   CSS/ → modular por capas (reset-base.css, var.css, typography.css, forms.css, buttons.css, tables.css, media-tooltips.css, app-shell.css, header-footer.css, scrollbar.css, sidebar.css).

JavaScript/

api/ → llamadas HTTP centralizadas (gets, posts, puts, deletes, requestHandler).

events/ → manejadores por método (getHandlers, postHandlers, etc.).

logic/ → lógica de UI organizada por operación (get/post/put/delete).

helpers/ → utilidades (checkAuth, renderChart, generatePDF, etc.).

POSoperation/ → inicialización y navegación (initApp, sidebar, showSection).

Backend (src/)
api/controllers/ → lógica de negocio (ej. controllerUsers.js).

api/routes/ → rutas Express (routeUsers.js, etc.).

middlewares/ → seguridad (auth.js con RBAC, cookies, verifyJwt).

config/ → configuración (db.js, cloudinary.js).

utils/ → utilidades varias.

index.js → servidor Express: compresión, CORS, cookies, Helmet CSP, estáticos y routers.

3. Seguridad
   Autenticación:

POST /users/login: genera JWT, se entrega en cookie httpOnly (auth) con SameSite=lax y Secure en prod.

GET /users/me: valida token de cookie o Bearer y devuelve perfil.

Logout: previsto con res.clearCookie('auth', …).

CSP (configurado con Helmet en index.js):

js
Copiar código
app.use(helmet({
contentSecurityPolicy: {
useDefaults: true,
directives: {
"default-src": ["'self'"],
"img-src": ["'self'", "https://res.cloudinary.com", "data:"],
"script-src": ["'self'"],
"connect-src": ["'self'", "https://tu-api"],
"frame-ancestors": ["'none'"]
}
},
crossOriginEmbedderPolicy: false
}))
CORS: origen restringido (Netlify en producción / localhost en dev), con credentials:true.

Roles (RBAC): Admin, Worker, User. Middleware hasAnyRole aplicado en rutas sensibles.

4. Endpoints principales
   Usuarios / Auth
   Método Ruta Body Roles Respuesta
   POST /api/v1/users/register { name, email, pwd } Público { user }
   POST /api/v1/users/login { email, pwd } Público { user }, cookie auth
   GET /api/v1/users/me — User/Admin { id, name, email, role }
   GET /api/v1/users — Admin [ { user }, … ]
   PUT /api/v1/users/:id {…} Admin/Worker user actualizado
   DELETE /api/v1/users/:id — Admin user eliminado

(Puedes ampliar con endpoints de pedidos, menú, reservas, inventario, etc. en la misma estructura).

5. Estado en cliente
   Uso actual: localStorage (ej: orden temporal).

Roadmap: migrar a store centralizado (Context/observer) para consistencia.

6. Errores y notificaciones
   Actual: alert()/prompt()/confirm() para feedback de usuario.

Roadmap: reemplazo por toasts/modales no bloqueantes centralizados.

7. Rendimiento
   Bundling: Vite produce un solo bundle optimizado en producción.

Optimizaciones aplicadas:

requestIdleCallback para tareas no críticas.

debounce en eventos frecuentes.

Render progresivo en listas largas.

Métricas: Lighthouse ~99.9%.

Roadmap: Service Worker (offline/caching), lazy loading de imágenes.

8. Testing
   Pendiente: usar Vitest/Jest.

Cobertura inicial prevista:

processPlatesData

updateAmount

updateUIAfterPost

9. Roadmap inmediato
   Migrar generatePDF al backend.

Sustituir alert()/prompt()/confirm() por sistema de toasts/modales.

Añadir tests unitarios.

Cookies httpOnly definitivas en prod.

10. Autor
    Johan Alexis – Desarrollador Full-Stack
    Mentalidad de arquitecto, foco en rendimiento/seguridad, aprendizaje continuo.
