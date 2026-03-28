// Importa React y hooks necesarios
// useState → manejar estados del componente
// useEffect → ejecutar código cuando el componente se monta
import React, { useState, useEffect } from 'react';

// Hook de navegación para cambiar rutas
import { useNavigate } from 'react-router-dom';

// Servicios del backend
// getUpcomingReservations → obtiene reservas futuras del usuario
// cancelReservation → cancela una reserva específica
import {
  getUpcomingReservations,
  cancelReservation
} from '../services/reservationService';
import Header from '../components/header';


// Componente que muestra las reservas del usuario
function MyReservations() {

  // Estado que almacena las reservas obtenidas del backend
  const [reservas, setReservas] = useState([]);

  // Estado que controla la pantalla de carga
  const [loading, setLoading] = useState(true);

  // Hook para navegación entre páginas
  const navigate = useNavigate();


  // useEffect se ejecuta una sola vez al montar el componente
  // debido al array vacío []
  useEffect(() => {
    loadReservations();
  }, []);


  // Función asincrónica que carga reservas próximas
  const loadReservations = async () => {
    try {

      // Activa indicador de carga
      setLoading(true);

      // Solicita reservas al backend
      const data = await getUpcomingReservations();
      console.log('Reservas obtenidas:', data);
      // Guarda las reservas en el estado
      setReservas(data);

    } catch (err) {

      // Muestra error en consola para depuración
      console.error('Error al cargar reservas:', err);

    } finally {

      // Finaliza estado de carga
      setLoading(false);
    }
  };


  // Función para cancelar una reserva
  const handleCancel = async (id) => {

    // Confirmación antes de cancelar
    if (!window.confirm('¿Cancelar esta reserva?')) return;

    try {

      // Llama al servicio backend para cancelar
      await cancelReservation(id);

      // Notifica éxito al usuario
      alert('Reserva cancelada');

      // Recarga reservas actualizadas
      loadReservations();

    } catch (err) {

      // Obtiene mensaje de error del backend si existe
      const errorMsg =
        err.response?.data?.error ||
        'Error al cancelar';

      // Muestra error
      alert(errorMsg);
    }
  };


  // Mientras se cargan datos muestra pantalla de loading
  if (loading)
    return <div style={styles.loading}>Cargando...</div>;


  // ================= RENDER =================
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <Header title="Mis Reservas" />

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>

        {/* Si el usuario no tiene reservas */}
        {reservas.length === 0 ? (

          <div style={styles.empty}>

            <p>No tienes reservas próximas</p>

            {/* Botón que redirige a clases disponibles */}
            <button
              onClick={() =>
                navigate('/clases-disponibles')
              }
              style={styles.createButton}
            >
              Ver Clases Disponibles
            </button>

          </div>

        ) : (

          // Lista de reservas existentes
          <div style={styles.list}>

            {/* Recorre cada reserva */}
            {reservas.map((reserva) => (

              <div
                key={reserva.id}
                style={styles.card}
              >

                {/* Nombre de la clase */}
                <h3 style={styles.className}>
                  {reserva.clase_details.nombre}
                </h3>

                {/* Fecha y hora formateada */}
                <p style={styles.schedule}>
                  📅 {new Date(
                    reserva.clase_details.horario
                  ).toLocaleString('es-EC')}
                </p>

                {/* Entrenador */}
                <p style={styles.trainer}>
                  👨‍🏫 {reserva.clase_details.entrenador_name}
                </p>

                {/* Duración */}
                <p style={styles.duration}>
                  ⏱️ {reserva.clase_details.duracion_minutos} minutos
                </p>

                {/* Notas opcionales */}
                {reserva.notas && (
                  <p style={styles.notes}>
                    📝 {reserva.notas}
                  </p>
                )}

                {/* Botón cancelar */}
                <button
                  onClick={() =>
                    handleCancel(reserva.id)
                  }
                  style={styles.cancelButton}
                >
                  Cancelar Reserva
                </button>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


// ================= ESTILOS =================
// Estilos inline usados en el componente
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
    maxWidth: '900px',
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
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    color: '#e0e0e0',
  },
  createButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
  schedule: {
    margin: '0.5rem 0',
    color: '#e0e0e0',
  },
  trainer: {
    margin: '0.5rem 0',
    color: '#e0e0e0',
  },
  notes: {
    margin: '1rem 0',
    padding: '0.75rem',
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
    color: '#e0e0e0',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

// Exporta el componente
export default MyReservations;