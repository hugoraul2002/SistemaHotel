import axios from 'axios';
import { DetalleHospedaje } from '../types/types';

const API_URL = 'http://localhost:3333/detalleHospedajes';

const getDetallesByHospedaje = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DetalleHospedaje[]>(`${API_URL}/hospedaje/${id}`,{
            headers: { 'Authorization': `Bearer ${token}` }

    });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
};

const create = async (data: DetalleHospedaje) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post<DetalleHospedaje>(`/${API_URL}/store/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

export { getDetallesByHospedaje, create };
