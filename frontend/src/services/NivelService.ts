import { apiRequest } from '../helpers/clienteAxios'; 

export class NivelService {
  static async getAllNiveles() {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get('/nivel/', {
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
      const response = await apiRequest.post('/nivel/store', nivelData, {
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
      const response = await apiRequest.get(`/nivel/${nivelId}`, {
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
      const response = await apiRequest.put(`/nivel/update/${nivelId}`, nivelData, {
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
      const response = await apiRequest.put(`/nivel/updateAnulado/${nivelId}`, nivelData, {
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
      const response = await apiRequest.delete(`/nivel/delete/${nivelId}`, { 
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
