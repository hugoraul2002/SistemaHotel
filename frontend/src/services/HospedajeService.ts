import { apiRequest } from '../helpers/clienteAxios'; 
import { Hospedaje } from '../types/types';
import dayjs from 'dayjs';

export class HospedajeService {
    static async getAll() {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get('/hospedajes', {
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
            const response = await apiRequest.get(`/hospedajes/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    static async getActivoByIdHabitacion(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/hospedajes/activo/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    static async create(data: Hospedaje) {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('auth')!);
            console.log(data);
            const formatDateTime = (date: Date) => {
                return date.toISOString().slice(0, 19).replace('T', ' ');
            };

            const newData = {
                habitacionId: data.habitacion.id,
                clienteId: data.cliente.id,
                userId: user.id,                        
                fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6, 'hours').toDate()),
                fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6, 'hours').toDate()),
                fechaRegistro: formatDateTime(dayjs().subtract(6, 'hours').toDate()),
                total: data.total,
                montoPenalidad: data.monto_penalidad,
            };

            let newData2 = {};
            if (data.reservacion) {
                newData2 = {
                    reservacionId: data.reservacion?.id,
                    ...newData
                };
            }

            console.log(newData);
            const response = await apiRequest.post(`/hospedajes/store`, data.reservacion ? newData2 : newData, {
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
}
