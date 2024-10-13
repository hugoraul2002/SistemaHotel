import axios, { AxiosError } from 'axios';
import { Cliente, Habitacion } from '../types/types';
import dayjs from 'dayjs';
import { fechaActual } from '../helpers/formatDate';

const CLAVE_SECRETA = 'sk_live_jbbm0z4KaDr7oDEKhMFj2UgQeCS2eVk9MopgPORZIcwBQ2UDsnedR7Dt8';
const CLAVE_PUBLICA = 'pk_live_hCSavwsYtq3Hh1b1bAepNIYpDdQ9Do5sTRyJH0r5WmdQHVC4nMifZmJNM';
const API_URL = 'http://localhost:3333/reservacionOnline';
const registrarEnlacePago = async (habitacion: Habitacion, cliente: Cliente, idPago :number) => {
  try {
    // Construimos los datos para la petición
    const data = JSON.stringify({
      items: [
        {
          name: "Hospedaje de habitación " + habitacion.nombre,  // Nombre del producto
          currency: "GTQ",  // Moneda
        //   amount_in_cents: habitacion.precio * 100,  // Precio en centavos
          amount_in_cents: 500,  // Precio en centavos
          image_url: 'https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0',  // URL de la imagen 
          quantity: 1  // Cantidad
        }
      ],
      success_url: "http://localhost:5173/confirmaReservacion/" + idPago,  // URL de éxito
      user_id: cliente.numeroDocumento,  // Documento del cliente como ID del usuario
      metadata: {
        cliente: cliente.nombre,
        tipo_documento: cliente.tipoDocumento,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      }
    });

    // Configuración del request
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
    // Realizar la petición
    const response = await axios(config);    
    await axios.put(`${API_URL}/updatePago/${idPago}`, {checkoutId: response.data.id});

    return response.data;  // Devolvemos la respuesta (enlace de pago)
  } catch (error) {
    console.error("Error al registrar enlace de pago:", error);
    throw error;  // Lanzamos el error para manejarlo en el componente
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
      activo:true
  }
  const response = await axios.post(`${API_URL}/registrarCliente`, newData);
  return response.data;
  } catch (error) {
  console.error('Error creando cliente:', error);
  throw error;
  }
}

const createRegistroPago = async (data: any) => {
  try {
    const formatDateTime = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };
    const newData = {
      checkoutId: data.checkoutId,
      fechaRegistro: formatDateTime(dayjs().subtract(6,'hours').toDate()),
      fechaPagado: null,
      estado: data.estado,
      descripcion:data.descripcion,
      reservacionId: data.reservacionId
    }
    
  const response = await axios.post(`${API_URL}/registrarPago`, newData);
  return response.data;
  } catch (error) {
  console.error('Error creando cliente:', error);
  throw error;
  }
}

const updateCheckoutId = async (checkoutId:number) => {
  try {
    const data={
      checkoutId
    }
  const response = await axios.put(`${API_URL}/updatePago`, data);
  return response.data;
  } catch (error) {
  console.error('Error actualizando id checkout:', error);
  throw error;
  }
}

const createReservacion = async (data: any) => {
  try {

    const formatDateTime = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const newData = { 
      habitacionId: data.habitacion.id,
      clienteId:data.clienteId,
      userId: null,
      total: data.total,
      estado: data.estado,
      fechaInicio: formatDateTime(dayjs(data.fechaInicio).subtract(6,'hours').toDate()),
      fechaFin: formatDateTime(dayjs(data.fechaFin).subtract(6,'hours').toDate()),
      fechaRegistro: formatDateTime(dayjs().subtract(6,'hours').toDate()),
      numeroAdultos: data.numeroAdultos,
      numeroNinos: data.numeroNinos,
      observaciones: data.observaciones,
      anulado: false
    };

    const response = await axios.post(`${API_URL}/registrarReservacion`, newData, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 409) {
        console.error('Error creating reservation:', (error.response.data as any).message);
      } 
    console.error('Error creating reservation:', error);
    throw error;
      
  }
}

export { registrarEnlacePago, createCliente,createReservacion , createRegistroPago ,updateCheckoutId};
