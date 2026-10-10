# Happy Pet · Web

Aplicación web de Happy Pet (React 18 + TypeScript + Vite). La descripción general, la instalación y la demo están en el [README principal](../README.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Verifica los tipos (`tsc`) y genera el sitio en `dist/` |
| `npm run preview` | Sirve `dist/` para revisar la versión compilada |
| `npm run lint` | ESLint |

## Configuración

Copia `.env.example` como `.env.local` y define `VITE_API_URL` con la URL del backend, sin barra final.

## Puntos clave del código

- `src/services/api.ts`: URL de la API, guardado del token y envío automático del encabezado `Authorization` en todas las llamadas (interceptores de axios). Si el token expira, vuelve al inicio de sesión.
- `src/utils/AuthContext.tsx`: sesión del dueño o del veterinario.
- `src/App.tsx`: rutas; las privadas usan `ProtectedRoute` (dueños) y `ProtectedVeterinarioRoute`.
- `src/services/*.ts`: un archivo por recurso de la API.
- `vercel.json`: redirige todas las rutas a `index.html` para que funcionen al recargar.
