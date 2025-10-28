AMAJOH TPV – Sistema de Punto de Venta

Hola, soy Johan, desarrollador full‑stack y creador de AMAJOH TPV, un sistema completo de gestión para restaurantes y pequeños negocios. El objetivo de este proyecto es ofrecer una solución robusta, modular y segura que cubra todas las necesidades de un punto de venta moderno.

Contenidos

Características principales

Instalación y arranque

Arquitectura del frontend

Arquitectura del backend

Seguridad y roles

Comunicación en tiempo real

Gestión de estado, errores y rendimiento

Testing y roadmap

Mejoras propuestas

Características principales

Gestión integral: inventario, menú, pedidos, reservas, clientes, empleados, mermas, escandallos y reportes.

Frontend SPA: HTML5 semántico, CSS modular con variables y @layer, y JavaScript ES6+ organizado en módulos. Utiliza Vite para desarrollo y build optimizado.

Backend Node.js/Express: API REST con MongoDB/Mongoose estructurada en controladores, rutas y middlewares. Siguiendo principios de clean architecture y modularidad.

Actualización en tiempo real: Server‑Sent Events (SSE) y MongoDB Change Streams para sincronizar pedidos sin recargas.

Seguridad: JWT en cookies HttpOnly (\_\_Host-auth), roles RBAC (Admin, Worker, User), CSP estricta con Helmet, CORS controlado y mitigación CSRF.

Rendimiento: build optimizado con Rollup, code splitting, tree‑shaking, requestIdleCallback, debounce y render progresivo; calificaciones muy altas en Lighthouse.

Instalación y arranque
Requisitos

Node.js v22 o superior.

MongoDB Atlas o instancia local de MongoDB.

Backend (servidorTPV)

Clona el repositorio.

Crea .env con:

PORT=3000
DB_URL=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=development
BACKEND_DEV=http://localhost:3000
FRONTEND_DEV=http://localhost:5173

Instala las dependencias: npm i.

Ejecuta npm run dev para desarrollo (nodemon index.js) o npm start para producción.

Frontend (tpvAmajoh)

Clona el repositorio del cliente.

Crea .env con: VITE_API_BASE_URL=http://localhost:3000/api/ y opcionalmente VITE_DEBUG_API=1 para depurar peticiones.

Instala dependencias: npm i.

Ejecuta npm run dev para iniciar Vite. Usa npm run build para generar la versión optimizada y npm run preview para previsualizar el build.

Arquitectura del frontend

El código del cliente se divide por capas y responsabilidades:

CSS:

base/: reset-base.css (reinicio), var.css (variables CSS), typography.css (tipografías).

layout/: app-shell.css (estructura del shell), header-footer.css, scrollbar.css, sidebar.css.

components/: estilos para buttons.css, forms.css, tables.css, media-tooltips.css, toast.css.

utilities.css y main.css: utilidades globales y estilos generales.

JavaScript:

api/: ficheros gets.js, post.js, put.js, delete.js, requestHandler.js y handle.js centralizan las peticiones HTTP, gestionan cabeceras, errores, reintentos y muestran toasts en caso de fallo.

events/: manejadores agrupados por verbo (getHandlers.js, postHandlers.js, putHandlers.js, deleteAndPutHandlers.js) que delegan la lógica específica a la carpeta logic/.

logic/: contiene subcarpetas por operación:

delete/: updateUIAfterDelete.js.

get/: autocomplete.js, orderPainting.js, updateTables.js, createPlateElement.js, paintingPlates.js, renderList.js, processPlatesData.js.

post/: createOrderLocal.js, updateUIAfterPost.js, renderOrder.js.

put/: paintOrderItem.js, updateUIAfterPut.js, createOrderElements.js, appendOrderElementsToDom.js, createAndConfigureButtons.js.

helpers/: utilidades generales como showToast.js, checkAndPlaySound.js, togglePlateButtons.js, confirmPassword.js, bindCheckboxGroup.js, generatePDF.js, renderChart.js, delegateEvents.js, checkAuth.js, watermark.js, inputFile.js, addIngredient.js.

app/: control de la aplicación POS (inicialización con initApp.js, navegación con sidebar.js, cambio de secciones con showSection.js y streaming con sseOrders.js).

HTMLs: las vistas están en index.html (login), register.html y pos.html.

El diseño modular y el uso de ESM permiten que la build aproveche tree‑shaking para eliminar código muerto. El roadmap incluye extraer los componentes principales en una mini‑librería treeshakeable reutilizable en otros proyectos.

Arquitectura del backend

El servidor Express está organizado de forma clara:

Controladores (api/controllers/): gestionan la lógica de negocio. Ejemplos:

contollerUsers.js: registro (asigna roles en función de los datos suministrados), login (verifica contraseña con bcrypt y genera JWT), obtención y actualización de usuarios.

controllerOrders.js, contollerProducts.js, controllersDeEstadisticas.js, etc. manejan otras entidades.

Rutas (api/routes/): definen los endpoints (mainRouters.js, routeUsers.js, routeOrders.js, routesPlates.js, routeReservation.js, etc.) y aplican middlewares de autenticación/autorización según corresponda.

Modelos (api/models/): esquemas Mongoose para usuarios (modelUsers.js), pedidos (modelOrders.js), platos (modelPlates.js), productos (modelProducts.js), reservas (modelReservation.js), mermas (modelWastage.js).

Middlewares (src/middlewares/):

auth.js y hasAnyRole.js para validar JWT y roles.

errHandler.js para gestionar errores globales.

