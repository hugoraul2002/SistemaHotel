import axios from 'axios';
import { AperturaCaja } from '../types/types';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:3333/aperturaCaja';

export class AperturaCajaService {
  static async getAllAperturas() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching aperturas:', error);
      throw error;
    }
  }

  static async createApertura(aperturaData:AperturaCaja) {
    try {
      const token = localStorage.getItem('token');
      console.log(aperturaData)

      const formatDateTime = (date: Date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };
      const data = {
        userId: aperturaData.userId,
        fecha: formatDateTime(dayjs(aperturaData.fecha).toDate()),
        observaciones: aperturaData.observaciones,
        monto: aperturaData.monto,
        anulado: aperturaData.anulado
      }
      const response = await axios.post(`${API_URL}/store`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating apertura:', error);
      throw error;
    }
  }

  static async getAperturaById(aperturaId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${aperturaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching apertura with id ${aperturaId}:`, error);
      throw error;
    }
  }

  static async updateApertura(aperturaId: number, aperturaData: { userId?: number; fecha?: string; observaciones?: string; monto?: number; anulado?: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update/${aperturaId}`, aperturaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating apertura with id ${aperturaId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(aperturaId: number, aperturaData: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${aperturaId}`, aperturaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating apertura with id ${aperturaId}:`, error);
      throw error;
    }
  }

  static async deleteApertura(aperturaId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete/${aperturaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting apertura with id ${aperturaId}:`, error);
      throw error;
    }
  }
}
