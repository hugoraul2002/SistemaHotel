import { apiRequest } from '../helpers/clienteAxios';
import { Habitacion } from '../types/types';

export class HabitacionService {
    static async getAll() {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get('/habitaciones/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching habitaciones:', error);
            throw error;
        }
    }

    static async getRecepcion(idNivel: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/habitaciones/recepcion/${idNivel}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recepcion:', error);
            throw error;
        }
    }

    static async getHabitacionesSalida(idNivel: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/habitaciones/salidas/${idNivel}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching habitaciones salida:', error);
            throw error;
        }
    }

    static async getReservacionProxima(idHabitacion: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/habitaciones/getReservacionProxima/${idHabitacion}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservacion proxima:', error);
            throw error;
        }
    }

    static async getById(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/habitaciones/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching habitacion:', error);
            throw error;
        }
    }

    static async create(data: Habitacion) {
        try {
            const token = localStorage.getItem('token');
            const newData = {
                nombre: data.nombre,
                precio: data.precio,
                tarifa: data.tarifa,
                estado: data.estado,
                nivelId: data.nivel.id,
                claseHabitacionId: data.claseHabitacion.id,
                numeroPersonas: data.numeroPersonas,
                anulado: false
            };
            const response = await apiRequest.post('/habitaciones/store', newData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating habitacion:', error);
            throw error;
        }
    }

    static async getHabitacionesDisponibles(data: any) {
        try {
            const response = await apiRequest.post('/reservacionOnline/habitacionesDisponibles', data, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching habitaciones disponibles:', error);
            throw error;
        }
    }

    static async update(id: number, data: Habitacion) {
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                nombre: data.nombre,
                precio: data.precio,
                tarifa: data.tarifa,
                estado: data.estado,
                nivelId: data.nivel.id,
                claseHabitacionId: data.claseHabitacion.id,
                numeroPersonas: data.numeroPersonas,
                anulado: false
            };
            const response = await apiRequest.put(`/habitaciones/update/${id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating habitacion:', error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.delete(`/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting habitacion:', error);
            throw error;
        }
    }

    static async updateAnulado(id: number, data: { anulado: boolean }) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.put(`/habitaciones/updateAnulado/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating anulado:', error);
            throw error;
        }
    }
}
