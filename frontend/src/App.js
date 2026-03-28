// Importa React y el hook useContext
// useContext permite acceder a datos globales
import React, { useContext } from 'react';

// Importaciones del sistema de rutas de React Router
// Router → controla navegación SPA
// Routes → contenedor de rutas
// Route → define rutas individuales
// Navigate → redirección automática
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Contexto de autenticación
// AuthProvider → provee datos globales
// AuthContext → permite consumirlos
import {
  AuthProvider,
  AuthContext
} from './context/AuthContext';

// Páginas de la aplicación
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AvailableClasses from './pages/AvailableClasses';
import MyReservations from './pages/MyReservations';
import MyClasses from './pages/MyClasses';
import TrainerDashboard from './pages/TrainerDashboard';
import GestionUsuarios from './pages/GestionUsuarios';
import GestionClases from './pages/GestionClases';
import EditarUsuario from './pages/EditarUsuario';
import EditarClase from './pages/EditarClase';
import CrearClase from './pages/CrearClase';
import CrearUsuario from './pages/crearUsuario';


// ===================================================
// COMPONENTE ProtectedRoute
// ===================================================
// Este componente protege rutas privadas.
// Solo permite acceso si el usuario está autenticado.
function ProtectedRoute({ children }) {

  // Obtiene usuario y estado de carga del contexto
  const { user, loading } = useContext(AuthContext);

  // Mientras se verifica autenticación
  // muestra pantalla de carga
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // Si existe usuario → permite acceso
  // Si no → redirige al login
  return user
    ? children
    : <Navigate to="/login" />;
}


// ===================================================
// DEFINICIÓN DE RUTAS
// ===================================================
function AppRoutes() {

  return (
    <Routes>

      {/* Ruta pública */}
      {/* No necesita autenticación */}
      <Route
        path="/login"
        element={<Login />}
      />


      {/* Dashboard protegido */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* Página de clases disponibles */}
      {/* Solo usuarios autenticados */}
      <Route
        path="/clases-disponibles"
        element={
          <ProtectedRoute>
            <AvailableClasses />
          </ProtectedRoute>
        }
      />


       {/* Página de reservas del usuario */}
       <Route
         path="/mis-reservas"
         element={
           <ProtectedRoute>
             <MyReservations />
           </ProtectedRoute>
         }
       />
       <Route path="/mis-clases" 
       element={
         <ProtectedRoute>
           <MyClasses />
         </ProtectedRoute>
       } />
       
        {/* Dashboard del entrenador */}
        <Route
          path="/dashboard-entrenador"
          element={
            <ProtectedRoute>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Gestión de usuarios - Solo para administradores */}
        <Route
          path="/gestion-usuarios"
          element={
            <ProtectedRoute>
              <GestionUsuarios />
            </ProtectedRoute>
          }
        />
        {/* Editar usuario - Solo para administradores */}
        <Route
          path="/editar-usuario/:id"
          element={
            <ProtectedRoute>
              <EditarUsuario />
            </ProtectedRoute>
          }
        />
        {/* Editar clase - Solo para administradores */}
        <Route
          path="/editar-clase/:id"
          element={
            <ProtectedRoute>
              <EditarClase />
            </ProtectedRoute>
          }
        />

        {/* Gestión de clases - Solo para administradores */}
        <Route
          path="/gestion-clases"
          element={
            <ProtectedRoute>
              <GestionClases />
            </ProtectedRoute>
          }
        />
        {/* Crear clase - Solo para administradores */}
        <Route
          path="/crear-clase"
          element={
            <ProtectedRoute>
              <CrearClase />
            </ProtectedRoute>
          }
        />
         {/* Crear usuario - Solo para administradores */}
    <Route
      path="/crear-usuario"
      element={
        <ProtectedRoute>
          <CrearUsuario />
        </ProtectedRoute>
      }
    />

    </Routes>

   

  );
}


// ===================================================
// COMPONENTE PRINCIPAL APP
// ===================================================
function App() {

  return (

    // AuthProvider envuelve TODA la aplicación
    // haciendo disponible:
    // - usuario
    // - login
    // - logout
    // - loading
    <AuthProvider>

      {/* Router habilita navegación SPA */}
      <Router>

        {/* Carga las rutas definidas */}
        <AppRoutes />

      </Router>

    </AuthProvider>
  );
};

export default App;