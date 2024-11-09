import { apiRequest } from '../helpers/clienteAxios';
import { Cliente } from '../types/types';

export class ClienteService {
    static async getAll(anulados: boolean) {
        try {
            const token = localStorage.getItem('token');
            const response = await apiRequest.post('/clientes', { anulados }, {
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
            const response = await apiRequest.get(`/clientes/${id}`, {
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
                email: data.email,
                nacionalidad: data.nacionalidad,
                activo: true
            };
            const response = await apiRequest.post('/clientes/store', newData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creando cliente:', error);
            throw error;
        }
    }

    static async createCliente(data: Cliente) {
        try {
            const newData = {
                nombre: data.nombre,
                tipo_documento: data.tipoDocumento,
                num_documento: data.numeroDocumento,
                telefono: data.telefono,
                direccion: data.direccion,
                email: data.email,
                nacionalidad: data.nacionalidad,
                activo: true
            };
            const response = await apiRequest.post('/reservacionOnline/registrarCliente', newData);
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
                email: data.email,
                nacionalidad: data.nacionalidad,
                activo: data.activo
            };
            const token = localStorage.getItem('token');
            const response = await apiRequest.put(`/clientes/update/${id}`, updateData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
            const response = await apiRequest.put(`/clientes/updateActivo/${id}`, {}, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
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
            const response = await apiRequest.delete(`/clientes/delete/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            throw error;
        }
    }
}
