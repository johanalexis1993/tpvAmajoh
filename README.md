AMAJOH TPV – Sistema de Punto de Venta (Full-Stack)
AMAJOH TPV es un sistema completo de gestión para restaurantes y pequeños negocios.
Incluye módulos de inventario, menú, pedidos, reservas, clientes, empleados, mermas, escandallos y reportes, con foco en rendimiento, modularidad y seguridad.

🚀 Características principales
Frontend:

HTML5 semántico y accesible
CSS modular con @layer y clamp() para diseño responsive
JavaScript ES6+ con SPA (hash routing)
Animaciones y tareas no críticas con requestIdleCallback
Tablas/listas dinámicas, gráficos interactivos y notificaciones sonoras
Backend:

Node.js + Express + MongoDB/Mongoose
Autenticación con JWT y cookies httpOnly
Middlewares y validaciones robustas
Generación de PDFs (migrando al backend)
Infraestructura:

Vite (build optimizado y code-splitting)
CSP estricta (con Helmet y \_headers)
robots.txt y sitemap.xml para SEO
⚡ Puesta en marcha
Requisitos
Node.js ≥ 18
MongoDB (local o Atlas)
Backend
bash git clone cd servidorTPV npm i npm run dev Variables necesarias en .env:

ini Copiar código PORT=3000 DB_URL=mongodb+srv://... JWT_SECRET=... Frontend bash Copiar código git clone cd amajoh-tpv npm i npm run dev Variables necesarias en .env:

bash Copiar código VITE_API_BASE_URL=http://localhost:3000/api/ 📖 Documentación técnica La documentación completa de arquitectura, endpoints, seguridad (CSP, cookies httpOnly), estado en cliente, errores/notificaciones, rendimiento y roadmap se encuentra en: 👉 DOC_TECNICO.md

👨‍💻 Autor Johan Alexis – Desarrollador Full-Stack Enfoque en arquitectura, rendimiento y seguridad. Aprendizaje continuo.
