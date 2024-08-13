import axios, { AxiosError } from 'axios';
import { Reservacion } from '../types/types';
import dayjs from 'dayjs';
const API_URL = 'http://localhost:3333/reservaciones'; 

export class ReservacionService {
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

    static async create(data: Reservacion) {
        try {
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem('auth')!);
      
          const formatDateTime = (date: Date) => {
            return date.toISOString().slice(0, 19).replace('T', ' ');
          };
      
          const newData = { 
            habitacionId: data.habitacion.id,
            clienteId: data.cliente.id,
            userId: user.id,
            total: data.total,
            estado: data.estado,
            fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6,'hours').toDate()),
            fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6,'hours').toDate()),
            fechaRegistro: formatDateTime(dayjs().subtract(6,'hours').toDate()),
            numeroAdultos: data.numeroAdultos,
            numeroNinos: data.numeroNinos,
            observaciones: data.observaciones,
            anulado: false
          };

          const response = await axios.post(`${API_URL}/store`, newData, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error.response && error.response.status === 409) {
              console.error('Error creating reservation:', (error.response.data as any).message);
            } 
          console.error('Error creating reservation:', error);
          throw error;
            
        }
      }
      

    static async update(id: number, data: Reservacion) {
        try {
            const updateData = {
                fechaInicio: data.fechaInicio,
                fechaFin: data.fechaFin,
                clienteId: data.cliente.id,
                habitacionId: data.habitacion.id,                
                anulado:false
            }
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/update/${id}`, updateData,{
                headers: { 'Authorization': `Bearer ${token}` ,
                'Content-Type': 'application/json'} 
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async updateActivo(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/updateActivo/${id}`,{
                headers: { 'Authorization': `Bearer ${token}` ,
                'Content-Type': 'application/json'} 
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
}