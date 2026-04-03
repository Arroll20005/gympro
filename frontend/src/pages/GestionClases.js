// Importa React y el hook useContext.
import React, { useContext, useState, useEffect } from 'react';
// Importa el contexto de autenticación creado previamente.
import { AuthContext } from '../context/AuthContext';
// Hook de react-router-dom que permite navegar entre rutas
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de tener esta configuración para hacer peticiones a tu backend

// Componente funcional GestionClases
function GestionClases() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener la lista de clases
  const obtenerClases = async () => {
    try {
      setLoading(true);
      // Aquí deberías hacer la petición a tu backend
      // Por ahora usamos datos simulados
      
      const response= await api.get('/classes/')
      const data = response.data;
       
      setClases(data.results);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener clases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva clase
  const crearClase = async (claseData) => {
    try {
      const response = await api.post('/classes/', claseData)
  
      await obtenerClases(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al crear clase:', err);
    }
  };

  // Función para actualizar una clase
  const actualizarClase = async (id, claseData) => {
    try {
      const response = await api.put(`/classes/${id}`, claseData)
      await obtenerClases(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar clase:', err);
    }
  };

  // Función para eliminar una clase
  const eliminarClase = async (id) => {
    try {
      const response = await api.delete(`/classes/${id}/`);
      await obtenerClases(); // Refrescar la lista
    
      await obtenerClases(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al eliminar clase:', err);
    }
  };

  // Cargar clases al montar el componente
  useEffect(() => {
    obtenerClases();
  }, []);

  // Verificar si el usuario es admin
  if (user?.role !== 'ADMIN') {
    navigate('/login'); // Redirigir si no es admin
    return null;
  }

   return (
     <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#121212', minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: 'transparent', 
              color: '#e0e0e0', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            ← Volver
          </button>
          <h1>Gestión de Clases</h1>
          <button 
            onClick={() => navigate('/crear-clase')} 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Crear Clase
          </button>
        </header>

        {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <p style={{ color: '#e0e0e0' }}>Cargando clases...</p>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>ID</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Nombre</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Instructor</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Horario</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Reservas  </th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clases.map(clase => (
                  <tr key={clase.id} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{clase.id}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{clase.nombre}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{clase.entrenador_name || 'Sin asignar'}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{clase.horario}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{clase.reservas_actuales}</td>
                    <td style={{ border: '1px solid #444', padding: '8px' }}>
                      <button 
                        onClick={() => navigate(`/editar-clase/${clase.id}`)} 
                        style={{ 
                          marginRight: '0.5rem',
                          padding: '0.25rem 0.5rem', 
                          backgroundColor: '#4caf50', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '3px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => eliminarClase(clase.id)} 
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          backgroundColor: '#f44336', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '3px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
     </div>
   );
}

export default GestionClases;