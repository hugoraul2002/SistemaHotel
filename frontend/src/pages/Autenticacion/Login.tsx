import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import imageUrl from '../../assets/recepcion.jpg';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';
import { AxiosError } from 'axios';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const LoginComponent: React.FC = () => {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const showSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso.', life: 3000 });
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
                setTimeout(() => {
                    navigate('/inicio');
                }, 1000);
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
            <Toast ref={toast} />
            <div className="flex  rounded-lg shadow-lg overflow-hidden w-full max-w-4xl sm:h-full">
                <div className="hidden lg:block lg:w-1/2 bg-cover" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                <Card className=" w-full p-8 lg:w-1/2 ">
                    <h2 className="text-2xl font-semibold text-center mb-4">Hotel Margarita</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                            <p className="text-xs text-center  uppercase">¡Bienvenido!</p>
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-bold mb-2 text-left">Email</label>
                            <InputText
                                className="w-full"
                                type="text"
                                value={email}
                                onChange={handleChange}
                            />
                            <div className="min-h-[20px]">
                                <p className="text-red-500 text-xs italic mt-0.5">{error}</p>
                            </div>
                        </div>
                        <div className="mt-4 w-full">

                            <label className="block text-sm font-bold mb-2">Contraseña</label>

                            <InputText
                                className="w-full"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-8">
                            <Button label="Iniciar sesión" className="w-full" severity='secondary' type="submit" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4"></span>
                            <Button label="o registrate" className=" p-button-sm text-xs uppercase hover:bg-gray-500 hover:text-white" outlined severity='secondary' onClick={() => navigate('/register')} />
                            <span className="border-b w-1/5 md:w-1/4"></span>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginComponent;
