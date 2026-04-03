// Importamos React y hooks necesarios:
//
// useState  -> manejar estados locales del componente
// useContext -> acceder al contexto global de autenticación
import React, { useState, useContext } from 'react';

// Hook de React Router que permite redireccionar
// programáticamente al usuario.
import { useNavigate } from 'react-router-dom';

// Importamos el contexto global donde vive
// la lógica de autenticación (login/logout/user).
import { AuthContext } from '../context/AuthContext';


// ======================================================
// COMPONENTE LOGIN
// ======================================================
function Login() {

  // -----------------------------------------
  // ESTADOS DEL FORMULARIO
  // -----------------------------------------

  // Guarda el username escrito por el usuario
  const [username, setUsername] = useState('');

  // Guarda la contraseña ingresada
  const [password, setPassword] = useState('');

  // Guarda mensajes de error (login incorrecto)
  const [error, setError] = useState('');

  // Indica si el login está en proceso
  // (para deshabilitar botón y mostrar loading)
  const [loading, setLoading] = useState(false);


  // -----------------------------------------
  // CONTEXTO GLOBAL DE AUTENTICACIÓN
  // -----------------------------------------
  // Extraemos la función login definida en AuthContext.
  //
  // Esta función:
  // -> llama al backend
  // -> guarda tokens
  // -> carga usuario global
  const { login } = useContext(AuthContext);


  // Hook para navegar entre rutas
  const navigate = useNavigate();


  // ==================================================
  // MANEJAR ENVÍO DEL FORMULARIO
  // ==================================================
  const handleSubmit = async (e) => {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Limpiamos errores previos
    setError('');

    // Activamos estado loading
    setLoading(true);

    try {

      // Ejecuta login global:
      // 1. pide tokens
      // 2. guarda tokens
      // 3. obtiene usuario
      await login(username, password);

      // Si login fue exitoso,
      // redirigimos al home.
      navigate('/dashboard');

    } catch (err) {

      // Si backend devuelve error (401 normalmente)
      setError('Usuario o contraseña incorrectos');

    } finally {

      // Siempre desactivamos loading
      setLoading(false);
    }
  };


  // ==================================================
  // RENDER DEL COMPONENTE
  // ==================================================
  return (

    // Contenedor principal centrado vertical y horizontalmente
    <div style={styles.container}>

      {/* Tarjeta visual del login */}
      <div style={styles.card}>

        {/* Nombre de la aplicación */}
        <h1 style={styles.title}>GymPro</h1>

        {/* Subtítulo */}
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* ================= USERNAME ================= */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario:</label>

            <input
              type="text"

              // valor controlado por React
              value={username}

              // actualiza estado al escribir
              onChange={(e) => setUsername(e.target.value)}

              required
              style={styles.input}
              placeholder="Ingresa tu usuario"
            />
          </div>


          {/* ================= PASSWORD ================= */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña:</label>

            <input
              type="password"
              value={password}

              // guarda contraseña en estado
              onChange={(e) => setPassword(e.target.value)}

              required
              style={styles.input}
              placeholder="Ingresa tu contraseña"
            />
          </div>


          {/* ================= ERROR ================= */}
          {/* Solo aparece si existe mensaje de error */}
          {error && <p style={styles.error}>{error}</p>}


          {/* ================= BOTÓN LOGIN ================= */}
          <button 
            type="submit"

            // Evita múltiples clicks mientras carga
            disabled={loading}

            style={{
              ...styles.button,

              // efecto visual mientras carga
              opacity: loading ? 0.6 : 1,

              cursor: loading
                ? 'not-allowed'
                : 'pointer'
            }}
          >

            {/* Texto dinámico */}
            {loading ? 'Ingresando...' : 'Ingresar'}

          </button>

        </form>
      </div>
    </div>
  );
}


// ======================================================
// ESTILOS INLINE
// ======================================================
// Objeto JS con estilos CSS usados en el componente.
const styles = {

  // Contenedor principal
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#121212',
  },

  // Tarjeta del login
  card: {
    backgroundColor: '#1e1e1e',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #333',
  },

  title: {
    textAlign: 'center',
    color: '#4caf50',
    marginBottom: '0.5rem',
    fontSize: '2rem',
  },

  subtitle: {
    textAlign: 'center',
    color: '#e0e0e0',
    marginBottom: '2rem',
    fontSize: '1.2rem',
    fontWeight: 'normal',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  inputGroup: {
    marginBottom: '1.5rem',
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#e0e0e0',
    fontWeight: '500',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2d2d2d',
    fontSize: '1rem',
    color: '#e0e0e0',
    boxSizing: 'border-box',
  },

  button: {
    padding: '0.875rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '1rem',
  },

  error: {
    color: '#f44336',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    textAlign: 'center',
    backgroundColor: '#2d2d2d',
    padding: '0.75rem',
    borderRadius: '6px',
  },
};


// Exportamos el componente
export default Login;