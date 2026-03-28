// Importa React y el hook useContext.
// useContext permite acceder a datos globales compartidos
// mediante el sistema Context API de React.
import React, { useContext } from 'react';

// Importa el contexto de autenticación creado previamente.
// Este contexto probablemente contiene información del usuario
// logueado y funciones como login y logout.
import { AuthContext } from '../context/AuthContext';

// Hook de react-router-dom que permite navegar entre rutas
// de manera programática (sin usar <Link/>).
import { useNavigate } from 'react-router-dom';

// Importa el logo
import logo from '../logo.svg';
// Importa la imagen de fondo
import bgGym from '../images/bg-gym.png';


// Componente funcional Dashboard
// Representa el panel principal del sistema GymPro.
function Dashboard() {

  // useContext obtiene los valores almacenados en AuthContext.
  // user → datos del usuario autenticado
  // logout → función para cerrar sesión
  const { user, logout } = useContext(AuthContext);

  // Hook que devuelve una función para cambiar de ruta.
  const navigate = useNavigate();


  // Función ejecutada cuando el usuario presiona
  // el botón "Cerrar Sesión".
  const handleLogout = () => {

    // Ejecuta la función logout del contexto.
    // Normalmente elimina token, sesión o usuario.
    logout();

    // Redirige automáticamente al login.
    navigate('/login');
  };


  // ==========================
  // RENDER DEL COMPONENTE
  // ==========================
  return (

    // Contenedor principal del dashboard
    <div style={styles.container}>

      {/* ===== HEADER ===== */}
      <header style={styles.header}>
        {/* Overlay para mejorar la legibilidad del texto */}
        <div style={styles.headerOverlay}></div>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo de la aplicación */}
          <img src={logo} alt="GymPro Logo" style={{ width: '40px', height: '40px' }} />
          
          {/* Nombre de la aplicación */}
          <h1 style={styles.title}>GymPro</h1>
        </div>
        
        {/* Información del usuario */}
        <div style={{ position: 'relative', ...styles.userInfo }}>
          
          {/* 
            Muestra:
            - first_name si existe
            - si no existe usa username
            - muestra también el rol del usuario
          */}
          <span style={styles.userName}>
            {user?.first_name || user?.username} ({user?.role})
          </span>
          
          {/* Botón cerrar sesión */}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Cerrar Sesión
          </button>
          
        </div>
      </header>


      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main style={styles.main}>

        {/* Mensaje de bienvenida dinámico */}
        <h2 style={styles.welcome}>
          Bienvenido, {user?.first_name || user?.username}
        </h2>


        {/* Grid responsive de opciones */}
        <div style={styles.grid}>

           {/* ================= ADMIN ================= */}
           {/* 
              Renderizado condicional:
              Solo aparece si el rol del usuario es ADMIN
           */}
           {user?.role === 'ADMIN' && (
             <>
               {/* Tarjeta gestionar usuarios */}
               <div 
                 style={styles.card}
                 onClick={() => navigate('/gestion-usuarios')}
               >
                 <h3>👥 Gestión de Usuarios</h3>
                 <p>Crear, actualizar y eliminar usuarios y roles</p>
               </div>

               {/* Tarjeta gestionar clases */}
               <div 
                 style={styles.card}
                 onClick={() => navigate('/gestion-clases')}
               >
                 <h3>📋 Gestión de Clases</h3>
                 <p>Crear, actualizar y eliminar clases</p>
               </div>
             </>
           )}


          {/* ================= CLIENTE ================= */}
          {/* Visible solo para usuarios CLIENTE */}
          {user?.role === 'CLIENTE' && (
            <>
              <div
                style={styles.card}
                onClick={() => navigate('/clases-disponibles')}
              >
                <h3>💪 Clases Disponibles</h3>
                <p>Ver y reservar clases</p>
              </div>

              <div
                style={styles.card}
                onClick={() => navigate('/mis-reservas')}
              >
                <h3>📅 Mis Reservas</h3>
                <p>Ver mis clases reservadas</p>
              </div>
            </>
          )}


          {/* ================= ENTRENADOR ================= */}
          {/* Visible solo para entrenadores */}
          {user?.role === 'ENTRENADOR' && (
            <>
              <div
                style={styles.card}
                onClick={() => navigate('/mis-clases')}
              >
                <h3>👨‍🏫 Mis Clases</h3>
                <p>Clases que imparto</p>
              </div>

               <div
                 style={styles.card}
                 onClick={() => navigate('/dashboard-entrenador')}
               >
                 <h3>👥 Reservas</h3>
                 <p>Ver reservas de mis clases</p>
               </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
  },
 header: {
      backgroundImage: `url(${bgGym})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      color: 'white',
      padding: '4rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'relative',
    },
 headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better contrast on dark background
    },
   title: {
     margin: 0,
     fontSize: '1.8rem',
     color: '#4caf50', // Green for main title
   },
   userInfo: {
     display: 'flex',
     alignItems: 'center',
     gap: '1rem',
   },
   userName: {
     fontSize: '1rem',
     color: '#e0e0e0', // Light text for user info
   },
   logoutButton: {
     padding: '0.5rem 1rem',
     backgroundColor: '#e74c3c',
     color: 'white',
     border: 'none',
     borderRadius: '6px',
     cursor: 'pointer',
     fontSize: '0.9rem',
     fontWeight: '600',
   },
   main: {
     padding: '2rem',
     maxWidth: '1200px',
     margin: '0 auto',
   },
   welcome: {
     color: '#e0e0e0', // Light text for welcome
     marginBottom: '2rem',
   },
   grid: {
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
     gap: '1.5rem',
   },
   card: {
     backgroundColor: '#1e1e1e',
     padding: '2rem',
     borderRadius: '12px',
     boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
     border: '1px solid #333',
     cursor: 'pointer',
     transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
     textAlign: 'center',
   },
};
export default Dashboard;