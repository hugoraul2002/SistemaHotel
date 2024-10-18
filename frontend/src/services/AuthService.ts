import { Usuario, UserCliente } from '../types/types';
import { AuthModulo } from '../types/types';
import { apiRequest } from '../helpers/clienteAxios';

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
  const response = await apiRequest.post<AuthResponse>('/auth/register', data);
  return response.data;
};

const registerCliente = async (data: UserCliente): Promise<AuthResponse> => {
  const response = await apiRequest.post<AuthResponse>('/auth/registerCliente', data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('auth', JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiRequest.post<AuthResponse>('/auth/login', data);
  if (response.status === 200) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('auth', JSON.stringify(response.data.user));
    window.dispatchEvent(new Event('storage'));  // Notificar el cambio en el token
  }
  return response.data;
};

const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró token.');

  await apiRequest.post('/auth/logout', {}, {
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
    if (!token) throw new Error('No se encontró token.');

    const response = await apiRequest.get('/auth/me', {
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

const authModulo = async (modulo: string): Promise<AuthModulo> => {
  try {
    const response = await apiRequest.post<AuthModulo>('/auth/authModulo', { modulo }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;    
  } catch (error) {
    console.error('Error auth:', error);
    throw error;
  }
};

export { register, login, logout, me, registerCliente, authModulo };
