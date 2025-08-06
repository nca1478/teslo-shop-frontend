# Descripción

Tienda E-commerce desarrollada en Nextjs 15 y Tailwind.

# Ejecutar en DEV

1. Clonar el repositorio.
2. Crear un copia del `.env.template` y renombrar a `.env`.
3. Instalar las dependencias `npm install`.
4. Para el proyecto actual, ejecutar `npm install`.
5. Levantar la base de datos `docker compose up -d`.
6. Correr las migraciones de Prisma `npx prisma migrate dev` y `npx prisma generate`.
7. Ejecutar seed `npm run seed`.
8. Limpiar el localStorage del navegador.
9. Correr el proyecto `npm run dev`.

# Ejecutar en PROD

1. Crear la base de datos `npx prisma migrate deploy`.
2. Ejecutar seed `npm run seed`.
3. Instalar las dependencias `npm install`.
4. Crear el build `npm run build`.
5. Correr el proyecto `npm start`.
