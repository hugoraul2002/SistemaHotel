import { AxiosError } from 'axios';
import { apiRequest } from '../helpers/clienteAxios';
import { Reservacion } from '../types/types';
import dayjs from 'dayjs';

export class ReservacionService {
    static async getAll() {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get('/reservaciones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
    }

    static async getById(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/reservaciones/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservation:', error);
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
                fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6, 'hours').toDate()),
                fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6, 'hours').toDate()),
                fechaRegistro: formatDateTime(dayjs().subtract(6, 'hours').toDate()),
                numeroAdultos: data.numeroAdultos,
                numeroNinos: data.numeroNinos,
                observaciones: data.observaciones,
                anulado: false
            };

            const response = await apiRequest.post('/reservaciones/store', newData, {
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
            const formatDateTime = (date: Date) => {
                return date.toISOString().slice(0, 19).replace('T', ' ');
            };

            const updateData = {
                fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6, 'hours').toDate()),
                fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6, 'hours').toDate()),
                clienteId: data.cliente.id,
                habitacionId: data.habitacion.id,
                total: data.total,
                observaciones: data.observaciones,
                numeroAdultos: data.numeroAdultos,
                numeroNinos: data.numeroNinos,
                anulado: false
            };
            const token = localStorage.getItem('token');
            const response = await apiRequest.put(`/reservaciones/update/${id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
    }

    static async updateAnulado(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.put(`/reservaciones/updateAnulado/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating reservation status:', error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.delete(`/reservaciones/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    }
}
