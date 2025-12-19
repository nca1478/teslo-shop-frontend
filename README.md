# Descripción

Tienda E-commerce desarrollada en Next.js 15 y Tailwind.

Frontend que consume una API REST desarrollada en NestJS con sistema de autenticación personalizado basado en JWT.

# Ejecutar en DEV

1. Clonar el repositorio.
2. Crear una copia del `.env.template` y renombrar a `.env`.
3. Configurar las variables de entorno (URL del backend, PayPal, Cloudinary).
4. Instalar las dependencias `npm install`.
5. Asegurarse de que el backend NestJS esté corriendo.
6. Correr el proyecto `npm run dev`.

# Ejecutar en PROD

1. Configurar las variables de entorno de producción.
2. Instalar las dependencias `npm install`.
3. Crear el build `npm run build`.
4. Correr el proyecto `npm start`.

# Arquitectura

-   **Frontend**: Next.js 15 con App Router
-   **Autenticación**: Sistema personalizado con JWT (sin NextAuth)
-   **Estado**: Zustand para manejo de estado global
-   **Estilos**: Tailwind CSS
-   **Comunicación**: Servicios HTTP que consumen API REST

# Características

-   ✅ Autenticación y autorización personalizada
-   ✅ Gestión de productos con imágenes (Cloudinary)
-   ✅ Carrito de compras
-   ✅ Procesamiento de órdenes
-   ✅ Integración con PayPal
-   ✅ Panel de administración
-   ✅ Middleware de protección de rutas
-   ✅ Sistema de sesiones con cookies seguras

# Notas

-   Este frontend se comunica exclusivamente con el backend NestJS a través de servicios HTTP.
-   No requiere base de datos local, toda la lógica de datos está en el backend.
-   La autenticación se maneja con JWT tokens almacenados en cookies seguras.
-   Asegúrate de que el backend esté corriendo antes de iniciar el frontend.
