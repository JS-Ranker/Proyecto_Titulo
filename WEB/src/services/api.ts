import axios from 'axios';

// URL del backend. En producción se define VITE_API_URL (ver .env.example); en local apunta a localhost.
export const API_BASE: string = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

/** URL pública de un archivo subido al backend (imágenes, adjuntos). Acepta rutas "uploads/..." o URLs absolutas. */
export const urlArchivo = (ruta?: string | null): string => {
  if (!ruta) return '';
  if (/^https?:\/\//.test(ruta)) return ruta;
  return `${API_BASE}/${ruta.replace(/^\/+/, '')}`;
};

// --- Token de sesión ---
const TOKEN_KEY = 'happypet_token';

export const guardarToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const obtenerToken = () => localStorage.getItem(TOKEN_KEY);
export const borrarToken = () => localStorage.removeItem(TOKEN_KEY);

/** Cabecera Authorization para las llamadas que usan fetch en lugar de axios. */
export const cabeceraAuth = (): Record<string, string> => {
  const token = obtenerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Todas las llamadas de axios al backend llevan el token automáticamente.
axios.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token && config.url?.startsWith(API_BASE)) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Si el backend rechaza la sesión (token expirado o inválido), se cierra y se vuelve al inicio de sesión.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && obtenerToken() && !error.config?.url?.includes('/login')) {
      borrarToken();
      localStorage.removeItem('happypet_user');
      localStorage.removeItem('happypet_veterinario');
      localStorage.removeItem('currentUser');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);
