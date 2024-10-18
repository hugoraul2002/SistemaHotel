import { apiRequest } from '../helpers/clienteAxios';
import { Gasto, Usuario } from '../types/types';
import dayjs from 'dayjs';
import { me } from './AuthService';

export class GastoService {
  static async getAllGastos(anulados: boolean) {
    try {
      const token = localStorage.getItem('token');
      const user: Usuario = await me();
      const response = await apiRequest.post('/gastos/', {
        anulados,
        opcion: user.rol.nombre === 'ADMIN' ? 1 : 2,
        userId: user.id,
        fecha: dayjs(new Date()).format('YYYY-MM-DD')
      }, {
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
      const data = {
        id: gastoData.id,
        userId: JSON.parse(localStorage.getItem('auth')!).id,
        tipoGastoId: gastoData.tipoGastoId,
        proveedorId: gastoData.proveedorId,
        descripcion: gastoData.descripcion,
        monto: gastoData.monto,
        fecha: dayjs(gastoData.fecha).add(6, 'hour').format('YYYY-MM-DD'),
        anulado: false
      };
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/gastos/store', data, {
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
      const response = await apiRequest.get(`/gastos/${gastoId}`, {
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
      const data = {
        id: gastoData.id,
        userId: JSON.parse(localStorage.getItem('auth')!).id,
        tipoGastoId: gastoData.tipoGastoId,
        proveedorId: gastoData.proveedorId,
        descripcion: gastoData.descripcion,
        monto: gastoData.monto,
        fecha: dayjs(gastoData.fecha).format('YYYY-MM-DD'),
        anulado: false
      };
      const response = await apiRequest.put(`/gastos/update/${gastoId}`, data, {
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
      const response = await apiRequest.put(`/gastos/updateAnulado/${gastoId}`, {}, {
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

  static async reporteGasto(data: any) {
    try {
      const token = localStorage.getItem('token');
      const reportData = {
        fechaInicio: dayjs(data.fechaInicio).format('YYYY-MM-DD'),
        fechaFin: dayjs(data.fechaFin).format('YYYY-MM-DD'),
      };
      const response = await apiRequest.post('/gastos/reporteGastos/', reportData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  static async deleteGasto(gastoId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.delete(`/gastos/delete/${gastoId}`, {
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
