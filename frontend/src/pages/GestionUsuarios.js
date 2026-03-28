// Importa React y el hook useContext.
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componente funcional GestionUsuarios
function GestionUsuarios() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    // Función para obtener la lista de usuarios
    const obtenerUsuarios = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/');
        setUsuarios(response.data.results);
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

  // Función para crear un nuevo usuario
  const crearUsuario = async (usuarioData) => {
    try {
      const response = await api.post('/users/', usuarioData);
      alert('Usuario creado exitosamente. La contraseña ha sido enviada al correo electrónico del usuario.');
      
    
      await obtenerUsuarios(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al crear usuario:', err);
    }
  };

  // Función para actualizar un usuario
  const actualizarUsuario = async (id, usuarioData) => {
    try {
      const response = await api.put(`/users/${id}/`, usuarioData);
      await obtenerUsuarios(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar usuario:', err);
    }
  };

  // Función para eliminar un usuario
  const eliminarUsuario = async (id) => {
    try {
      const response = await api.delete(`/users/${id}/`);
      await obtenerUsuarios(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
      console.error('Error al eliminar usuario:', err);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
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
            onClick={() => navigate('/')}
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
          <h1>Gestión de Usuarios</h1>
          <button 
            onClick={() => navigate('/crear-usuario')} 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Crear Usuario
          </button>
        </header>

        {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <p style={{ color: '#e0e0e0' }}>Cargando usuarios...</p>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>ID</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Nombre</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Email</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Rol</th>
                  <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left', color: '#e0e0e0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{usuario.id}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{usuario.first_name || usuario.username}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{usuario.email}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', color: '#e0e0e0' }}>{usuario.role}</td>
                    <td style={{ border: '1px solid #444', padding: '8px' }}>
                      <button 
                        onClick={() => navigate(`/editar-usuario/${usuario.id}`)} 
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
                        onClick={() => eliminarUsuario(usuario.id)} 
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

export default GestionUsuarios;