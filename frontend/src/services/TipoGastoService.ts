import axios from 'axios';
import {TipoGasto}  from '../types/types';

const API_URL = 'http://localhost:3333/tiposGastos';

export class TipoGastoService {
  static async getAllTipoGastos(anulados: boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/`, {anulados},{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tipo gastos:', error);
      throw error;
    }
  }

  static async createTipoGasto(tipoGastoData: TipoGasto) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, tipoGastoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tipo gasto:', error);
      throw error;
    }
  }

  static async getTipoGastoById(tipoGastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${tipoGastoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tipo gasto with id ${tipoGastoId}:`, error);
      throw error;
    }
  }

  static async updateTipoGasto(tipoGastoId: number, tipoGastoData: Partial<TipoGasto>) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update/${tipoGastoId}`, tipoGastoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating tipo gasto with id ${tipoGastoId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(tipoGastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${tipoGastoId}`, {  }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating anulado for tipo gasto with id ${tipoGastoId}:`, error);
      throw error;
    }
  }

  static async deleteTipoGasto(tipoGastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete/${tipoGastoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting tipo gasto with id ${tipoGastoId}:`, error);
      throw error;
    }
  }
}
