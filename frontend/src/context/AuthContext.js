// Importamos React y algunos hooks necesarios
import React, { createContext, useState, useEffect } from 'react';

// Importamos funciones del servicio de autenticación.
// Renombramos login y logout para evitar conflictos de nombres.
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser
} from '../services/authService';


// ======================================================
// CREACIÓN DEL CONTEXTO GLOBAL DE AUTENTICACIÓN
// ======================================================
// Este contexto permitirá compartir información de login
// entre TODOS los componentes de la aplicación.
export const AuthContext = createContext();


// ======================================================
// AUTH PROVIDER
// ======================================================
// Este componente envuelve toda la aplicación y provee
// el estado de autenticación global.
export const AuthProvider = ({ children }) => {

  // Estado donde se guarda el usuario autenticado.
  // null = no hay usuario logueado.
  const [user, setUser] = useState(null);

  // Estado que indica si todavía estamos verificando
  // si el usuario tiene una sesión activa.
  const [loading, setLoading] = useState(true);


  // ==================================================
  // AUTO LOGIN AL RECARGAR LA APP
  // ==================================================
  // Se ejecuta SOLO una vez cuando el Provider se monta.
  useEffect(() => {

    // Revisamos si existe un access token guardado
    const token = localStorage.getItem('access_token');

    // Si existe token, intentamos cargar el usuario
    if (token) {
      loadUser();
    } else {
      // Si no hay token, dejamos de cargar inmediatamente
      setLoading(false);
    }

  }, []); // [] = ejecutar solo al montar


  // ==================================================
  // FUNCIÓN PARA CARGAR USUARIO ACTUAL
  // ==================================================
  // Usa el token almacenado para pedir al backend
  // la información del usuario autenticado.
  const loadUser = async () => {
    console.log('Cargando usuario con token almacenado...', localStorage.getItem('access_token') ? 'Token found: YES' : 'Token found: NO');
    try {

      // Llama al endpoint /users/me/
      const userData = await getCurrentUser();

      // Guardamos usuario en estado global
      setUser(userData);

    } catch (error) {

      // Si ocurre error:
      // - token inválido
      // - token expirado
      // - backend caído
      console.error('Error al cargar usuario:', error);
      console.error(user? 'Usuario actual:' + JSON.stringify(user) : 'No hay usuario cargado');

      // Eliminamos tokens corruptos
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

    } finally {

      // Siempre terminamos el estado loading
      setLoading(false);
    }
  };


  // ==================================================
  // LOGIN GLOBAL
  // ==================================================
  // Esta función será usada por formularios de login.
  const login = async (username, password) => {
    try {

      // Ejecuta login del servicio:
      // -> obtiene tokens
      // -> los guarda en localStorage
      await loginService(username, password);

      // Luego cargamos información del usuario
      // para actualizar el contexto global.
      await loadUser();

      return true;

    } catch (error) {

      // Propagamos el error al componente login
      throw error;
    }
  };


  // ==================================================
  // LOGOUT GLOBAL
  // ==================================================
    const logout = () => {

    // Elimina tokens del navegador
    logoutService();

    // Limpia usuario del estado React
    setUser(null);
  };


  // ==================================================
  // PROVIDER DEL CONTEXTO
  // ==================================================
  // Aquí exponemos valores accesibles desde toda la app.
  return (

    <AuthContext.Provider
      value={{
        user,      // usuario autenticado
        loading,   // estado de carga inicial
        login,     // función login global
        logout     // función logout global
      }}
    >

      {/* Renderiza todos los componentes hijos */}
      {children}

    </AuthContext.Provider>
  );
};