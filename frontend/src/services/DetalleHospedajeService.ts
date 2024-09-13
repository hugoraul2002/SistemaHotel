import axios from 'axios';
import { DetalleHospedaje, DetalleHospedajeFactura } from '../types/types';

const API_URL = 'http://localhost:3333/detalleHospedajes';

const getDetallesByHospedaje = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DetalleHospedajeFactura[]>(`${API_URL}/hospedaje/${id}`,{
            headers: { 'Authorization': `Bearer ${token}` }

    });
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
};

const create = async (data: DetalleHospedaje) => {
    try {
        console.log(data);
        const token = localStorage.getItem('token');
        const response = await axios.post<DetalleHospedaje>(`${API_URL}/store/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        console.error('Error creating user:', error);
    }
};

const deleteDetalle = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
export { getDetallesByHospedaje, create, deleteDetalle };   
