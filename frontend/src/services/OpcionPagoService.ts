import axios from 'axios';
import { OpcionPago } from '../types/types';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:3333/opcionPago';

const getAllPagos = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<OpcionPago[]>(`${API_URL}`, {
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
        const response = await axios.post<OpcionPago>(`${API_URL}/store`, dataWithDate,{    
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
        const response = await axios.get<OpcionPago>(`${API_URL}/${id}`, {
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
        const response = await axios.get<any>(`${API_URL}/documento/${tipoDocumento}/${id}`, {
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

export { getAllPagos, createOpcionPago, getOpcionPagoById , getOpcionPagoByDocumento}