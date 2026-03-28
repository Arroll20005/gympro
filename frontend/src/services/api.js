// Importa la librería axios.
// Axios es un cliente HTTP que permite hacer peticiones
// al backend (GET, POST, PUT, DELETE, etc.)
import axios from 'axios';


// URL base de nuestra API backend.
// Todas las peticiones usarán esta dirección como prefijo.
// Ejemplo final:
// http://127.0.0.1:8000/api/users/
// http://127.0.0.1:8000/api/login/
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';


// Creamos una INSTANCIA personalizada de axios.
// Esto es MUY importante porque:
// ✅ evita repetir configuración
// ✅ permite usar interceptores
// ✅ centraliza toda la comunicación con la API
const api = axios.create({

  // baseURL se agrega automáticamente a cada request
  baseURL: API_URL,

  // Headers por defecto enviados en TODAS las peticiones
  headers: {
    // Indicamos que enviamos datos en formato JSON
    'Content-Type': 'application/json',
  },
});


// ===============================
// INTERCEPTOR DE REQUEST
// ===============================
// Se ejecuta ANTES de cada petición HTTP.
// Sirve para modificar automáticamente la request.

// Caso típico: agregar token JWT sin hacerlo manualmente.
api.interceptors.request.use(

  // config contiene toda la configuración de la petición:
  // url, headers, método, body, etc.
  (config) => {

    // Obtiene el access token guardado en el navegador
    // localStorage persiste aunque recargues la página.
    const token = localStorage.getItem('access_token');
    

    //temporal
    console.log('Interceptando request. Token found:', token? 'YES':'NO');
    // Si existe token...
    if (token) {

      // Agrega automáticamente el header Authorization
      // requerido por APIs protegidas con JWT.
      //
      // Resultado final del header:
      // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANTE:
    // Siempre debes devolver config,
    // o la request nunca se enviará.
    return config;
  },

  // Si ocurre un error antes de enviar la request
  (error) => {
    // Rechaza la promesa para que el error continúe
    return Promise.reject(error);
  }
);


// ===============================
// INTERCEPTOR DE RESPONSE
// ===============================
// Se ejecuta DESPUÉS de recibir respuesta del servidor.
// Aquí manejamos tokens expirados automáticamente.
api.interceptors.response.use(

  // Si la respuesta fue exitosa (200, 201, etc.)
  // simplemente la devolvemos.
  (response) => response,

  // Si hubo error (400, 401, 500...)
  async (error) => {

    // Guardamos la request original que falló.
    // Esto permite repetirla luego.
    const originalRequest = error.config;


    // ===============================
    // DETECTAR TOKEN EXPIRADO
    // ===============================
    //
    // status 401 = Unauthorized
    // normalmente significa:
    // 👉 access token expiró
    //
    // !_retry evita loops infinitos.
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Marcamos que ya intentamos refrescar
      originalRequest._retry = true;

      try {

        // Obtenemos el refresh token guardado
        const refreshToken = localStorage.getItem('refresh_token');

        // Pedimos un NUEVO access token al backend
        //
        // NOTA:
        // usamos axios normal, NO "api",
        // para evitar recursión infinita del interceptor.
        const response = await axios.post(
          `${API_URL}/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        // Extraemos el nuevo access token
        const { access } = response.data;

        // Guardamos el nuevo token
        localStorage.setItem('access_token', access);


        // Actualizamos el header de la request original
        originalRequest.headers.Authorization =
          `Bearer ${access}`;

        // Reintentamos automáticamente la petición
        // que había fallado.
        return api(originalRequest);

      } catch (refreshError) {

        // ===============================
        // SI EL REFRESH TOKEN TAMBIÉN FALLA
        // ===============================
        // Significa:
        // ❌ sesión totalmente expirada
        // ❌ refresh token inválido

        // Eliminamos tokens almacenados
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Redirigimos al login
        window.location.href = '/login';

        // Propagamos el error
        return Promise.reject(refreshError);
      }
    }

    // Si el error no es 401,
    // simplemente lo devolvemos.
    return Promise.reject(error);
  }
);


// Exportamos la instancia configurada.
// Ahora en cualquier archivo puedes hacer:
//
// import api from './api';
//
// api.get('/users');
// api.post('/login');
export default api;