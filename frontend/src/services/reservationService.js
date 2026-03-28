import api from './api';

export const getReservations = async (params = {}) => {
  try {
    const response = await api.get('/reservations/', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const createReservation = async (data) => {
  try {
    const response = await api.post('/reservations/', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear reserva:', error);
    throw error;
  }
};

export const cancelReservation = async (id) => {
  try {
    const response = await api.post(`/reservations/${id}/cancelar/`);
    return response.data;
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    throw error;
  }
};

export const getUpcomingReservations = async () => {
  try {
    const response = await api.get('/reservations/mis_proximas/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener próximas reservas:', error);
    throw error;
  }
};