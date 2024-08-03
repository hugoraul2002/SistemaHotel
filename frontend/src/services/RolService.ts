import axios from 'axios';
import { Rol } from '../types/types';
const API_URL = 'http://localhost:3333'; // Ajusta esto según tu configuración de API



export const RolService = {
  async getAllRols(): Promise<Rol[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/roles`,{
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
      const response = await axios.get(`${API_URL}/roles/${id}`,{
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
      const response = await axios.post(`${API_URL}/roles`, rol,{
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
      const response = await axios.put(`${API_URL}/roles/${id}`, rol,{
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
      await axios.delete(`${API_URL}/roles/${id}`,{
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
