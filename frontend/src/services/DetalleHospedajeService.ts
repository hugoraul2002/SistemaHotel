import axios from 'axios';
import { DetalleHospedaje, DetalleHospedajeFactura } from '../types/types';
import { me } from './AuthService';
import { fechaActual } from '../helpers/formatDate';

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

const create = async (detalle: DetalleHospedaje, observaciones: string) => {
    try {        
        const token = localStorage.getItem('token');
        const user = await me();
        const data = { ...detalle, userId: user.id, fecha:fechaActual() ,  observaciones };
        const response = await axios.post<DetalleHospedaje>(`${API_URL}/store/`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        console.error('Error creating user:', error);
    }
};

const deleteDetalle = async (id: number, observaciones: string) => {
    try {
        const token = localStorage.getItem('token');
        const user = await me();  
        const data = { id, userId: user.id, fecha: fechaActual() ,observaciones};      
        const response = await axios.post(`${API_URL}/delete`,data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
export { getDetallesByHospedaje, create, deleteDetalle };   
