import { me } from './AuthService';
import { apiRequest } from '../helpers/clienteAxios';

export class CierreCajaService {
  static async getAllCierres() {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get('/cierreCaja/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cierres:', error);
      throw error;
    }
  }

  static async createCierre(cierreData: any) {
    try {
      const token = localStorage.getItem('token');
      const user = await me();

      cierreData.userId = user.id;
      cierreData.fecha = (new Date()).toISOString().slice(0, 19).replace('T', ' ');

      const response = await apiRequest.post('/cierreCaja/store', cierreData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating cierre:', error);
      throw error;
    }
  }

  static async getCierreById(cierreId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/cierreCaja/${cierreId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching cierre with id ${cierreId}:`, error);
      throw error;
    }
  }

  static async getEncabezadoCierre(idApertura: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/cierreCaja/encabezadoCierre/${idApertura}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cierre with id ${idApertura}:`, error);
      throw error;
    }
  }

  static async getTransaccionesCierre(idApertura: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/cierreCaja/transaccionesCierre/${idApertura}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching cierre with id ${idApertura}:`, error);
      throw error;
    }
  }

  static async updateCierre(cierreId: number, cierreData: { arqueoId?: number; usuarioId?: number; fecha?: string; montoSistema?: number; observaciones?: string; anulado?: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/cierreCaja/update/${cierreId}`, cierreData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating cierre with id ${cierreId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(cierreId: number, cierreData: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/cierreCaja/updateAnulado/${cierreId}`, cierreData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data; 
    } catch (error) {
      console.error(`Error updating cierre with id ${cierreId}:`, error);
      throw error;
    }
  }
}
