import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import imageUrl from '../../assets/recepcion.jpg';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';
import { AxiosError } from 'axios';
import { Toast } from 'primereact/toast';

const LoginComponent: React.FC = () => {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const showSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado.', life: 3000   });
      }

    const validateUsername = (value: string) => {
        if (!value.includes('@') || !value.includes('.')) {
            setError('Correo inválido.');
        } else {
            setError('');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
        validateUsername(value);
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            if (response.token) {
                showSuccess();
                localStorage.setItem('token', response.token);
                navigate('/Inicio');
            }
        } catch (err) {
            const error = err as AxiosError;
            if (error.response && error.response.status === 401) {
                setError((error.response.data as { message: string }).message);
            } else {
                setError('Error al iniciar sesión.');
            }
        }
    };

    return (
        <div className="py-16">
            <Toast ref={toast} />
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/2 bg-cover" style={{ backgroundImage: `url(${imageUrl})`, minHeight: '400px' }}></div>
                <div className="w-full p-8 lg:w-1/2">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center">Hotel Margarita</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                            <p className="text-xs text-center text-gray-500 uppercase">¡Bienvenido!</p>
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Email</label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text"
                                value={email}
                                onChange={handleChange}
                            />
                            <div className="min-h-[20px]">
                                <p className="text-red-500 text-xs italic mt-0.5">{error}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <button className="text-xs text-gray-500">¿Olvidó su contraseña?</button>
                            </div>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-8">
                            <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" type="submit">Iniciar sesión</button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4"></span>
                            <button className="text-xs text-gray-500 uppercase hover:bg-gray-500 hover:text-white rounded p-2" onClick={()=>navigate('/register')}>o registrate</button>
                            <span className="border-b w-1/5 md:w-1/4"></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;