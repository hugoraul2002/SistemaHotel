import { apiRequest } from '../helpers/clienteAxios';
import { DetalleHospedaje, DetalleHospedajeFactura } from '../types/types';
import { me } from './AuthService';
import { fechaActual } from '../helpers/formatDate';

const getDetallesByHospedaje = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiRequest.get<DetalleHospedajeFactura[]>(`/detalleHospedajes/hospedaje/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching detalles:', error);
        throw error;
    }
};

const create = async (detalle: DetalleHospedaje, observaciones: string) => {
    try {
        const token = localStorage.getItem('token');
        const user = await me();
        const data = { ...detalle, userId: user.id, fecha: fechaActual(), observaciones };
        const response = await apiRequest.post<DetalleHospedaje>(`/detalleHospedajes/store`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating detalle:', error);
        throw error;
    }
};

const deleteDetalle = async (id: number, observaciones: string) => {
    try {
        const token = localStorage.getItem('token');
        const user = await me();
        const data = { id, userId: user.id, fecha: fechaActual(), observaciones };
        const response = await apiRequest.post(`/detalleHospedajes/delete`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting detalle:', error);
        throw error;
    }
};

export { getDetallesByHospedaje, create, deleteDetalle };
