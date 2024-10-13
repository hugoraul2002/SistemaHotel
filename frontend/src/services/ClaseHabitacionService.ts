import axios from 'axios';
const API_URL = 'http://localhost:3333/claseHabitacion';
const API_URL_2 = 'http://localhost:3333/reservacionOnline'; 


export class ClaseHabitacionService {
  static async getAllClaseHabitaciones() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`,{
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
      
      const response = await axios.get(`${API_URL_2}/clasesHabitacion`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clase habitaciones:', error);
      throw error;
    }
  }

  static async getClasesHabitaciones() {
    try {
      const response = await axios.get(`${API_URL}/habitaciones`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching clase habitaciones:', error);
      throw error;
    }
  }

  static async createClaseHabitacion(data: { nombre: string; }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, data,{
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
      const response = await axios.get(`${API_URL}/${id}`,{
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

  static async updateClaseHabitacion(id: number, data: { nombre?: string}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update/${id}`, data,{
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
      const response = await axios.put(`${API_URL}/updateAnulado/${id}`, data,{
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
      const response = await axios.delete(`${API_URL}/${id}`,{
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
