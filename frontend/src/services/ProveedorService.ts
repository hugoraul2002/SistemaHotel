import { apiRequest } from '../helpers/clienteAxios';
import { Proveedor } from '../types/types';

export class ProveedorService {
  static async getAllProveedors(anulados: boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/proveedores', { anulados }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching proveedors:', error);
      throw error;
    }
  }

  static async createProveedor(proveedorData: Proveedor) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/proveedores/store', proveedorData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating proveedor:', error);
      throw error;
    }
  }

  static async getProveedorById(proveedorId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/proveedores/${proveedorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching proveedor with id ${proveedorId}:`, error);
      throw error;
    }
  }

  static async updateProveedor(proveedorId: number, proveedorData: Partial<Proveedor>) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/proveedores/update/${proveedorId}`, proveedorData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating proveedor with id ${proveedorId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(proveedorId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/proveedores/updateAnulado/${proveedorId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating anulado for proveedor with id ${proveedorId}:`, error);
      throw error;
    }
  }

  static async deleteProveedor(proveedorId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.delete(`/proveedores/delete/${proveedorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting proveedor with id ${proveedorId}:`, error);
      throw error;
    }
  }
}
