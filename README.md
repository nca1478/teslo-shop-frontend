# Teslo Shop — Frontend

Tienda e-commerce construida con **Next.js 15 (App Router)**, **React 19** y **Tailwind CSS 4**.

Consume la API REST de [teslo-shop-backend](https://github.com/nca1478/teslo-shop-backend) (NestJS) mediante un sistema de autenticación propio basado en **JWT + cookies HTTP-only** (sin NextAuth).

---

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Autenticación y protección de rutas](#autenticación-y-protección-de-rutas)
- [Estado global](#estado-global)
- [Gestión de imágenes](#gestión-de-imágenes)
- [Pagos con PayPal](#pagos-con-paypal)
- [Scripts disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)
- [Solución de problemas](#solución-de-problemas)

---

## Stack tecnológico

| Área              | Tecnología                                     |
| ----------------- | ---------------------------------------------- |
| Framework         | Next.js 15.4 (App Router + Turbopack en dev)   |
| UI                | React 19                                       |
| Estilos           | Tailwind CSS 4 (vía `@tailwindcss/postcss`)    |
| Estado global     | Zustand 5 (con `persist` y `devtools`)         |
| Formularios       | React Hook Form + Zod 4                        |
| Carruseles        | Swiper                                         |
| Iconos            | React Icons                                    |
| Pagos             | `@paypal/react-paypal-js`                      |
| Imágenes          | Cloudinary                                     |
| Lenguaje          | TypeScript 5.8                                 |

---

## Requisitos previos

- **Node.js 18.18+** (recomendado 20+)
- El **backend NestJS corriendo** (por defecto en `http://localhost:3001`) con su base de datos ya migrada y poblada
- Cuentas de **Cloudinary** y **PayPal Sandbox** (opcionales; necesarias para subir imágenes y probar pagos)

---

## Puesta en marcha

```bash
git clone https://github.com/nca1478/teslo-shop-frontend.git
cd teslo-shop-frontend
npm install

cp .env.template .env
# Edita .env con tus credenciales

npm run dev
```

La aplicación queda disponible en **http://localhost:3000**.

> Levanta primero el backend. Sin él, las páginas que cargan datos fallarán, ya que todo el contenido proviene de la API.

### Usuarios de prueba

Los que crea el seed del backend:

| Email             | Contraseña | Rol     | Acceso                        |
| ----------------- | ---------- | ------- | ----------------------------- |
| `admin@teslo.com` | `123456`   | `admin` | Tienda + panel de administración |
| `user@teslo.com`  | `123456`   | `user`  | Tienda                        |

---

## Variables de entorno

| Variable                       | Requerida | Ámbito    | Descripción                                                        |
| ------------------------------ | :-------: | --------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`          |     ✅    | Público   | URL base del backend NestJS, **sin** `/api` (ej. `http://localhost:3001`). |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` |     ❌    | Público   | Client ID de PayPal. Si falta, el checkout se renderiza sin el botón de pago. |
| `PAYPAL_SECRET`                |     ❌    | Servidor  | Secret de PayPal.                                                   |
| `PAYPAL_OAUTH_URL`             |     ❌    | Servidor  | Endpoint OAuth (sandbox: `https://api-m.sandbox.paypal.com/v1/oauth2/token`). |
| `PAYPAL_ORDERS_URL`            |     ❌    | Servidor  | Endpoint de órdenes (sandbox: `https://api.sandbox.paypal.com/v2/checkout/orders`). |
| `CLOUDINARY_URL`               |     ❌    | Servidor  | URL de conexión de Cloudinary (`cloudinary://key:secret@cloud_name`). Necesaria para subir imágenes desde el panel admin. |

```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:3001

NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET=tu_secret
PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token
PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders

CLOUDINARY_URL=cloudinary://key:secret@cloud_name
```

> Las variables con prefijo `NEXT_PUBLIC_` se incrustan en el bundle del navegador: **nunca** pongas secretos ahí. `.env` está en `.gitignore`.

---

## Arquitectura

El frontend no tiene base de datos ni ORM: **toda la persistencia vive en el backend**. La comunicación fluye en capas:

```
Componente / Página (Server o Client Component)
        │
        ▼
Server Action  ("use server", src/actions/)
        │  · valida con Zod        · lee el token de la cookie
        │  · sube imágenes         · revalida rutas con revalidatePath
        ▼
Servicio  (src/lib/services/)
        │  · una clase por recurso, tipada
        ▼
HttpClient  (src/lib/http-client.ts)
        │  · fetch sobre NEXT_PUBLIC_API_URL
        ▼
API REST NestJS
```

**Decisiones clave:**

- **Server Actions como frontera.** Los componentes nunca llaman a la API directamente; invocan Server Actions que se ejecutan en el servidor, donde el token JWT es accesible y nunca se expone al navegador.
- **Servicios tipados por recurso.** `products`, `orders`, `users`, `addresses`, `categories`, `countries`, `payments` y `auth`, cada uno con sus interfaces de request/response exportadas desde `src/lib/services/index.ts`.
- **`HttpClient` centralizado.** Un único punto para la URL base, cabeceras, parseo de errores y respuestas vacías (`204`, body sin contenido).
- **Route Handlers solo para la sesión.** `src/app/api/auth/*` existe para que los Client Components puedan leer, guardar y limpiar la cookie de sesión; el resto de datos no pasa por aquí.

---

## Estructura del proyecto

```
frontend/
├── public/                      # Imágenes y assets estáticos
└── src/
    ├── actions/                 # Server Actions ("use server")
    │   ├── address/             # get / set / delete dirección
    │   ├── auth/                # login, register, logout
    │   ├── category/  country/
    │   ├── order/               # place-order, get-by-id, by-user, paginadas
    │   ├── payments/            # set-transaction-id, paypal-check-payment
    │   ├── product/             # CRUD, paginación, stock, schema Zod
    │   ├── products/            # search-products
    │   └── user/                # perfil, roles, listado paginado
    ├── app/
    │   ├── (shop)/              # Grupo de rutas de la tienda
    │   │   ├── admin/           # Panel de administración (layout con guard de rol)
    │   │   ├── cart/  checkout/  empty/
    │   │   ├── gender/[gender]/  product/[slug]/
    │   │   ├── orders/  profile/  search/
    │   │   └── layout.tsx
    │   ├── api/auth/            # Route Handlers de sesión
    │   ├── auth/                # login y new-account
    │   └── layout.tsx           # Layout raíz + Providers
    ├── components/              # UI reutilizable (ui, product, products,
    │                            # orders, paypal, providers)
    ├── config/                  # fuentes y rutas protegidas
    ├── contexts/AuthContext.tsx # Estado de sesión en cliente
    ├── interfaces/              # Tipos compartidos
    ├── lib/
    │   ├── http-client.ts       # Cliente HTTP
    │   ├── services/            # Un servicio por recurso de la API
    │   └── session.ts           # get / set / clear de cookies de sesión
    ├── store/                   # Stores de Zustand (cart, ui, address, search)
    ├── utils/                   # Formato de moneda y fechas, paginación, sleep
    └── middleware.ts            # Protección de rutas
```

---

## Rutas de la aplicación

### Tienda

| Ruta                 | Descripción                                        |
| -------------------- | -------------------------------------------------- |
| `/`                  | Home con productos paginados.                      |
| `/gender/[gender]`   | Catálogo por género (`men`, `women`, `kids`).      |
| `/product/[slug]`    | Detalle de producto: tallas, cantidad, galería.    |
| `/search`            | Búsqueda de productos.                             |
| `/cart`              | Carrito de compras.                                |
| `/empty`             | Estado de carrito vacío.                           |

### Autenticación

| Ruta                 | Descripción              |
| -------------------- | ------------------------ |
| `/auth/login`        | Inicio de sesión.        |
| `/auth/new-account`  | Registro de usuario.     |

### Área privada 🔒

| Ruta                 | Descripción                                 |
| -------------------- | ------------------------------------------- |
| `/checkout/address`  | Dirección de envío.                         |
| `/checkout`          | Resumen y confirmación del pedido.          |
| `/orders`            | Pedidos del usuario.                        |
| `/orders/[id]`       | Detalle del pedido y pago con PayPal.       |
| `/profile`           | Perfil del usuario.                         |

### Panel de administración 👑

| Ruta                     | Descripción                              |
| ------------------------ | ---------------------------------------- |
| `/admin`                 | Inicio del panel.                        |
| `/admin/products`        | Listado de productos.                    |
| `/admin/product/[slug]`  | Alta y edición de producto (`new` para crear). |
| `/admin/orders`          | Todos los pedidos.                       |
| `/admin/users`           | Gestión de usuarios y roles.             |

### Route Handlers internos

| Endpoint                  | Método | Función                                           |
| ------------------------- | ------ | ------------------------------------------------- |
| `/api/auth/session`       | `GET`  | Devuelve el usuario en sesión (o `null`).         |
| `/api/auth/save-session`  | `POST` | Guarda token y usuario en cookies.                |
| `/api/auth/logout`        | `POST` | Limpia las cookies de sesión.                     |

---

## Autenticación y protección de rutas

### Flujo de sesión

1. El formulario de login invoca la Server Action `authenticate` / `login` (`src/actions/auth/login.ts`).
2. La acción llama a `authService.login()`, que consulta `POST /api/auth/login` del backend.
3. Con la respuesta, `setSession()` escribe dos cookies (`src/lib/session.ts`):

   | Cookie       | Contenido                     |
   | ------------ | ----------------------------- |
   | `auth-token` | JWT emitido por el backend.   |
   | `user-data`  | JSON con id, email, nombre y roles. |

   Ambas son `httpOnly`, `sameSite: lax`, `path: /`, con vigencia de **24 h** y `secure` activo en producción.
4. `AuthContext` consulta `/api/auth/session` para hidratar el estado de sesión en el cliente.
5. En cada Server Action protegida, `getAuthToken()` lee la cookie y añade `Authorization: Bearer <token>` a la petición.

### Dos niveles de protección

- **Middleware** (`src/middleware.ts`) — redirige a `/auth/login` a quien no tenga sesión al entrar en las rutas de `src/config/routes/protected.routes.ts`: `/profile`, `/checkout`, `/checkout/address`, `/orders`.
- **Layout de admin** (`src/app/(shop)/admin/layout.tsx`) — comprueba en el servidor que el usuario tenga rol `admin`; si no, redirige a login. Cubre todo el árbol bajo `/admin`.

> Para proteger una ruta nueva, añádela al array de `protected.routes.ts`.

---

## Estado global

Cuatro stores de Zustand (`src/store/`), reexportados desde `src/store/index.ts`:

| Store              | Responsabilidad                                                       | Persistencia    |
| ------------------ | --------------------------------------------------------------------- | --------------- |
| `useCartStore`     | Carrito: alta por producto+talla, cantidades y totales (subtotal, impuesto del 15 % y total). | `localStorage`  |
| `useAddressStore`  | Dirección de envío durante el checkout.                               | `localStorage`  |
| `useUiStore`       | Apertura y cierre del sidebar.                                        | —               |
| `useSearchStore`   | Término de búsqueda, resultados y paginación.                         | —               |

El carrito distingue las líneas por la combinación **producto + talla**, de modo que el mismo artículo en dos tallas ocupa dos entradas.

---

## Gestión de imágenes

- **Subida:** desde `/admin/product/[slug]`, la Server Action `createUpdateProduct` sube los archivos a Cloudinary con el SDK configurado mediante `CLOUDINARY_URL`, y envía al backend solo las URLs resultantes.
- **Borrado:** `deleteProductImage` elimina la imagen en Cloudinary y en la base de datos.
- **Renderizado:** `next.config.ts` autoriza el dominio remoto `res.cloudinary.com` para `next/image`.
- **Límite de subida:** las Server Actions aceptan hasta **10 MB** por petición (`serverActions.bodySizeLimit`).

---

## Pagos con PayPal

1. En `/orders/[id]`, `PayPalWrapper` renderiza el botón de pago si hay `NEXT_PUBLIC_PAYPAL_CLIENT_ID` configurado.
2. Al crear la orden en PayPal, la acción `setTransactionId` guarda el id de transacción contra el pedido en el backend.
3. Tras la aprobación, `paypalCheckPayment` pide al backend que verifique el pago contra la API de PayPal y marque el pedido como pagado.

El `PayPalScriptProvider` se configura con `intent: capture`, moneda `USD` y locale `es_ES`. Si falta el client ID, la app arranca igualmente y solo se registra un aviso en consola.

---

## Scripts disponibles

| Script          | Descripción                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con Turbopack (puerto 3000).  |
| `npm run build` | Build de producción.                                 |
| `npm start`     | Sirve el build (requiere `build` previo).            |
| `npm run lint`  | ESLint con la configuración de Next.js.              |

---

## Despliegue

1. Configura las variables de entorno en el proveedor (Vercel, etc.), con `NEXT_PUBLIC_API_URL` apuntando al backend **desplegado y accesible por HTTPS**.
2. Compila y arranca:

   ```bash
   npm ci
   npm run build
   npm start
   ```

**Checklist antes de publicar:**

- [ ] `NEXT_PUBLIC_API_URL` sin `/api` al final y sin barra final.
- [ ] En el backend, `FRONTEND_URL` apunta al dominio de este frontend (si no, CORS bloqueará las peticiones).
- [ ] Credenciales de PayPal de **producción**, no de sandbox.
- [ ] `CLOUDINARY_URL` configurada si el panel admin debe subir imágenes.
- [ ] Servido por HTTPS: las cookies de sesión usan `secure: true` en producción.

---

## Solución de problemas

| Síntoma                                                | Causa probable y solución                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Páginas vacías o error `fetch failed`                  | El backend no está corriendo o `NEXT_PUBLIC_API_URL` es incorrecta. Verifica `GET /api/health` del backend.    |
| Error de CORS en el navegador                          | En producción, `FRONTEND_URL` del backend debe coincidir exactamente con el origen del frontend.                |
| El login parece funcionar pero sigues deslogueado      | Las cookies llevan `secure: true` en producción: se requiere HTTPS.                                            |
| Redirección constante a `/auth/login`                  | Sesión expirada (24 h) o cookies borradas. Vuelve a iniciar sesión.                                            |
| `/admin` redirige a login estando autenticado          | El usuario no tiene rol `admin`. Entra con `admin@teslo.com` o cambia el rol desde `/admin/users`.             |
| Las imágenes no cargan                                 | El host debe estar declarado en `images.remotePatterns` de `next.config.ts` (ya incluye `res.cloudinary.com`).  |
| Falla la subida de imágenes                            | `CLOUDINARY_URL` ausente o mal formada, o el archivo supera el límite de 10 MB.                                |
| No aparece el botón de PayPal                          | Falta `NEXT_PUBLIC_PAYPAL_CLIENT_ID`; revisa el aviso en la consola del navegador.                              |
| Cambios en variables `NEXT_PUBLIC_*` sin efecto        | Se incrustan en build time: reinicia `npm run dev` o recompila.                                                 |

---

## Proyectos relacionados

- **Backend:** [teslo-shop-backend](https://github.com/nca1478/teslo-shop-backend) — NestJS 11 + Prisma + PostgreSQL con arquitectura hexagonal.

---

## Notas

- Este frontend se comunica **exclusivamente** con el backend NestJS mediante servicios HTTP; no accede a ninguna base de datos.
- La autenticación es propia (JWT en cookies HTTP-only), sin NextAuth.
- La carpeta `backup/` contiene dumps de la base de datos de referencia y no forma parte del build.
