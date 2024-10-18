import { ArqueoCaja } from '../types/types';
import dayjs from 'dayjs';
import { apiRequest } from '../helpers/clienteAxios';

export class ArqueoCajaService {
  static async getAllArqueos() {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get('/arqueoCaja/', {
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

  static async createArqueo(arqueoData: ArqueoCaja) {
    try {
      const formatDateTime = (date: Date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const data = {
        aperturaId: arqueoData.aperturaId,
        userId: arqueoData.userId,
        fecha: formatDateTime(dayjs(arqueoData.fecha).subtract(6, 'hours').toDate()),
        monto: arqueoData.monto,
        anulado: arqueoData.anulado
      };
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/arqueoCaja/store', data, {
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
      const response = await apiRequest.get(`/arqueoCaja/${arqueoId}`, {
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
      const response = await apiRequest.put(`/arqueoCaja/update/${arqueoId}`, arqueoData, {
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
      const response = await apiRequest.put(`/arqueoCaja/updateAnulado/${arqueoId}`, arqueoData, {
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
      const response = await apiRequest.delete(`/arqueoCaja/delete/${arqueoId}`, {
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
