import axios from 'axios';

const API_URL = 'http://localhost:3333/usuarios'; 

export class UsuarioService {
  static async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async createUser(userData: { full_name: string; email: string; password: string }) {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(userId: number) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${userId}:`, error);
      throw error;
    }
  }

  static async updateUser(userId: number, userData: { full_name?: string; email?: string; password?: string }) {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${userId}:`, error);
      throw error;
    }
  }

  static async deleteUser(userId: number) {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${userId}:`, error);
      throw error;
    }
  }
}
