import axios from 'axios';
import { Producto } from '../types/types';
import dayjs from 'dayjs';
const API_URL = 'http://localhost:3333/productos';

export class ProductoService {
    static async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getProductoById(id: number) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    static async createProducto(producto: Producto) {
        const formatDateTime = (date: Date) => {
            return date.toISOString().slice(0, 19).replace('T', ' ');
          };
        try {
            const newProducto  = {
                ...producto,
                fechaIngreso: formatDateTime(dayjs(producto.fechaIngreso).toDate())
            }
            console.log(newProducto);
            const response = await axios.post(API_URL+"/store", newProducto);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async updateProducto(producto: Producto) {
        try {
            const response = await axios.put(`${API_URL}/${producto.id}`, producto);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async updateActivo(id: number) {
        try {
            const response = await axios.put(`${API_URL}/anulado/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
}
