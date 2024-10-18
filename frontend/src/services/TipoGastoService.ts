import { apiRequest } from '../helpers/clienteAxios';
import { TipoGasto } from '../types/types';

export class TipoGastoService {
  static async getAllTipoGastos(anulados: boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/tiposGastos/', { anulados }, {
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
      const response = await apiRequest.post('/tiposGastos/store', tipoGastoData, {
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
      const response = await apiRequest.get(`/tiposGastos/${tipoGastoId}`, {
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
      const response = await apiRequest.put(`/tiposGastos/update/${tipoGastoId}`, tipoGastoData, {
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
      const response = await apiRequest.put(`/tiposGastos/updateAnulado/${tipoGastoId}`, {}, {
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
      const response = await apiRequest.delete(`/tiposGastos/delete/${tipoGastoId}`, {
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
