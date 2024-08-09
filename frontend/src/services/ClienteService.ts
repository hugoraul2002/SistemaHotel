import axios from 'axios';
import { Cliente } from '../types/types';

const API_URL = 'http://localhost:3333/clientes'; 

export class ClienteService {
    static async getAll() {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/`,{
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        return response.data;
        } catch (error) {   
        console.error('Error consultando clientes:', error);
        throw error;
        }
    }

    static async getById(id: number) {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`,{
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        return response.data;
        } catch (error) {
        console.error('Error consultando cliente:', error);
        throw error;
        }
    }

    static async create(data: Cliente) {
        try {
        const token = localStorage.getItem('token');
        const newData = {
            nombre: data.nombre,
            tipo_documento: data.tipoDocumento,
            num_documento: data.numeroDocumento,
            telefono: data.telefono,
            direccion: data.direccion,
            activo:true
        }
        const response = await axios.post(`${API_URL}/store`, newData,{
            headers: { 'Authorization': `Bearer ${token}` ,
            'Content-Type': 'application/json'} 
        });
        return response.data;
        } catch (error) {
        console.error('Error creando cliente:', error);
        throw error;
        }
    }

    static async update(id: number, data: Cliente) {
        try {
            const updateData = {
                nombre: data.nombre,
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
                telefono: data.telefono,
                direccion: data.direccion,
                activo: data.activo
            }
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/update/${id}`, updateData,{
                headers: { 'Authorization': `Bearer ${token}` ,
                'Content-Type': 'application/json'} 
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando cliente:', error);
            throw error;
        }
    }
    static async updateActivo(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/updateActivo/${id}`,{},{
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando estado de cliente:', error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/delete/${id}`,{
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            throw error;
        }
    }


}