import api from './api';

export const getClasses = async (params = {}) => {
  try {
    const response = await api.get('/classes/', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases:', error);
    throw error;
  }
};

// Obtener las clases del entrenador autenticado
export const getTrainerClasses = async () => {
  try {
    const response = await api.get('/classes/');
    console.log('Clases del entrenador:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases del entrenador:', error);
    throw error;
  }
};

// Obtener las reservas de una clase específica
export const getClassReservations = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/reservas/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas de la clase:', error);
    throw error;
  }
};

// Agrega esta función para obtener las clases del usuario autenticado
export const createClass = async (classData) => {
  try{
    const response = await api.post("/classes/", classData);
    return response.data;
  }catch(error){
    console.error("Error al crear clase", error.response.data);
    throw error;
  }
};

export const getAvailableClasses = async () => {
  try {
    const response = await api.get('/classes/disponibles/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases disponibles:', error);
    throw error;
  }
};

export const getClass = async (id) => {
  try {
    const response = await api.get(`/classes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clase:', error);
    throw error;
  }
};
