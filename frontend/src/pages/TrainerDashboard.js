// Importa React y hooks necesarios
// useState → manejar estados del componente
// useEffect → ejecutar código cuando el componente se monta
import React, { useState, useEffect } from 'react';

// Hook de navegación para cambiar rutas
import { useNavigate } from 'react-router-dom';

// Servicios del backend
// getTrainerClasses → obtiene las clases del entrenador
// getClassReservations → obtiene las reservas de una clase específica
import {
  getTrainerClasses,
  getClassReservations
} from '../services/classService';
import Header from '../components/header';

// Componente que muestra el dashboard del entrenador
function TrainerDashboard() {
  // Estado que almacena las clases del entrenador
  const [clases, setClases] = useState([]);
  
  // Estado que almacena las reservas de la clase seleccionada
  const [reservasClase, setReservasClase] = useState([]);
  
  // Estado para la clase actualmente seleccionada
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  
  // Estado que controla la pantalla de carga
  const [loading, setLoading] = useState(true);

  // Hook para navegación entre páginas
  const navigate = useNavigate();


  // useEffect se ejecuta una sola vez al montar el componente
  useEffect(() => {
    loadTrainerClasses();
  }, []);


// Función asincrónica que carga las clases del entrenador
  const loadTrainerClasses = async () => {
    try {
      // Activa indicador de carga
      setLoading(true);

      // Solicita clases del entrenador al backend
      const response = await getTrainerClasses();
      console.log('Respuesta completa del API:', response);
      const data = response.data || response;
      console.log('Clases del entrenador obtenidas:', data);
      console.log('Tipo de datos recibido:', typeof data);
      
      // Aseguramos que los datos sean un array antes de establecer el estado
      if (Array.isArray(data)) {
        setClases(data);
      } else {
        console.warn('Se esperaba un array pero se recibió:', data);
        // Intentamos extraer el array de propiedades comunes en las respuestas de API
        if (data && typeof data === 'object') {
          if (Array.isArray(data.results)) {
            setClases(data.results);
          } else if (Array.isArray(data.data)) {
            setClases(data.data);
          } else if (Array.isArray(data.clases)) {
            setClases(data.clases);
          } else {
            setClases([]); // Valor por defecto si no encontramos un array
          }
        } else {
          setClases([]); // Valor por defecto si no es un objeto
        }
      }

    } catch (err) {
      // Muestra error en consola para depuración
      console.error('Error al cargar clases del entrenador:', err);
      setClases([]); // En caso de error, establecemos un array vacío

    } finally {
      // Finaliza estado de carga
      setLoading(false);
    }
  };


  // Función asincrónica que carga las reservas de una clase específica
  const loadClassReservations = async (claseId) => {
    try {
      // Activa indicador de carga
      setLoading(true);

      // Solicita reservas de la clase específica al backend
      const data = await getClassReservations(claseId);
      console.log('Reservas de la clase obtenidas:', data);
      // Guarda las reservas en el estado
      setReservasClase(data);
      // Establece la clase como seleccionada
      const claseSeleccionadaObj = clases.find(clase => clase.id === claseId);
      setClaseSeleccionada(claseSeleccionadaObj || null);

    } catch (err) {
      // Muestra error en consola para depuración
      console.error('Error al cargar reservas de la clase:', err);

    } finally {
      // Finaliza estado de carga
      setLoading(false);
    }
  };


  // Mientras se cargan datos muestra pantalla de loading
  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Cargando...</h2>
      </div>
    );
  }


  // Si no hay clases
  if (clases.length === 0) {
    return (
      <div style={styles.container}>
        {/* HEADER */}
        <Header title="Dashboard Entrenador" />
        
        {/* CONTENIDO PRINCIPAL */}
        <main style={styles.main}>
          <div style={styles.empty}>
            <h2>No tienes clases asignadas</h2>
            <p>Ponte en contacto con el administrador para que te asignen clases.</p>
          </div>
        </main>
      </div>
    );
  }


  // ================= RENDER =================
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <Header title="Dashboard Entrenador" />
      
      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.main}>
        {claseSeleccionada ? (
          // Vista de detalles de la clase seleccionada
          <div style={styles.classDetail}>
            <div style={styles.headerButtons}>
              <button
                onClick={() => setClaseSeleccionada(null)}
                style={styles.backButton}
              >
                ← Volver a Mis Clases
              </button>
            </div>
            
            <h2 style={styles.classTitle}>
              {claseSeleccionada.nombre}
            </h2>
            
            <p style={styles.classInfo}>
              👨‍🏫 Entrenador: {claseSeleccionada.entrenador_name}
            </p>
            
            <p style={styles.classInfo}>
              📅 Horario: {new Date(claseSeleccionada.horario).toLocaleString('es-EC')}
            </p>
            
            <p style={styles.classInfo}>
              ⏱️ Duración: {claseSeleccionada.duracion_minutos} minutos
            </p>
            
            <p style={styles.classInfo}>
              🏋️ Tipo: {claseSeleccionada.tipo || 'No especificado'}
            </p>
            
            {/* Notas de la clase */}
            {claseSeleccionada.notas && (
              <div style={styles.notesBox}>
                <p style={styles.notesLabel}>📝 Notas:</p>
                <p style={styles.notesText}>{claseSeleccionada.notas}</p>
              </div>
            )}
            
            <hr style={styles.divider} />
            
            <h3 style={styles.sectionTitle}>👥 Estudiantes Inscritos ({reservasClase.length})</h3>
            
            {reservasClase.length === 0 ? (
              <p style={styles.noReservations}>
                Actualmente no hay estudiantes inscritos en esta clase.
              </p>
            ) : (
              <div style={styles.reservationsList}>
                {reservasClase.map((reserva) => (
                  <div key={reserva.id} style={styles.reservationCard}>
                    <div style={styles.studentInfo}>
                      <h4 style={styles.studentName}>
                        {reserva.user_details.first_name || reserva.user_details.username}
                      </h4>
                      <p style={styles.studentEmail}>
                        📧 {reserva.user_details.email || 'No disponible'}
                      </p>
                    </div>
                    
                    <div style={styles.reservationInfo}>
                      <p style={styles.reservationDate}>
                        📅 {new Date(reserva.fecha_reserva).toLocaleString('es-EC')}
                      </p>
                      
                      {reserva.estado !== 'confirmada' && (
                        <span style={styles.reservationStatus}>
                          Estado: {reserva.estado}
                        </span>
                      )}
                      
                      {reserva.notas && (
                        <div style={styles.studentNotes}>
                          <p style={styles.notesLabel}>📝 Notas del estudiante:</p>
                          <p style={styles.notesText}>{reserva.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Vista de lista de clases
          <div>
            <h2 style={styles.sectionTitle}>👨‍🏫 Mis Clases</h2>
            
            <div style={styles.classesGrid}>
              {clases.map((clase) => (
                <div
                  key={clase.id}
                  style={styles.classCard}
                  onClick={() => loadClassReservations(clase.id)}
                >
                  <div style={styles.classIcon}>
                    💪
                  </div>
                  <div style={styles.classContent}>
                    <h3 style={styles.className}>{clase.nombre}</h3>
                    <p style={styles.classSchedule}>
                      📅 {new Date(clase.horario).toLocaleString('es-EC', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p style={styles.classDetails}>
                      ⏱️ {clase.duracion_minutos} min • 
                      👥 {reservasClase.filter(r => r.clase_id === clase.id).length || 0} inscritos
                    </p>
                    {clase.tipo && (
                      <p style={styles.classType}>
                        🏋️ {clase.tipo}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
  main: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontSize: '1.5rem',
    color: '#e0e0e0',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #333',
  },
  sectionTitle: {
    color: '#e0e0e0',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  classDetail: {
    backgroundColor: '#1e1e1e',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #333',
    marginBottom: '2rem',
  },
  headerButtons: {
    marginBottom: '1.5rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#e0e0e0',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  classTitle: {
    color: '#e0e0e0',
    marginBottom: '1rem',
  },
  classInfo: {
    color: '#e0e0e0',
    margin: '0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  notesBox: {
    backgroundColor: '#2d2d2d',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    borderLeft: '4px solid #4caf50',
  },
  notesLabel: {
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: '0.5rem',
  },
  notesText: {
    color: '#e0e0e0',
    lineHeight: '1.5',
  },
  divider: {
    border: '0',
    borderTop: '1px solid #444',
    margin: '1.5rem 0',
  },
  reservationsList: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #333',
    overflow: 'hidden',
  },
  noReservations: {
    textAlign: 'center',
    padding: '2rem',
    color: '#e0e0e0',
    fontStyle: 'italic',
  },
  reservationCard: {
    padding: '1.5rem',
    borderBottom: '1px solid #444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentInfo: {
    flex: 2,
    minWidth: '200px',
  },
  studentName: {
    margin: '0 0 0.5rem 0',
    color: '#e0e0e0',
    fontSize: '1.1rem',
  },
  studentEmail: {
    color: '#e0e0e0',
    fontSize: '0.9rem',
  },
  reservationInfo: {
    flex: 1,
    textAlign: 'right',
  },
  reservationDate: {
    color: '#4caf50',
    margin: '0.25rem 0',
    fontSize: '0.9rem',
  },
  reservationStatus: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#f39c12',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.8rem',
    margin: '0.25rem 0',
  },
  studentNotes: {
    marginTop: '1rem',
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  classCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
  },
  classIcon: {
    fontSize: '2.5rem',
    marginRight: '1.5rem',
    color: '#4caf50',
  },
  classContent: {
    flex: 1,
  },
  className: {
    margin: '0 0 0.5rem 0',
    color: '#e0e0e0',
    fontSize: '1.3rem',
  },
  classSchedule: {
    color: '#e0e0e0',
    margin: '0.25rem 0',
    fontSize: '0.9rem',
  },
  classDetails: {
    color: '#e0e0e0',
    margin: '0.25rem 0',
    fontSize: '0.85rem',
  },
  classType: {
    color: '#e0e0e0',
    margin: '0.25rem 0',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
};


// Exporta el componente
export default TrainerDashboard;