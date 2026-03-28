import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const EditarUsuario = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, setUsuario] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Cargar usuario al montar
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}/`);
        setUsuario(response.data);
      } catch (err) {
        setError('Error al cargar el usuario');
        console.error(err);
        navigate('/gestion-usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsuario();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/users/${id}/`, usuario);
      alert('Usuario actualizado exitosamente');
      navigate('/gestion-usuarios');
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Solo administradores pueden acceder
  if (user?.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  if (loading) {
    return <div style={{ color: '#e0e0e0' }}>Cargando...</div>;
  }

  if (error) {
    return <div style={{ color: '#f44336' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', backgroundColor: '#121212', minHeight: '100vh' }}>
       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <button
           onClick={() => navigate('/gestion-usuarios')}
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
         <h2>Editar Usuario</h2>
       </header>
       {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}
       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         <div>
           <label>Usuario:</label>
           <input
             type="text"
             name="username"
             value={usuario.username}
             onChange={handleChange}
             required
           />
         </div>
         <div>
           <label>Email:</label>
           <input
             type="email"
             name="email"
             value={usuario.email}
             onChange={handleChange}
             required
           />
         </div>
         <div>
           <label>Nombre:</label>
           <input
             type="text"
             name="first_name"
             value={usuario.first_name}
             onChange={handleChange}
           />
         </div>
         <div>
           <label>Apellido:</label>
           <input
             type="text"
             name="last_name"
             value={usuario.last_name}
             onChange={handleChange}
           />
         </div>
         <div>
           <label>Teléfono:</label>
           <input
             type="tel"
             name="telefono"
             value={usuario.telefono}
             onChange={handleChange}
           />
         </div>
         <div>
           <label>Rol:</label>
           <select
             name="role"
             value={usuario.role}
             onChange={handleChange}
           >
             <option value="ADMIN">Admin</option>
             <option value="ENTRENADOR">Entrenador</option>
             <option value="CLIENTE">Cliente</option>
           </select>
         </div>
         <button
           type="submit"
           disabled={saving}
           style={{
             padding: '0.75rem',
             backgroundColor: '#4caf50',
             color: 'white',
             border: 'none',
             borderRadius: '4px',
             cursor: saving ? 'not-allowed' : 'pointer',
             opacity: saving ? 0.7 : 1,
           }}
         >
           {saving ? 'Guardando...' : 'Guardar cambios'}
         </button>
         <button
           type="button"
           onClick={() => navigate('/gestion-usuarios')}
           style={{
             marginTop: '1rem',
             padding: '0.5rem 1rem',
             backgroundColor: '#95a5a6',
             color: '#e0e0e0',
             border: 'none',
             borderRadius: '4px',
             cursor: 'pointer',
           }}
         >
           Cancelar
         </button>
       </form>
     </div>
   );
};

export default EditarUsuario;