import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const EditarClase = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [clase, setClase] = useState({
    nombre: '',
    descripcion: '',
    horario: '',
    duracion_minutos: '',
    capacidad_maxima: '',
    activa: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Cargar clase al montar
  useEffect(() => {
    const loadClase = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/classes/${id}/`);
        setClase(response.data);
      } catch (err) {
        setError('Error al cargar la clase');
        console.error(err);
        navigate('/gestion-clases');
      } finally {
        setLoading(false);
      }
    };

    loadClase();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields
    if (name === 'duracion_minutos' || name === 'capacidad_maxima') {
      setClase(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value, 10),
      }));
    } else if (name === 'activa') {
      setClase(prev => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setClase(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/classes/${id}/`, clase);
      alert('Clase actualizada exitosamente');
      navigate('/gestion-clases');
    } catch (err) {
      setError('Error al actualizar la clase');
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
          onClick={() => navigate('/gestion-clases')}
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
        <h2>Editar Clase</h2>
      </header>
      {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={clase.nombre}
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
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={clase.descripcion}
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
        <div>
          <label>Horario (fecha y hora):</label>
          <input
            type="datetime-local"
            name="horario"
            value={clase.horario}
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
        <div>
          <label>Duración (minutos):</label>
          <input
            type="number"
            name="duracion_minutos"
            value={clase.duracion_minutos}
            onChange={handleChange}
            min="1"
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
        <div>
          <label>Capacidad máxima:</label>
          <input
            type="number"
            name="capacidad_maxima"
            value={clase.capacidad_maxima}
            onChange={handleChange}
            min="1"
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
        <div>
          <label>Activa:</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="activa"
              checked={clase.activa}
              onChange={handleChange}
            />
            Sí
          </label>
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
          onClick={() => navigate('/gestion-clases')}
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

export default EditarClase;