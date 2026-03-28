import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CrearUsuario = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const [fieldErrors, setFieldErrors] = useState({});

  // Load trainers (users with role ENTRENADOR)
 // useEffect(() => {
    //const loadUsuario = async () => {
     // try {
       // setLoading(true);
        //const response = await api.get.post(`/users/`);
        //setUsuario(response.data);
      //} catch (err) {
        //setError('Error al cargar el usuario');
        //console.error(err);
        //navigate('/gestion-usuarios');
      //} finally {
        //setLoading(false);
     // }
    //};

    //loadUsuario();
  //}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors(prev => ({
    ...prev,
    [name]: undefined,
  }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

  



  

    try {
      // Prepare data for API
      const UsuarioData = {
        username: usuario.username,
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        telefono: usuario.telefono,
        role: usuario.role,
      };
      const response = await api.post('/users/', UsuarioData);
      alert('Usuario creado exitosamente');
      navigate('/gestion-usuarios');
    } catch (err) {
      setError('Error al crear el usuario');
      const apiErrors = err.response?.data || {};
      setFieldErrors(apiErrors);
      Object.entries(apiErrors).forEach(([field, messages]) => {
        console.error(`Error en ${field}: ${messages.join(', ')}`);
      });

      
      
    } finally {
      setSaving(false);
    }
  };

  // Only administrators can access
  if (user?.role !== 'ADMIN') {
    navigate('/login');
    return null;
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
        <h2>Crear un nuevo Usuario</h2>
      </header>
      {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Nombre del usuario:</label>
          <input
            type="text"
            name="username"
            value={usuario.username}
            onChange={handleChange}
            required
            style={{
              background: '#2d2d2d',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '8px',
              color: '#e0e0e0',
              fontFamily: '\'Bebas Neue\', sans-serif',
            }}
          />
        </div>
        { (fieldErrors.username) && (
          <div style={{ color: '#f44336' }}>
          {fieldErrors.username}
          </div>) }
        <div>
          <label>email:</label>
          <textarea
            name="email"
            value={usuario.email}
            onChange={handleChange}
            rows="4"
            style={{
              background: '#2d2d2d',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '8px',
              color: '#e0e0e0',
              fontFamily: '\'Bebas Neue\', sans-serif',
            }}
          />
        </div>
         { (fieldErrors.email) && (
          <div style={{ color: '#f44336' }}>
          {fieldErrors.email}
          </div>) }
        
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="first_name"
            value={usuario.first_name}
            onChange={handleChange}
            required
            style={{
              background: '#2d2d2d',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '8px',
              color: '#e0e0e0',
              fontFamily: '\'Bebas Neue\', sans-serif',
            }}
          />
          { (fieldErrors.first_name) && (
            <div style={{ color: '#f44336' }}>
            {fieldErrors.first_name}
            </div>) }
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={usuario.last_name}
            onChange={handleChange}
            min="1"
            required
            style={{
              background: '#2d2d2d',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '8px',
              color: '#e0e0e0',
              fontFamily: '\'Bebas Neue\', sans-serif',
            }}
          />
        </div>
          { (fieldErrors.last_name) && (
            <div style={{ color: '#f44336' }}>
            {fieldErrors.last_name}
            </div>) }
        
        <div>
            <label>Role</label>
            <select
              name="role"
              value={usuario.role}
              onChange={handleChange}
              required
              style={{
                background: '#2d2d2d',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '8px',
                color: '#e0e0e0',
                fontFamily: '\'Bebas Neue\', sans-serif',
              }}
            >
              
              <option value="">Selecciona un rol</option>
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
          {saving ? 'Creando...' : 'Crear Usuario'}
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

export default CrearUsuario;