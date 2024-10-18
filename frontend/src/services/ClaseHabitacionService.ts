import { apiRequest } from '../helpers/clienteAxios';

export class ClaseHabitacionService {
  static async getAllClaseHabitaciones() {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get('/claseHabitacion/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clase habitaciones:', error);
      throw error;
    }
  }

  static async getClasesReservacion() {
    try {
      const response = await apiRequest.get('/reservacionOnline/clasesHabitacion');
      return response.data;
    } catch (error) {
      console.error('Error fetching clase habitaciones:', error);
      throw error;
    }
  }

  static async getClasesHabitaciones() {
    try {
      const response = await apiRequest.get('/claseHabitacion/habitaciones');
      return response.data;
    } catch (error) {
      console.error('Error fetching clase habitaciones:', error);
      throw error;
    }
  }

  static async createClaseHabitacion(data: { nombre: string; }) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/claseHabitacion/store', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating clase habitacion:', error);
      throw error;
    }
  }

  static async getClaseHabitacionById(id: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/claseHabitacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching clase habitacion with id ${id}:`, error);
      throw error;
    }
  }

  static async updateClaseHabitacion(id: number, data: { nombre?: string }) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/claseHabitacion/update/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating clase habitacion with id ${id}:`, error);
      throw error;
    }
  }

  static async updateAnulado(id: number, data: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/claseHabitacion/updateAnulado/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating anulado status for clase habitacion with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteClaseHabitacion(id: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.delete(`/claseHabitacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting clase habitacion with id ${id}:`, error);
      throw error;
    }
  }
}
