import axios from 'axios';
import { Producto } from '../types/types';
import dayjs from 'dayjs';
const API_URL = 'http://localhost:3333/productos';

export class ProductoService {
    static async getAll(anulado:boolean) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(API_URL,{anulado}, { headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getProductoById(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    static async createProducto(producto: Producto) {
        const token = localStorage.getItem('token');
        const formatDateTime = (date: Date) => {
            return date.toISOString().slice(0, 19).replace('T', ' ');
          };
        try {
            const newProducto  = {
                ...producto,
                fechaIngreso: formatDateTime(dayjs(producto.fechaIngreso).subtract(6,'hours').toDate())
            }
            console.log(newProducto);
            const response = await axios.post(API_URL+"/store", newProducto,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async updateProducto(producto: Producto) {
        try {
            const token = localStorage.getItem('token');
            console.log(producto);
            const response = await axios.put(`${API_URL}/update/${producto.id}`, producto, { headers: { 'Authorization': `Bearer ${token}` } 
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
            const response = await axios.put(`${API_URL}/updateActivo/${id}`, {},{ headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
}
