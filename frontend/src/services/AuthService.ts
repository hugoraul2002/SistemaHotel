import axios from 'axios';
import { Usuario, UserCliente } from '../types/types';
import { AuthModulo } from '../types/types';
const API_URL = 'http://localhost:3333/auth';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: Usuario;
}

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};

const registerCliente = async (data: UserCliente): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/registerCliente`, data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('auth', JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('auth', JSON.stringify(response.data.user));
    window.dispatchEvent(new Event('storage'));  // Notificar el cambio en el token
  }
  return response.data;
};

const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontro token.');

  await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
  localStorage.removeItem('auth');
  window.dispatchEvent(new Event('storage'));  // Notificar el cambio en el token
};

const me = async (): Promise<Usuario> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontro token.');
  
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status !== 200) throw new Error('No se pudo obtener el usuario.');
    const user: Usuario = {
      id: response.data.user.id,
      full_name: response.data.user.fullName,
      email: response.data.user.email,
      password: '',
      rol: {
        id: response.data.user.rol.id,
        nombre: response.data.user.rol.nombre
      }
    };
    return user;    
  } catch (error) {
    console.error('Error auth:', error);
    throw error;
  }
};

const authModulo = async (modulo:string ): Promise<AuthModulo> => {
  try {
    const response = await axios.post<AuthModulo>(`${API_URL}/authModulo`, {modulo},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;    
  } catch (error) {
    console.error('Error auth:', error);
    throw error;
  }
};

export { register, login, logout, me, registerCliente, authModulo };
