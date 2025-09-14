                                                       AMAJOH TPV – Sistema de Punto de Venta (Full-Stack)

AMAJOH TPV es un sistema completo de gestión para restaurantes y pequeños negocios. Cubre inventario, menú, pedidos, reservas, clientes, personal, mermas, escandallos y reportes, con foco en rendimiento, modularidad y reutilización.

                                                                          Características

Frontend:

- HTML5 semántico y accesible.
- CSS modular con @layer y CSS Nesting nativo; responsive con rem y clamp().
- JavaScript ES6+ con SPA hash routing y persistencia en localStorage.
- Animaciones y tareas no críticas con requestAnimationFrame y requestIdleCallback.
- Tablas/listas dinámicas, gráficos en <canvas>, notificaciones sonoras.

Backend:

- Node.js + Express.
- MongoDB/Mongoose.
- Autenticación con JWT + bcrypt.
- Middlewares y validaciones robustas.
- (En migración) generación de PDFs en servidor para mayor seguridad.

Infraestructura / Build:

- Vite (build optimizado y code-splitting).
- Configuración con dotenv.
- SEO: robots.txt y sitemap.xml.
- CSP estricta (p. ej., frame-ancestors 'none') y preconnect a Cloudinary.

Rendimiento:

- Pantallas de login/registro/home típicamente < 1s en hardware medio.
- Reducción de ~386 KiB en recursos estáticos.
- Preparado para web workers y afinado de middleware.

                                                                                            Stack Tecnológico

- Frontend: HTML5, CSS3 (nesting nativo), JavaScript (ES6+), SPA con hash routing.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, dotenv, cors.
- Build/Dev: Vite, Chrome DevTools, requestAnimationFrame, requestIdleCallback, web scraping.
- SEO/Infra: robots.txt, sitemap.xml, CSP.

Arquitectura (front)
public/
CSS/ (base/ layout/ components/ utilities/ main.css)
JavaScript/
api/ (get|post|put|delete|requestHandler)
handlers/ (getHandlers, postHandlers, putHandlers, deleteAndPutHandlers)
logic/
get/ (autocomplete, paintingPlates, processPlatesData, createPlateElement, orderPainting, renderList, updateTables)
post/ (createOrderLocal, renderOrder, updateUIAfterPost)
put/ (paintOrderItem, updateUIAfterPut, ... )
delete/ (updateUIAfterDelete)
helpers/ (checkAuth, delegarEvents, renderChart, checkAndPlaySound, generatePDF\*, functionCheckbox, togglePlateButtons, inputFile, watermark)
POSoperation/ (initApp, sidebar, showSection)

- Nota: generatePDF se migrará al backend.

                                                                             PUESTA EN MARCHA

  Requisitos:

* Node.js ≥ 18
* MongoDB (local o Atlas)

Backend:
1 - Clonar el backend y crear .env:

        PORT=3000
        DB_URL=mongodb+srv://...
        JWT_SECRET=...

2 - Instalar y arrancar:

        npm i
        npm run dev

Frontend:
1 - Clonar el frontend y crear .env:

        VITE_API_BASE_URL=http://localhost:3000/api/

2 - Instalar y arrancar:

        npm i
        npm run dev
        # build: npm run build
        # preview: npm run preview

Seguridad:

- Token en localStorage (transitorio). En producción se recomienda cookie httpOnly + SameSite=Strict desde el backend.
- CSP estricta y sin inline scripts cuando sea posible.
- Rutas protegidas en cliente con checkAuth.

Accesibilidad y UX:

- Semántica HTML, focus states, autocompletado.
- Sustitución de alert/prompt por toasts/modales no bloqueantes (en curso).

Roadmap:

- Mover generación de PDF al backend.
- Reemplazar alert/prompt por sistema de notificaciones (toasts).
- Cancelación de typeahead con AbortController + debounce.
- Tests (p. ej., Vitest) para processPlatesData, updateAmount, etc.
- Cookies httpOnly para JWT en prod.

Autor:

- Johan Alexis — Desarrollador Full-Stack.
- Mentalidad de arquitecto, foco en rendimiento/seguridad y aprendizaje continuo.

├───TPV/
├───public/
│ ├───assets/
│ │ ├───alerjenos/
│ │ └───Orders.pm3
│ ├─CSS/
│ │ ├─ base/
│ │ │ ├─ var.css
│ │ │ ├─ reset-base.css
│ │ │ └─ typography.css
│ │ ├─ layout/
│ │ │ ├─ app-shell.css
│ │ │ ├─ header-footer.css
│ │ │ └─ sidebar.css
│ │ ├─ components/
│ │ │ ├─ forms.css
│ │ │ ├─ buttons.css
│ │ │ ├─ tables.css
│ │ │ └─ media-tooltips.css
│ │ ├─ utilities.css
│ │ └─ main.css
│ ├───JavaScript/
│ │ ├───POSoperation/
│ │ │ ├───initApp.js
│ │ │ ├───sidebar.js
│ │ │ └───showSection.js
│ │ │
│ │ ├───api/
│ │ │ ├───requestHandler.js
│ │ │ ├───gets.js
│ │ │ ├───post.js
│ │ │ ├───put.js
│ │ │ └───delete.js
│ │ │
│ │ ├───events/
│ │ │ ├───getHandlers.js
│ │ │ ├───postHandlers.js
│ │ │ ├───putHandlers.js
│ │ │ └───deleteAndPutHandlers.js
│ │ ├───logic/
│ │ │ ├───delete/
│ │ │ │ └───updateUIAfterDelete.js
│ │ │ ├───get/
│ │ │ │ ├───autocomplete.js
│ │ │ │ ├───orderPainting.js
│ │ │ │ ├───updateTables.js
│ │ │ │ ├───createPlateElement.js
│ │ │ │ ├───paintingPlates.js
│ │ │ │ ├───renderList.js
│ │ │ │ └───processPlatesData.js
│ │ │ ├───post/
│ │ │ │ ├───createOrderLocal.js
│ │ │ │ ├───updateUIAfterPost.js
│ │ │ │ └───renderOrder.js
│ │ │ └───put/
│ │ │ ├───paintOrderItem.js
│ │ │ ├───updateUIAfterPut.js
│ │ │ ├───createOrderElements.js
│ │ │ ├───appendOrderElementsToDom.js
│ │ │ └───createAndConfigureButtons.js
│ │ └───helpers/
│ │ │ ├───checkAndPlaySound.js
│ │ │ ├───togglePlateButtons.js
│ │ │ ├───confirmPassword.js
│ │ │ ├───functionCheckbox.js
│ │ │ ├───generatePDF.js
│ │ │ ├───renderChart.js
│ │ │ ├───delegarEvents.js
│ │ │ ├───checkAuth.js
│ │ │ ├───watermark.js
│ │ │ ├───inputFile.js
│ │ │ └───addIngredient.js
│ │ │───mostrarDocumentacion.js
│ │ └───enviarMensajes.js
│ │───index.html
│ ├───register.html
│ ├───tpv.html
│ │──────sitemap.xml
│ │──────.env
│ └──────robots.txt
│──────_headers
│──────README.md
│──────.gitignore
│──────package.json
│──────package-lock.json
└──────.vite.config.js
