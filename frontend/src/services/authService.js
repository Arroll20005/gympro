// Importamos axios para hacer peticiones HTTP al backend.

import api from './api';
import axios from 'axios';


// URL base del backend.
// Todas las rutas de autenticación partirán desde aquí.
const API_URL = 'http://127.0.0.1:8000/api';


// =====================================================
// LOGIN
// =====================================================
// Función asincrónica que autentica al usuario.
export const login = async (username, password) => {

  try {

    // Enviamos una petición POST al endpoint JWT login.
    //
    // Normalmente en Django REST + SimpleJWT:
    // POST /api/token/
    //
    // Body enviado:
    // {
    //   username: "...",
    //   password: "..."
    // }
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });



    // El backend responde algo así:
    // {
    //   access: "JWT_ACCESS_TOKEN",
    //   refresh: "JWT_REFRESH_TOKEN"
    // }
    const { access, refresh } = response.data;


    // Guardamos tokens en el navegador.
    //
    // access_token:
    // -> se usa para acceder a endpoints protegidos
    //
    // refresh_token:
    // -> se usa para generar nuevos access tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);


    // Retornamos tokens por si el componente
    // quiere usarlos inmediatamente.
    return { access, refresh };

  } catch (error) {

    // Si login falla (credenciales incorrectas, server error...)
    // reenviamos el error al componente que llamó login().
    throw error;
  }
};
// =====================================================
// LOGOUT
// =====================================================
// Elimina los tokens del navegador.
// El usuario queda "deslogueado" localmente.
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};


// =====================================================
// IS AUTHENTICATED
// =====================================================
// Verifica si existe un token guardado.
// 
// Retorna:
// - true si hay token (usuario "logueado")
// - false si no hay token
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
  // El !! convierte cualquier valor a booleano:
  // - Si hay token: !!token → true
  // - Si no hay token: !!null → false
};


// =====================================================
// GET CURRENT USER
// =====================================================
// Obtiene información del usuario autenticado actual.
//
// Hace petición a: GET /api/users/me/
// Backend retorna datos del usuario (id, username, role, etc.)
export const getCurrentUser = async () => {
  try {
   

    // Petición GET con el token en headers
    const response = await api.get('/users/me/')
    const token = localStorage.getItem('access_token');
    console.log('Token debug in getCurrentUser:', token? 'Token found: YES' : 'Token found: NO');

    // Backend responde algo así:
    // {
    //   id: 1,
    //   username: "cliente1",
    //   email: "...",
    //   role: "CLIENTE",
    //   first_name: "Juan",
    //   ...
    // }
    return response.data;

  } catch (error) {
    // Si falla (token inválido, expirado, etc.)
    throw error;
  }
};