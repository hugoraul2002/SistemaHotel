import axios from 'axios';

const API_URL = 'http://localhost:3333/usuarios'; 

export class UsuarioService {
  static async getAllUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async createUser(userData: { full_name: string; email: string; password: string; rol_id: number }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/store`, userData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(userId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${userId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${userId}:`, error);
      throw error;
    }
  }

  static async updateUser(userId: number, userData: { full_name: string; email: string; rolId: number }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update/${userId}`, userData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${userId}:`, error);
      throw error;
    }
  }

  static async updateAnulado(userId: number, userData: { anulado: boolean }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/updateAnulado/${userId}`, userData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${userId}:`, error);
      throw error;
    }
  }

  static async deleteUser(userId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/${userId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${userId}:`, error);
      throw error;
    }
  }
}