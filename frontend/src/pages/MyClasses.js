import React, { useState, useEffect } from "react";
import { getClasses } from "../services/classService";
import "./css/MyClasses.css";
import CreateClassModal from "../components/CreateClassModal";

import Header from '../components/header';

function MyClasses() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [clases, setClases] = useState([]);



  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await getClasses();
      console.log(data);
      setClases(data.results);
    } catch (err) {
      console.error(err);
    }
  };
  const addClassToList = (newClass) => {

    setClases(prev => [newClass, ...prev]);

  };
   const styles = {

     container: {
     minHeight: '100vh',
     backgroundColor: '#121212',
   },
   Button: {
     backgroundColor: '#4caf50',
     color: 'white',
     border: 'none',
     padding: '0.9rem 2rem',
     margin: '1rem 2rem',
     borderRadius: '6px',
     cursor: 'pointer',
     boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
   }
   }
  ;

  return (


    <div style={styles.container}>

       {/* HEADER */}
       <Header title="Mis Clases" />

           <button 
  style={styles.Button}
  onClick={() => setShowCreateModal(true)}
>
  + Crear clase
</button>
 {showCreateModal && (
    <CreateClassModal
      onClose={() => setShowCreateModal(false)} 
        onClassCreated={addClassToList}
    />
  )}

      <div className="classes-grid">

        {clases.map((clase) => (

          <div key={clase.id} className="class-card">

            <h3 className="class-title">
              {clase.nombre}
            </h3>

            <p className="class-trainer">
              👨‍🏫 {clase.entrenador_name}
            </p>

            <p className="class-date">
              🕒 {new Date(clase.horario).toLocaleString()}
            </p>

            <p className="class-capacity">
              👥 {clase.reservas_actuales}/{clase.capacidad_maxima}
            </p>

            <div className="class-status">
              {clase.tiene_cupo ? (
                <span className="available">Cupo disponible</span>
              ) : (
                <span className="full">Clase llena</span>
              )}
            </div>

          </div>

        ))}

      </div>
      {/* Botón para crear una nueva clase */}
 

    </div>
  );}

export default MyClasses;