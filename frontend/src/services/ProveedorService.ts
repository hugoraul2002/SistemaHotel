import axios from 'axios';
import { Proveedor } from '../types/types';

const API_URL = 'http://localhost:3333/proveedores';

export class ProveedorService {
  static async getAllProveedors() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`, {
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
      const response = await axios.post(`${API_URL}/store`, proveedorData, {
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
      const response = await axios.get(`${API_URL}/${proveedorId}`, {
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
      const response = await axios.put(`${API_URL}/update/${proveedorId}`, proveedorData, {
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

  static async updateAnulado(proveedorId: number, anulado: boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${proveedorId}`, { anulado }, {
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
      const response = await axios.delete(`${API_URL}/delete/${proveedorId}`, {
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
