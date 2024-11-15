import axios, { AxiosError } from 'axios';
import { Cliente, Habitacion } from '../types/types';
import dayjs from 'dayjs';
import { fechaActual } from '../helpers/formatDate';
import { apiRequest } from '../helpers/clienteAxios'; 

const CLAVE_SECRETA = 'sk_live_jbbm0z4KaDr7oDEKhMFj2UgQeCS2eVk9MopgPORZIcwBQ2UDsnedR7Dt8';
const CLAVE_PUBLICA = 'pk_live_hCSavwsYtq3Hh1b1bAepNIYpDdQ9Do5sTRyJH0r5WmdQHVC4nMifZmJNM';

const registrarEnlacePago = async (habitacion: Habitacion, cliente: Cliente, idPago: number, total: number) => {
  try {
    const data = JSON.stringify({
      items: [
        {
          name: "Hospedaje de habitación " + habitacion.nombre,
          currency: "GTQ",
          amount_in_cents: total * 100,          
          image_url: 'https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0',
          quantity: 1
        }
      ],
      success_url: `https://hotelmargarita.online/checkTransaction/${idPago}`,
      // success_url: `http://localhost:3333/checkTransaction/${idPago}`,
      user_id: cliente.numeroDocumento,
      metadata: {
        cliente: cliente.nombre,
        tipo_documento: cliente.tipoDocumento,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      }
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://app.recurrente.com/api/checkouts',
      headers: {
        'X-PUBLIC-KEY': CLAVE_PUBLICA,
        'X-SECRET-KEY': CLAVE_SECRETA,
        'Content-Type': 'application/json'
      },
      data: data
    };
    console.log(data);
    const response = await axios(config);    
    const safeIdHash = idPago.toString().replace(/\//g, '_').replace(/\+/g, '-');
    await apiRequest.put(`/reservacionOnline/updatePago/${safeIdHash}`, { checkoutId: response.data.id });

    return response.data;
  } catch (error) {
    console.error("Error al registrar enlace de pago:", error);
    throw error;
  }
};

const createCliente = async (data: Cliente) => {
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
    const response = await apiRequest.post(`/reservacionOnline/registrarCliente`, newData);
    return response.data;
  } catch (error) {
    console.error('Error creando cliente:', error);
    throw error;
  }
};

const createRegistroPago = async (data: any) => {
  try {
    const formatDateTime = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };
    const newData = {
      checkoutId: data.checkoutId,
      fechaRegistro: formatDateTime(dayjs().subtract(6, 'hours').toDate()),
      fechaPagado: null,
      estado: data.estado,
      descripcion: data.descripcion,
      reservacionId: data.reservacionId
    };
    
    const response = await apiRequest.post(`/reservacionOnline/registrarPago`, newData);
    return response.data;
  } catch (error) {
    console.error('Error creando registro de pago:', error);
    throw error;
  }
};

const updateCheckoutId = async (checkoutId: number) => {
  try {
    const data = {
      checkoutId
    };
    const response = await apiRequest.put(`/reservacionOnline/updatePago`, data);
    return response.data;
  } catch (error) {
    console.error('Error actualizando id checkout:', error);
    throw error;
  }
};

const verificarTransaccion = async (data: { idHash: string }) => {
  try {
    const newData = { idHash: data.idHash, fechaPagado: fechaActual() };
    const response = await apiRequest.post(`/reservacionOnline/verificarTransaccion`, newData);
    return response.data;
  } catch (error) {
    console.error('Error al verificar transacción:', error);
    throw error;
  }
};

const createReservacion = async (data: any) => {
  try {
    const formatDateTime = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const newData = { 
      habitacionId: data.habitacion.id,
      clienteId: data.clienteId,
      userId: null,
      total: data.total,
      estado: data.estado,
      fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6, 'hours').toDate()),
      fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6, 'hours').toDate()),
      fechaRegistro: formatDateTime(dayjs().subtract(6, 'hours').toDate()),
      numeroAdultos: data.numeroAdultos,
      numeroNinos: data.numeroNinos,
      observaciones: data.observaciones,
      anulado: false
    };

    const response = await apiRequest.post(`/reservacionOnline/registrarReservacion`, newData, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response && error.response.status === 409) {
      console.error('Error creando reservación:', (error.response.data as any).message);
    } 
    console.error('Error creando reservación:', error);
    throw error;  
  }
}

export { registrarEnlacePago, createCliente, createReservacion, createRegistroPago, updateCheckoutId, verificarTransaccion };
