# AMAJOH TPV – Sistema de Punto de Venta

## 1. Visión general
AMAJOH TPV es un sistema de punto de venta (POS) para hostelería y pequeños negocios.  
Combina un **frontend estático con Vite** y un **backend Node.js/Express con MongoDB (Mongoose)**.  
Integra **almacenamiento en memoria e IndexedDB** para caché en el cliente y una **API REST segura con JWT y control de roles**.

## 2. Arquitectura
### 2.1 Frontend (`amajoh-pos`)
- **Tooling:** Vite (ESM), target ES2020, múltiples entradas (`index.html`, `register.html`, `pos.html`).
- **Alias:** `@ → src/` (configurado en `vite.config.js`).
- **Scripts:** `dev`, `build`, `start`, `type-check`.
- **Variables:** `VITE_API_BASE_URL` define el backend.

**Estructura principal**
- `src/JavaScript/api/`: peticiones HTTP centralizadas (GET, POST, PUT, DELETE, `requestHandler.js`).
- `routesAndEvents/`: handlers para eventos del DOM que disparan rutas/endpoints, usando nombres autoexplicativos. Los endpoints viven junto a la lógica donde realmente se usan, evitando archivos/carpeta de configuración globales.
- `helpers/`: utilidades y control de autenticación (`checkAuth.js`, `showToast.js`, `renderChart.js`).
- `logic/`: manipulación de UI tras operaciones CRUD.
- `storage/`:
  - `memory/`: implementa una **in-memory store** con interfaz `KVStore` basada en `Map`.
  - `idb/`: persistencia en **IndexedDB** con TTL, `batchSet`, `update`, y sincronización mediante eventos.
  - `core/events.ts`: aplica el **patrón observador**, usando `emitUpdate(key, value)` y `sub(key, fn)` con `CustomEvent` para notificar cambios reactivos entre módulos.
- `helpers/checkAuth.js`: valida sesión llamando a `${VITE_API_BASE_URL}/users/me`.

### 2.2 Backend (`servidor2`)
- Node.js + Express, Mongoose, Helmet, CORS, Compression.
- Autenticación JWT (1 año) en cookies HttpOnly (`__Host-auth`) o header `Authorization`.
- Middlewares: `auth.js`, `setupCors.js`, `security.js`, `errHandler.js`.
- Despliegue en Vercel (`vercel.json`).
- Rutas bajo `/api/v1`.

## 3. Instalación y ejecución
### Frontend
```bash
cd amajoh-pos
npm i
npm run dev
# o
npm run build && npm start
```
`.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend
```bash
cd servidor2
npm i
npm run dev
# o
npm start
```
`.env` mínimo:
```bash
NODE_ENV=development
DB_URL=mongodb://:@/
JWT_SECRET=
BACKEND_DEV=http://localhost:3000
FRONTEND_DEV=http://localhost:5173
```

## 4. API REST
**Prefijo:** `/api/v1`  
**Roles:** `Admin`, `Worker`.  
**Autenticación:** JWT vía cookie o Bearer.

| Módulo | Endpoints principales |
|---------|------------------------|
| **Usuarios** | `/users/register`, `/users/login`, `/users/logout`, `/users/me`, CRUD `/users/:id` |
| **Productos** | `/productos/`, `/productos/ProductByPrice/:precio`, `/productos/ProductByText/:producto`, `/productos/list` |
| **Platos** | `/plate/`, `/plate/title/:title`, `/plate/precio/:precio`, `/plate/:id`, `/plate/:plateId/ingredient/:productId` |
| **Pedidos** | `/pedidos/`, `/pedidos/salesHistory`, `/pedidos/salesBySource`, `/pedidos/:id`, `/pedidos/:orderId/product/:productId` |
| **Reservas** | `/reservation/`, `/reservation/telephonReservation/:telephon`, `/reservation/nameReservation/:name` |
| **Mermas** | `/wasteControl/` CRUD |
| **SSE** | `/sse/orders` — stream de pedidos |

## 5. Seguridad y middleware
- `helmet` con CSP estricta (solo Cloudinary y orígenes propios).
- `CORS` restringido a dominios permitidos, con `credentials: true`.
- `compression` y bypass para SSE.
- `errHandler` captura y formatea errores globalmente.

## 6. Almacenamiento y caché
- **Store en memoria:** `Map` accesible vía `get/put/delete/iterate/clear`.
- **IndexedDB:** persistencia local con expiración (`ttl`) y eventos reactivos (`emitUpdate`).
- **Patrón observador:** `sub()` permite que módulos o vistas escuchen actualizaciones sin polling.
- Estrategia recomendada: *read-through cache* (consulta primero IDB, luego API).

## 7. PWA
Pendiente integrar `vite-plugin-pwa`, `manifest.webmanifest` y `service-worker` con `workbox` para caching selectivo.

## 8. CI/CD y despliegue
- Backend: `vercel.json` con `@vercel/node`.
- Frontend: sin workflow definido.  
  Recomendado usar GitHub Actions (build + lint + test + deploy).

## 9. Variables de entorno
Frontend: `VITE_API_BASE_URL`  
Backend: `DB_URL`, `JWT_SECRET`, `NODE_ENV`, `BACKEND_DEV|PROD`, `FRONTEND_DEV|PROD`

## 10. Pruebas locales
Backend  
```bash
cd servidor2  
npm run dev
```
Frontend  
```bash
cd amajoh-pos  
npm run dev
```
Abrir `http://localhost:5173`  
Probar login, pedidos y sincronización SSE.

## 11. Limitaciones actuales
- Sin PWA ni tests automáticos.
- No hay CI/CD activo.
- **Configuración modular:** Cada módulo mantiene su propia configuración en el contexto donde se utiliza; no hay duplicidades como `src/config` vs `src/api/config`. La estructuración descriptiva y local facilita encontrar la configuración necesaria sin buscar en carpetas globales. El objetivo es que la configuración sea intuitiva tanto para el cliente como para el desarrollador, evitando estructuras grandes o dispersas que solo hacen perder tiempo.

## 12. Mantenimiento
- Modularidad alta en frontend y backend.
- Recomendado: mayor granularidad y responsabilidad si se migra a POO/librería.
- Añadir validación de datos y logs estructurados.
- Extender el patrón observador a `BroadcastChannel` para sincronizar entre pestañas.
