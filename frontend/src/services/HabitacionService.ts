import axios from 'axios';
import { Habitacion } from '../types/types';

const API_URL = 'http://localhost:3333/habitaciones'; 

export class HabitacionService {
    static async getAll() {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/`,{
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        return response.data;
        } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
        }
    }

    static async getById(id: number) {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`,{
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        return response.data;
        } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
        }
    }

    static async create(data: Habitacion) {
        try {
        const token = localStorage.getItem('token');
        const newData = {
            nombre: data.nombre,
            precio: data.precio,
            estado: data.estado,
            nivelId: data.nivel.id,
            claseHabitacionId: data.claseHabitacion.id,
            anulado:false
        }
        const response = await axios.post(`${API_URL}/store`, newData,{
            headers: { 'Authorization': `Bearer ${token}` ,
            'Content-Type': 'application/json'} 
        });
        return response.data;
        } catch (error) {
        console.error('Error creating user:', error);
        throw error;
        }
    }

    static async update(id: number, data: Habitacion) {
        try {
            const updateData = {
                nombre: data.nombre,
                precio: data.precio,
                estado: data.estado,
                nivelId: data.nivel.id,
                claseHabitacionId: data.claseHabitacion.id,
                anulado:false
            }
            console.log(updateData);
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/update/${id}`, updateData,{
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        return response.data;
        } catch (error) {
        console.error('Error updating user:', error);
        throw error;
        }
    }

    static async delete(id: number) {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${id}`,{
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        return response.data;
        } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
        }
    }

    static async updateAnulado(id: number, data: { anulado: boolean }) {
        try {
            console.log(data, id);
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/updateAnulado/${id}`, data,{
            headers: { 'Authorization': `Bearer ${token}` ,
            'Content-Type': 'application/json'} 
        });
        return response.data;
        } catch (error) {
        console.error('Error updating user:', error);
        throw error;
        }
    }
}