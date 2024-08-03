import axios from 'axios';

const API_URL = 'http://localhost:3333/nivel';

export class NivelService {
  static async getAllNiveles() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching niveles:', error);
      throw error;
    }
  }

  static async createNivel(nivelData: { nombre: string }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, nivelData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating nivel:', error);
      throw error;
    }
  }
  

  static async getNivelById(nivelId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${nivelId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching nivel with id ${nivelId}:`, error);
      throw error;
    }
  }

  static async updateNivel(nivelId: number, nivelData: { nombre?: string }) {
    try {
      const token = localStorage.getItem('token');
      console.log(nivelData);
      const response = await axios.put(`${API_URL}/update/${nivelId}`, nivelData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating nivel with id ${nivelId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(nivelId: number, nivelData: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${nivelId}`, nivelData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating nivel with id ${nivelId}:`, error);
      throw error;
    }
  }

  static async deleteNivel(nivelId: number) {
    try {
      console.log(nivelId);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete/${nivelId}`, { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting nivel with id ${nivelId}:`, error);
      throw error;
    }
  }
}
