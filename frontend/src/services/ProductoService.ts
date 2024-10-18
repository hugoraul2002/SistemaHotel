import { apiRequest } from '../helpers/clienteAxios';
import { Producto } from '../types/types';
import { me } from './AuthService';
import { fechaActual } from '../helpers/formatDate';

export class ProductoService {
    static async getAll(anulado: boolean) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.post('/productos', { anulado }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getRegistrosDropDown() {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get('/productos/getRegistrosDropDown', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getProductoById(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.get(`/productos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    static async createProducto(producto: Producto) {
        const token = localStorage.getItem('token');
        const user = await me();
        try {
            const newProducto = {
                ...producto,
                fechaIngreso: fechaActual(),
                userId: user.id
            };
            const response = await apiRequest.post('/productos/store', newProducto, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async updateProducto(producto: Producto) {
        try {
            const token = localStorage.getItem('token');
            const user = await me();
            const data = { ...producto, userId: user.id, fecha: fechaActual() };
            const response = await apiRequest.put(`/productos/update/${producto.id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async updateActivo(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.put(`/productos/updateActivo/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async reporteHojaVida(data: any) {
        const token = localStorage.getItem('token');
        try {
            const response = await apiRequest.post('/productos/reporteHojaVida', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error querying product:', error);
            throw error;
        }
    }
}
