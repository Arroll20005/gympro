// Landing Page para el Gimnasio GymPro
// Esta página es accesible para todos los visitantes (no requiere autenticación)
// Sirve como presentación del gimnasio y embudo para convertir visitantes en usuarios

import React, { useState } from 'react';

// Importamos imágenes (asumiendo que existen en el directorio de imágenes)
// Si no existen, usaremos placeholders o las omitiremos temporalmente
import heroGym from '../images/hero-gym.jpg';
import gymEquipment from '../images/gym-equipment.jpg';
import gymFacilities from '../images/gym-facilities.jpg';
import {isAuthenticated} from '../services/authService';

const LandingPage = () => {
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  
  const [formStatus, setFormStatus] = useState(null); // null, 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío de formulario (en producción aquí iría la llamada a tu API)
    setTimeout(() => {
      // Aquí normalmente harías: await api.sendContactForm(contactForm)
      // Por ahora simulamos éxito
      setFormStatus('success');
      setIsSubmitting(false);
      
      // Resetear formulario después de éxito
      setContactForm({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* ===== HEADER ===== */}
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>GymPro</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Gimnasio Integral</p>
        </div>
        <nav>
         {
          isAuthenticated() ? (
            <a href="/dashboard" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500'
            }}>Dashboard</a>
          ) : (
            <a href="/login" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500'
            }}>Iniciar Sesión</a>
          )}  
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section style={{ 
        backgroundImage: heroGym ? `url(${heroGym})` : 'linear-gradient(135deg, #2c3e50, #3498db)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Overlay oscuro para mejorar legibilidad */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}></div>
        
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          color: 'white',
          textAlign: 'center',
          padding: '0 2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>Transforma tu Cuerpo y Vida</h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '2rem',
            opacity: 0.9,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>Únete a nuestra comunidad de fitness y alcanza tus metas con entrenadores profesionales y equipos de última generación.</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a href="/login" style={{ 
              backgroundColor: '#3498db',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}>Comenzar Ahora</a>
            <a href="#contacto" style={{ 
              backgroundColor: 'transparent',
              color: '#ecf0f1',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              border: '2px solid #ecf0f1',
              borderRadius: '4px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}>Más Información</a>
          </div>
        </div>
      </section>

      {/* ===== CARACTERÍSTICAS ===== */}
      <section style={{ 
        padding: '4rem 2rem',
        backgroundColor: '#ecf0f1',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '3rem' }}>¿Por qué elegir GymPro?</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#3498db', marginTop: 0 }}>Entrenadores Certificados</h3>
            <p>Nuestro equipo cuenta con certificaciones internacionales y años de experiencia en entrenamiento personal y grupal.</p>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#3498db', marginTop: 0 }}>Instalaciones Modernas</h3>
            <p>Equipamiento de última generación, áreas amplias y ambientes diseñados para tu comodidad y seguridad.</p>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#3498db', marginTop: 0 }}>Horarios Flexibles</h3>
            <p>Abierto todos los días con horarios extendidos para adaptarse a tu rutina diaria.</p>
          </div>
        </div>
      </section>

      {/* ===== GALERÍA ===== */}
      <section style={{ 
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }}>
        <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '3rem' }}>Nuestras Instalaciones</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={gymEquipment ? gymEquipment : 'https://via.placeholder.com/400x300'} 
              alt="Equipamiento del gimnasio" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <div style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '1rem',
              textAlign: 'center'
            }}>
              Área de Pesas y Cardio
            </div>
          </div>
          <div style={{ 
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={gymFacilities ? gymFacilities : 'https://via.placeholder.com/400x300'} 
              alt="Instalaciones del gimnasio" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <div style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '1rem',
              textAlign: 'center'
            }}>
              Clases Grupales y Yoga
            </div>
          </div>
        </div>
      </section>

      {/* ===== FORMULARIO DE CONTACTO ===== */}
      <section id="contacto" style={{ 
        padding: '4rem 2rem',
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Contáctanos</h2>
        <p style={{ 
          marginBottom: '3rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0.9
        }}>¿Tienes preguntas? ¡Estamos aquí para ayudarte! Llena el formulario o contáctanos directamente por WhatsApp.</p>
        
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '8px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Tu Nombre"
                value={contactForm.nombre}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={contactForm.email}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <input
                type="tel"
                name="telefono"
                placeholder="Tu Teléfono (opcional)"
                value={contactForm.telefono}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <textarea
                name="mensaje"
                placeholder="Tu Mensaje"
                value={contactForm.mensaje}
                onChange={handleChange}
                rows="4"
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s'
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
          
          {formStatus === 'success' && (
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(46, 204, 113, 0.2)',
              border: '1px solid #2ecc71',
              borderRadius: '4px',
              color: '#2ecc71'
            }}>
              ¡Gracias por contactarnos! Te responderemos pronto.
            </div>
          )}
          {formStatus === 'error' && (
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(231, 76, 60, 0.2)',
              border: '1px solid #e74c3c',
              borderRadius: '4px',
              color: '#e74c3c'
            }}>
              Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
            </div>
          )}
        </div>
        
        <div style={{ 
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <a 
            href="https://wa.me/5491123456789" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#25d366',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            {/* Icono simple de WhatsApp (puedes reemplazar con un SVG o imagen real) */}
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              marginRight: '0.5rem'
            }}>
              <span style={{ 
                display: 'block',
                width: '10px',
                height: '10px',
                backgroundColor: '#25d366',
                borderRadius: '50%',
                margin: '5px auto'
              }}></span>
            </span>
            Contacto por WhatsApp
          </a>
          <a 
            href="/login" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '1rem',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            Quiero Registrarme
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ 
        backgroundColor: '#1a252f',
        color: '#ecf0f1',
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.9rem'
      }}>
        <p>&copy; 2026 GymPro. Todos los derechos reservados.</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="#" style={{ color: '#ecf0f1', margin: '0 0.5rem', textDecoration: 'none' }}>Política de Privacidad</a>
          <a href="#" style={{ color: '#ecf0f1', margin: '0 0.5rem', textDecoration: 'none' }}>Términos de Servicio</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;