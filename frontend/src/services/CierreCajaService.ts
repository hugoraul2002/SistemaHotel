import axios from 'axios';
import {me} from './AuthService'
const API_URL = 'http://localhost:3333/cierreCaja';
export class CierreCajaService {
  static async getAllCierres() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`, {
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
      const response = await axios.post(`${API_URL}/store`, cierreData, {
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
      const response = await axios.get(`${API_URL}/${cierreId}`, {
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
      const response = await axios.get(`${API_URL}/encabezadoCierre/${idApertura}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cierre with id ${idApertura}:`, error);
      console.error(`Error fetching cierre with id ${idApertura}:`, error);
      throw error;
    }
  }

  static async getTransaccionesCierre(idApertura: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/transaccionesCierre/${idApertura}`, {
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
      const response = await axios.put(`${API_URL}/update/${cierreId}`, cierreData, {
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
      const response = await axios.put(`${API_URL}/updateAnulado/${cierreId}`, cierreData, {
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
