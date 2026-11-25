# Despliegue NovaTech en Render + Neon

## 1. Neon
1. Crea un proyecto PostgreSQL en https://neon.tech.
2. En SQL Editor ejecuta `backend/sql/neon_schema.sql`.
3. Ejecuta `backend/sql/neon_seed.sql`.
4. Copia la cadena de conexión (DATABASE_URL), preferentemente pooled y con SSL.

## 2. GitHub
Sube el contenido de esta carpeta al repositorio. No subas `.env` ni `node_modules`.

## 3. Render
Crea un Web Service conectado al repositorio:
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Plan: el que tengas disponible

Variables de entorno:
- `NODE_ENV` = `production`
- `HOST` = `0.0.0.0`
- `DATABASE_URL` = cadena de Neon completa
- `CORS_ORIGIN` = `*` (la app sirve frontend y API desde el mismo dominio)
- `ADMIN_API_KEY` = una clave larga y aleatoria

Al terminar abre `https://TU-SERVICIO.onrender.com/api/health`. Debe responder `ok: true`, `storage: PostgreSQL` y `database: connected`.

## Notas
El proyecto conserva el frontend, endpoints y modelos. Se incluye una capa de compatibilidad para mantener la interfaz de consultas que usaba MySQL, traduciendo parámetros a PostgreSQL. El esquema y los datos iniciales están separados para ejecutarse desde Neon SQL Editor.
