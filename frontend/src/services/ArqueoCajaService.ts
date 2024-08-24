import axios from 'axios';

const API_URL = 'http://localhost:3333/arqueoCaja';

export class ArqueoCajaService {
  static async getAllArqueos() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching arqueos:', error);
      throw error;
    }
  }

  static async createArqueo(arqueoData: { aperturaId: number; usuarioId: number; fecha: string; monto: number; anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, arqueoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating arqueo:', error);
      throw error;
    }
  }

  static async getArqueoById(arqueoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${arqueoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching arqueo with id ${arqueoId}:`, error);
      throw error;
    }
  }

  static async updateArqueo(arqueoId: number, arqueoData: { aperturaId?: number; usuarioId?: number; fecha?: string; monto?: number; anulado?: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update/${arqueoId}`, arqueoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating arqueo with id ${arqueoId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(arqueoId: number, arqueoData: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${arqueoId}`, arqueoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating arqueo with id ${arqueoId}:`, error);
      throw error;
    }
  }

  static async deleteArqueo(arqueoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete/${arqueoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting arqueo with id ${arqueoId}:`, error);
      throw error;
    }
  }
}
