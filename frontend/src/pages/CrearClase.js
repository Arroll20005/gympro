import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CrearClase = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [clase, setClase] = useState({
    nombre: '',
    descripcion: '',
    entrenador_id: '',
    horario: '',
    duracion_minutos: '',
    capacidad_maxima: '',
  });
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Load trainers (users with role ENTRENADOR)
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/');
        // Assuming paginated results: response.data.results
        const users = response.data.results || [];
        const trainerUsers = users.filter(u => u.role === 'ENTRENADOR');
        setTrainers(trainerUsers);
      } catch (err) {
        setError('Error al cargar la lista de entrenadores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClase(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Prepare data for API
      const claseData = {
        nombre: clase.nombre,
        descripcion: clase.descripcion,
        entrenador: parseInt(clase.entrenador_id, 10), // Send as integer ID
        horario: clase.horario,
        duracion_minutos: parseInt(clase.duracion_minutos, 10),
        capacidad_maxima: parseInt(clase.capacidad_maxima, 10),
      };
      const response = await api.post('/classes/', claseData);
      alert('Clase creada exitosamente');
      navigate('/gestion-clases');
    } catch (err) {
      setError('Error al crear la clase');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Only administrators can access
  if (user?.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  if (loading && trainers.length === 0) {
    return <div>Cargando...</div>;
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
        <h2>Crear Nueva Clase</h2>
      </header>
      {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Nombre de la clase:</label>
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
            <label>Entrenador:</label>
            <select
              name="entrenador_id"
              value={clase.entrenador_id}
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
              <option value="">Seleccione un entrenador</option>
            {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.get_full_name || trainer.username}
                </option>
              ))}
            </select>
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
          <label>Capacidad máxima:</label>
          <input
            type="number"
            name="capacidad_maxima"
            value={clase.capacidad_maxima}
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
          {saving ? 'Creando...' : 'Crear Clase'}
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

export default CrearClase;