import { apiRequest } from '../helpers/clienteAxios';
import { Rol } from '../types/types';

export const RolService = {
  async getAllRols(): Promise<Rol[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get('/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async getRolById(id: number): Promise<Rol> {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.get(`/roles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  async createRol(rol: Rol): Promise<Rol> {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.post('/roles', rol, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  async updateRol(id: number, rol: Rol): Promise<Rol> {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest.put(`/roles/${id}`, rol, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  async deleteRol(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await apiRequest.delete(`/roles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },
};
