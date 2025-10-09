AMAJOH TPV – Documentación Técnica

1ºInstalación y arranque

Requisitos:

- Node.js 22 o superior
- MongoDB Atlas

Backend:

1. Clonar el repositorio.

2. Crear archivo .env con las variables:
   PORT=3000
   DB_URL=mongodb+srv://...
   JWT_SECRET=...
   NODE_ENV=development

3. Instalar dependencias y arrancar:
   npm i
   npm run dev

Frontend:

1. Clonar el repositorio.

2. Crear archivo .env con:
   VITE_API_BASE_URL=http://localhost:3000/api/

3. Instalar dependencias y arrancar:
   npm i
   npm run dev
   build: npm run build
   preview: npm run preview

2º Arquitectura

Frontend (public/):
CSS:

- Modular por capas:
- base/: reset-base.css, var.css, typography.css
- layout/: app-shell.css, header-footer.css, scrollbar.css, sidebar.css
- components/: buttons.css, forms.css, tables.css, media-tooltips.css, toast.css
- utilities.css, main.css

JavaScript:

- api/: llamadas HTTP centralizadas (gets.js, posts.js, puts.js, deletes.js, requestHandler.js, handle.js)
- events/: manejadores por método (getHandlers.js, postHandlers.js, putHandlers.js, deleteAndPutHandlers.js)
- logic/: lógica de UI organizada por operación (get/, post/, put/, delete/)
- helpers/: utilidades (checkAuth.js, renderChart.js, generatePDF.js, showToast.js, delegateEvents.js, togglePlateButtons.js, etc.)
- POSoperation/: inicialización, navegación y streaming (initApp.js, sidebar.js, showSection.js, sseOrders.js)

Backend (src/):

- api/controllers/: lógica de negocio (por ejemplo controllerUsers.js, controllerPedidos.js)
- api/routes/: rutas Express (routeUsers.js, routePedidos.js, etc.)
- middlewares/: seguridad (auth.js, hasAnyRole.js, verifyJwt.js, errHandler.js, setupCors.js)
- config/: configuración (db.js, cloudinary.js, security.js, staticFiles.js)
- utils/: utilidades auxiliares
- index.js: servidor Express con compresión, cookies seguras, Helmet CSP, CORS, estáticos y routers

3º Seguridad

Autenticación:
POST /users/login: genera JWT y lo entrega en cookie **Host-auth (HttpOnly, SameSite=lax, Secure en prod)
GET /users/me: valida token desde cookie y devuelve perfil
Logout: implementado con res.clearCookie('**Host-auth', …)

CSP y cabeceras:
Configuradas con Helmet (src/config/security.js)
contentSecurityPolicy con directivas que bloquean iframes, objetos, scripts externos y solo permiten orígenes seguros y Cloudinary para imágenes.

CORS:
Orígenes permitidos:
Producción: https://tpv-amajoh.netlify.app
Desarrollo: http://localhost:5173
y http://localhost:3000
Cookies con credentials:true

Protección CSRF:
Mitigación implícita gracias a:

- Cookies HttpOnly + SameSite=Lax/Strict + Secure en producción
- CORS restringido
- No se exponen tokens en JS
  No se requiere middleware csurf

Roles (RBAC):
Admin, Worker y User definidos
Middleware hasAnyRole aplicado en rutas sensibles

4º Endpoints principales

Usuarios / Auth:
POST /api/v1/users/register { name, email, pwd } Público { user }
POST /api/v1/users/login { email, pwd } Público { user }, cookie auth
GET /api/v1/users/me — User/Admin { id, name, email, role }
GET /api/v1/users — Admin [ { user }, … ]
PUT /api/v1/users/:id {…} Admin/Worker user actualizado
DELETE /api/v1/users/:id — Admin user eliminado

Estructura extensible para pedidos, menú, reservas, inventario, etc.

5º Estado en cliente

Uso actual: persistencia mínima en localStorage (solo datos temporales)
Flujo principal gestionado mediante módulos de UI y requestHandler.js
Roadmap: implementar store in-memory con suscripción reactiva para trazabilidad global

6º Errores y notificaciones

Actual: sistema central de toasts no bloqueantes (helpers/showToast.js)
alert() y prompt() eliminados completamente
confirm() pendiente de migración a modal accesible personalizado
Futuro: modal universal reutilizable con foco gestionado (aria-modal, role="dialog")

7º Comunicación en tiempo real

Implementado mediante SSE (Server-Sent Events) y MongoDB ChangeStream

Ejemplo backend:
const changeStream = Pedido.watch([], { fullDocument: 'updateLookup' })
changeStream.on('change', async () => await sendOrders())

res.setHeader('Content-Type', 'text/event-stream')
EventSource en el front (sseOrders.js)
Heartbeat cada 30 s para mantener conexión viva
Limpieza de recursos al cerrar la conexión
Flujo completo reactivo: DB → backend → frontend

8º Rendimiento

Bundling: Vite genera un bundle único optimizado
Optimizaciones activas:

- requestIdleCallback para tareas no críticas
- debounce en eventos frecuentes
- Render progresivo de tablas y listas
- Lighthouse 99-100 %
- SSE: actualizaciones en tiempo real sin polling
  Roadmap: Service Worker (offline/cache) y lazy loading selectivo

9º Testing

Pendiente de implementar Vitest o Jest
Cobertura inicial prevista:

- processPlatesData
- updateAmount
- updateUIAfterPost

10º Roadmap inmediato
11º Sustituir confirm() por modal accesible
12º Migrar generatePDF al backend
13º Introducir store in-memory (observer pattern)
14º Añadir test unitarios (Vitest)
15º Integrar CI/CD básico (GitHub Actions)

Autor

Johan Alexis – Desarrollador Full-Stack
Arquitectura modular, enfoque en seguridad, rendimiento y escalabilidad
Comprometido con la mejora continua y el código mantenible
