import { apiRequest } from '../helpers/clienteAxios'; 
import { OpcionPago } from '../types/types';
import dayjs from 'dayjs';

const getAllPagos = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get<OpcionPago[]>('/opcionPago', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

const createOpcionPago = async (data: OpcionPago) => {
    try {
        const token = localStorage.getItem('token');
        const dataWithDate = { ...data, fecha: dayjs(data.fecha).subtract(6, 'hour').format('YYYY-MM-DD') };
        const response = await apiRequest.post<OpcionPago>('/opcionPago/store', dataWithDate, {    
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

const getOpcionPagoById = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get<OpcionPago>(`/opcionPago/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

const getOpcionPagoByDocumento = async (id: number, tipoDocumento: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get<any>(`/opcionPago/documento/${tipoDocumento}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export { getAllPagos, createOpcionPago, getOpcionPagoById, getOpcionPagoByDocumento };
