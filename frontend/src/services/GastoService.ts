import axios from 'axios';
import { Gasto } from '../types/types';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:3333/gastos';

export class GastoService {
  static async getAllGastos(anulados:boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/`,{anulados}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gastos:', error);
      throw error;
    }
  }

  static async createGasto(gastoData: Gasto) {
    try {
      console.log(gastoData);
      const data = {id:gastoData.id, 

    userId: JSON.parse(localStorage.getItem('auth')!).id,
    tipoGastoId: gastoData.tipoGastoId,
    proveedorId: gastoData.proveedorId,
    descripcion: gastoData.descripcion,
    monto: gastoData.monto,
    fecha:dayjs(gastoData.fecha).add(6, 'hour').format('YYYY-MM-DD'),
    anulado: false
      }
      console.log(data);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating gasto:', error);
      throw error;
    }
  }

  static async getGastoById(gastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${gastoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gasto with id ${gastoId}:`, error);
      throw error;
    }
  }

  static async updateGasto(gastoId: number, gastoData: Partial<Gasto>) {
    try {
      const token = localStorage.getItem('token');
      const data = {id:gastoData.id, 

        userId: JSON.parse(localStorage.getItem('auth')!).id,
        tipoGastoId: gastoData.tipoGastoId,
        proveedorId: gastoData.proveedorId,
        descripcion: gastoData.descripcion,
        monto: gastoData.monto,
        fecha:dayjs(gastoData.fecha).format('YYYY-MM-DD'),
        anulado: false
          }
          console.log('data',data, 'gastoData',gastoData);
      const response = await axios.put(`${API_URL}/update/${gastoId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating gasto with id ${gastoId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(gastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${gastoId}`, { }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating anulado for gasto with id ${gastoId}:`, error);
      throw error;
    }
  }

  static async deleteGasto(gastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete/${gastoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting gasto with id ${gastoId}:`, error);
      throw error;
    }
  }
}