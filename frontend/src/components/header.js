import React from "react";
import { useNavigate } from 'react-router-dom';

export default function Header({title}){
   const navigate = useNavigate();
  const styles = {
   container: {
     minHeight: '100vh',
     // Inherit background from body
   },
   header: {
     backgroundColor: '#1e1e1e', // Dark header to match App header
     color: '#4caf50', // Green for title
     padding: '1.5rem 2rem',
     display: 'flex',
     alignItems: 'center',
     gap: '1rem',
   },
   backButton: {
     backgroundColor: 'transparent',
     color: '#e0e0e0', // Light text for button
     border: '1px solid #e0e0e0',
     padding: '0.5rem 1rem',
     borderRadius: '6px',
     cursor: 'pointer',
   },
   title: {
     margin: 0,
     fontSize: '1.8rem',
   }};
   
   
   
   
     return (
     <header style={styles.header}>
 
         {/* Botón para regresar al dashboard */}
         <button
           onClick={() => navigate('/')}
           style={styles.backButton}
         >
           ← Volver
         </button>
 
         {/* Título de la vista */}
         <h1 style={styles.title}>{title}</h1>
       </header>)
 };