setupCors.js y security.js para configurar CORS y CSP con Helmet.

multerNone.js, file.js para subida de ficheros, notCompressionSSE.js para no comprimir eventos SSE.

Config (src/config/):

db.js se conecta a MongoDB.

envConfig.js determina si el entorno es producción o desarrollo y selecciona URLs.

staticFiles.js sirve archivos estáticos con cabeceras de caché dependiendo del entorno.

Utils (src/utils/): funciones auxiliares (cloudinary.js para imágenes, deleteFile.js, jwt.js para generar/verificar tokens, handleErr.js).

El archivo index.js monta el servidor Express: configura trust proxy, aplica middlewares globales, define los orígenes CORS permitidos (Netlify en producción, localhost:5173 y localhost:3000 en desarrollo), carga los routers, sirve archivos estáticos y aplica el manejador de errores.

Seguridad y roles

Autenticación: se realiza con JWT almacenado en cookie HttpOnly. El login (POST /api/v1/users/login) devuelve el token; GET /api/v1/users/me devuelve el perfil del usuario autenticado. También existen rutas para registrar (/api/v1/users/register), listar todos (/api/v1/users) y gestionar usuarios (/api/v1/users/:id) solo accesibles según rol.

Roles (RBAC): Admin, Worker y User. El middleware hasAnyRole protege rutas sensibles. Los roles se asignan automáticamente al registrar dependiendo de los datos suministrados (p. ej. clientes con tarjeta de crédito se registran como Cliente).

CSP y CORS: Helmet establece directivas estrictas (bloquea iframes, objetos y scripts externos; limita img-src a orígenes seguros y Cloudinary). CORS solo permite orígenes de confianza y las cookies se envían con credentials: true.

Protección CSRF: se basa en cookies HttpOnly con SameSite=Lax/Strict y en el control de orígenes; no se exponen tokens en JS, por lo que no se requiere csurf.

Manejo de errores: un manejador central (errHandler.js) captura excepciones y devuelve respuestas consistentes. Se recomienda introducir una clase ApiError para estandarizar los errores y ocultar detalles sensibles en producción.

Comunicación en tiempo real

Se implementa un sistema reactivo basado en SSE:

En el backend se abre un MongoDB Change Stream para la colección de pedidos y se envían eventos a los clientes cuando se insertan o actualizan documentos.

Los clientes se suscriben mediante EventSource en sseOrders.js y actualizan la UI sin recargar la página. Un heartbeat cada 30 s mantiene la conexión activa.

Es importante cerrar la conexión y limpiar los observadores cuando la vista no se necesita para evitar fugas de memoria.

Gestión de estado, errores y rendimiento

Estado en cliente: actualmente se usa localStorage solo para datos temporales. Se planea implementar una store in‑memory con patrón observador para centralizar el estado y notificar cambios de forma reactiva.

Errores y notificaciones: la UI muestra toasts no bloqueantes (helpers/showToast.js). alert() y prompt() están eliminados; se prevé sustituir confirm() por un modal accesible reutilizable con aria-modal y role="dialog".

Optimización de rendimiento: se utilizan requestIdleCallback para tareas no críticas, debounce para eventos frecuentes y renderizado progresivo de tablas/listas. La build con Rollup optimiza el bundle con minificación, hashing y tree‑shaking. Está en el roadmap añadir lazy loading y un Service Worker para caché offline y conversión a PWA.

Testing y roadmap

Tests: aún no hay tests automatizados. Se planea usar Vitest o Jest para unit tests de módulos críticos (como processPlatesData, updateAmount, updateUIAfterPost) y supertest para pruebas de API.

CI/CD: se proyecta integrar un pipeline básico con GitHub Actions para ejecutar tests, ESLint/Prettier y despliegues automáticos.

Tareas inmediatas:

Sustituir confirm() por un modal accesible.

Migrar generatePDF.js al backend (usando pdfkit o puppeteer) para generar tickets/recibos de forma segura.

Implementar la store in‑memory con patrón observador.

Añadir los primeros test unitarios.

Configurar CI/CD y despliegue con Netlify/Vercel.

Mejoras propuestas

Además del roadmap original, considero importantes las siguientes acciones:

Escalar a microservicios: separar dominios (usuarios, pedidos, productos…) en servicios independientes con comunicación mediante eventos o API; así se puede escalar cada módulo por separado.

Capa de dominio independiente: extraer la lógica de negocio de los controladores a casos de uso/servicios para cumplir mejor con clean architecture y facilitar tests.

Validación de datos robusta: integrar librerías como Joi o Zod para validar entradas de forma declarativa y centralizar las reglas.

Rotación de tokens y CSRF reforzado: reducir la duración del JWT (p. ej. 7–30 días), añadir refresh tokens y considerar tokens anti‑CSRF (double‑submit cookie) si se integran formularios sensibles.

Accesibilidad e internacionalización: asegurar roles dialog en modales, contrastes adecuados, foco visible y permitir desactivar sonidos; planificar soporte multilingüe con i18next.

Observabilidad: añadir logs estructurados, métricas (Prometheus/Grafana) y health checks para monitorizar la aplicación en producción.

Conclusión

AMAJOH TPV es una plataforma POS moderna que combina una arquitectura modular, un pipeline de desarrollo avanzado y actualizaciones en tiempo real. Con las mejoras propuestas (PWA, mini‑librería, separación de dominios, validación formal, tests y CI/CD) el proyecto estará preparado para crecer, ser mantenible y adaptarse a nuevas necesidades. ¡Gracias por interesarte y espero que te animes a contribuir!
