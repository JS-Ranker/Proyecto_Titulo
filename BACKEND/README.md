# Happy Pet · API

API REST de Happy Pet (Express 5 + MySQL 8). La descripción general, la instalación y las variables de entorno están en el [README principal](../README.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia la API con recarga automática (nodemon) en `http://localhost:3000` |
| `npm start` | Inicia la API sin recarga |
| `npm run db:cargar` | Muestra a qué base se conecta y cuántas tablas tiene. Con `-- --confirmar` crea las tablas y carga los datos demo, solo si la base está vacía |
| `npm run db:hashear-passwords` | Cuenta las contraseñas en texto plano. Con `-- --confirmar` las convierte a bcrypt (es irreversible: respalda la base antes) |

## Estructura

```
BACKEND/
├── db/
│   ├── schema.sql        # Tablas
│   └── seed.sql          # Datos demo ficticios (contraseña demo1234)
├── public/uploads/       # Imágenes de ejemplo; en local también las subidas nuevas
├── scripts/              # cargar-base.js, hashear-passwords.js
└── src/
    ├── index.js          # Arranque en local (app.listen)
    ├── app.js            # App de Express (Vercel la usa como función)
    ├── auth/tokens.js    # JWT y bcrypt
    ├── config/           # env.js (variables), db.js (pool MySQL), uploads.js (disco o Vercel Blob)
    ├── middlewares/      # auth.js (token y rol), propiedad.js (acceso a mascotas, citas e historial)
    ├── routes/           # Rutas y sus permisos
    ├── controllers/      # Validación y respuestas
    ├── models/           # Consultas SQL parametrizadas
    └── utils/
```

Los permisos de cada ruta se declaran en `src/routes/*.routes.js`, mediante los middlewares de `src/middlewares/`.
