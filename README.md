# NovaTech — Proyecto completo con MySQL (ambiente de pruebas)

Este paquete mantiene **el frontend exactamente como estaba** y organiza el backend en módulos para que sea más fácil de mantener y ampliar.

## 1. Estructura

```text
backend/
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── articleController.js
│   ├── authController.js
│   ├── calculatorController.js
│   ├── contactController.js
│   ├── productController.js
│   └── quoteController.js
├── middleware/
│   ├── adminMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── articleModel.js
│   ├── calculatorModel.js
│   ├── contactModel.js
│   ├── productModel.js
│   ├── quoteModel.js
│   └── userModel.js
├── routes/
│   ├── articleRoutes.js
│   ├── authRoutes.js
│   ├── calculatorRoutes.js
│   ├── contactRoutes.js
│   ├── productRoutes.js
│   └── quoteRoutes.js
├── services/
│   ├── authService.js
│   ├── calculatorService.js
│   └── emailService.js
├── sql/
│   ├── 01_schema.sql
│   └── 02_seed.sql
├── utils/
│   ├── http.js
│   └── validation.js
└── server.js
```

## 2. Requisitos

- Node.js LTS
- MySQL 8.x recomendado
- MySQL Workbench opcional

## 3. Crear la base de pruebas

En MySQL Workbench abre y ejecuta primero:

```text
backend/sql/01_schema.sql
```

Después:

```text
backend/sql/02_seed.sql
```

La base se llama `novatech_test`.

## 4. Configurar Node.js

Desde la raíz del proyecto:

```bash
npm install
```

Copia `.env.example` como `.env` y configura tu contraseña:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=novatech_test
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
```

Para administración, cambia también:

```env
ADMIN_API_KEY=una-clave-segura-de-pruebas
```

## 5. Ejecutar

```bash
npm start
```

Abre:

```text
http://localhost:3000
```

No abras `frontend/index.html` con `file:///`, porque la página necesita comunicarse con la API.

## 6. Comprobar MySQL

```text
http://localhost:3000/api/health
```

Debe aparecer `storage: MySQL` y `database: connected`.

## 7. Funciones implementadas

### Catálogo
- Consulta de productos desde MySQL.
- Búsqueda.
- Filtros por categoría.
- Botón **Cotizar**.
- Botón **Ver detalles**.
- CRUD administrativo de productos.

### Cotizador
- Agrega productos.
- Aumenta cantidades.
- Elimina elementos.
- Solicita datos del cliente.
- Guarda cotización y partidas en MySQL.
- Genera folio `NT-AAAA-000001`.

### Simulador
La cantidad de usuarios modifica el precio.

Precios de prueba:

- Oficina: $950 MXN por usuario.
- Desarrollo/Data Analysis: $1,450 MXN por usuario.
- Diseño 3D/Render/IA: $2,300 MXN por usuario.
- Redundancia alta: factor 1.25.

Ejemplo:

```text
25 usuarios × $1,450 = $36,250 MXN
Redundancia alta → $45,312.50 MXN
```

Cada cálculo se guarda en `calculator_requests`.

### Contacto
- Guarda nombre, correo, teléfono, empresa, asunto y mensaje en MySQL.
- Si SMTP está configurado, envía además una notificación por correo.
- Si SMTP no está configurado, el mensaje sigue guardándose correctamente en MySQL.

### Autenticación
- Registro.
- Inicio de sesión.
- Contraseñas almacenadas mediante `scrypt` + salt.

### Artículos
- API de artículos de prueba en MySQL.

## 8. API principal

Públicas:

```text
GET  /api/health
GET  /api/products
GET  /api/products/:id
POST /api/contact
POST /api/calculator
POST /api/quotes
POST /api/auth/register
POST /api/auth/login
GET  /api/articles
GET  /api/articles/:id
```

Administrativas: requieren header `x-admin-key` igual a `ADMIN_API_KEY`.

```text
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/contact
PUT    /api/contact/:id/status
GET    /api/calculator
GET    /api/quotes
GET    /api/quotes/:id
PUT    /api/quotes/:id/status
```

## 9. Precios del simulador

Los precios están centralizados en:

```text
backend/services/calculatorService.js
```

Ahí puedes cambiar los precios de prueba sin tocar el frontend.

## 10. SMTP opcional

Para activar el envío real de correo configura en `.env`:

```env
SMTP_HOST=smtp.tuservidor.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASSWORD=contraseña
SMTP_FROM=contacto@novatech-tech.com
SMTP_TO=contacto@novatech-tech.com
```

En ambiente de pruebas puedes dejar estos valores vacíos: el formulario seguirá guardando en MySQL.
