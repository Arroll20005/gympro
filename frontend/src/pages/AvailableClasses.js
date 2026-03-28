// Importa React y hooks necesarios
// useState → manejar estados locales
// useEffect → ejecutar efectos secundarios
// useContext → acceder a datos globales
import React, { useState, useEffect, useContext } from 'react';

// Hook para navegar entre rutas
import { useNavigate } from 'react-router-dom';

// Servicio que obtiene clases disponibles desde el backend
import { getAvailableClasses } from '../services/classService';

// Servicio que crea una reserva en el backend
import { createReservation } from '../services/reservationService';

// Contexto global de autenticación
// permite acceder al usuario logueado
import { AuthContext } from '../context/AuthContext';


// Componente principal
function AvailableClasses() {

  // Estado que almacena la lista de clases obtenidas del servidor
  const [clases, setClases] = useState([]);

  // Estado que indica si los datos están cargando
  const [loading, setLoading] = useState(true);

  // Estado para guardar mensajes de error
  const [error, setError] = useState('');

  // Obtiene el usuario autenticado desde el contexto global
  const { user } = useContext(AuthContext);

  // Función para cambiar de ruta
  const navigate = useNavigate();


  // useEffect se ejecuta cuando el componente se monta
  // El array vacío [] significa:
  // 👉 solo se ejecuta una vez
  useEffect(() => {
    loadClasses();
  }, []);

    useEffect(() => {

    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);

  }, [error]);



  // Función asincrónica que carga clases disponibles
  const loadClasses = async () => {
    try {

      // Activa indicador de carga
      setLoading(true);

      // Llama al servicio backend
      const data = await getAvailableClasses();

      // Guarda las clases en el estado
      setClases(data);

    } catch (err) {

      // Si ocurre error muestra mensaje
      setError('Error al cargar clases');

      setTimeout(() => {
  setError('');
}, 3000);

      // Imprime error en consola para debugging
      console.error(err);

    } finally {

      // Siempre desactiva loading
      setLoading(false);
    }
  };


  // Función ejecutada al reservar una clase
  const handleReserve = async (claseId) => {

    // Confirmación antes de reservar
    if (!window.confirm('¿Confirmar reserva?')) return;

    try {

      // Envía datos al backend para crear reserva
      await createReservation({
        clase: claseId,
        notas: ''
      });

      // Mensaje de éxito
      alert('Reserva creada exitosamente');

      // Recarga clases para actualizar cupos
      loadClasses();

    } catch (err) {

      // Intenta obtener mensaje específico del backend
      console.log("ERROR BACKEND:", err.response?.data);

  const message= (err.response?.data?.clase || 'Error al crear reserva');
  setError(message);
    }
  };


  // Mientras carga datos muestra pantalla de loading
  if (loading)
    return <div style={styles.loading}>Cargando...</div>;


  // ================= RENDER =================
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <header style={styles.header}>

        {/* Botón volver al dashboard */}
        <button
          onClick={() => navigate('/')}
          style={styles.backButton}
        >
          ← Volver
        </button>

        {/* Título de la página */}
        <h1 style={styles.title}>Clases Disponibles</h1>
      </header>


      {/* Mensaje de error si existe */}
      {error && <div style={styles.error}>{error}</div>
      
      
      }


      <main style={styles.main}>

        {/* Si no existen clases */}
        {clases.length === 0 ? (

          <div style={styles.empty}>
            <p>No hay clases disponibles</p>
          </div>

        ) : (

          // Grid de clases
          <div style={styles.grid}>

            {/* Recorre todas las clases */}
            {clases.map((clase) => (

              // Card individual
              <div key={clase.id} style={styles.card}>

                {/* Nombre de la clase */}
                <h3 style={styles.className}>
                  {clase.nombre}
                </h3>

                {/* Nombre del entrenador */}
                <p style={styles.trainer}>
                  Entrenador: {clase.entrenador_name}
                </p>

                {/* Fecha y hora formateada */}
                <p style={styles.schedule}>
                  📅 {new Date(clase.horario)
                    .toLocaleString('es-EC')}
                </p>

                {/* Duración */}
                <p style={styles.duration}>
                  ⏱️ {clase.duracion_minutos} minutos
                </p>

                {/* Cupos actuales */}
                <p style={styles.capacity}>
                  👥 {clase.reservas_actuales} /
                  {clase.capacidad_maxima} personas
                </p>


                {/* Si existe cupo disponible */}
                {clase.tiene_cupo ? (

                  <button
                    onClick={() =>
                      handleReserve(clase.id)
                    }
                    style={styles.reserveButton}
                  >
                    Reservar
                  </button>

                ) : (

                  // Botón deshabilitado si está lleno
                  <button
                    disabled
                    style={styles.fullButton}
                  >
                    Lleno
                  </button>
                )}

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


// ================= ESTILOS =================
// Objeto con estilos inline usados en todo el componente
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#1e1e1e',
    color: '#4caf50',
    padding: '1.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#e0e0e0',
    border: '1px solid #e0e0e0',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#4caf50',
  },
  main: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.5rem',
    color: '#e0e0e0',
  },
  error: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '1rem',
    margin: '1rem 2rem',
    borderRadius: '6px',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    color: '#e0e0e0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow:
      '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #333',
  },
  className: {
    margin: '0 0 1rem 0',
    fontSize: '1.3rem',
    color: '#e0e0e0',
  },
  trainer: {
    margin: '0.5rem 0',
    color: '#e0e0e0',
  },
  schedule: {
    margin: '0.5rem 0',
    color: '#e0e0e0',
  },
  duration: {
    margin: '0.5rem 0',
    color: '#e0e0e0',
  },
  capacity: {
    margin: '0.5rem 0',
    fontWeight: 'bold',
    color: '#4caf50',
  },
  reserveButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '1rem',
  },
  fullButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '1rem',
    cursor: 'not-allowed',
  },
};

// Exporta el componente
export default AvailableClasses;