import React, { useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../types/types';

export default function Barra({ visible, setVisible }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<Usuario>({ id: 0, full_name: '', email: '', password: '', rol:{id:0, nombre:''} });

    const customIcons = (
        <>
            <button className="p-sidebar-icon p-link mr-2">
                <span className="pi pi-search" />
            </button>
        </>
    );

    const customHeader = (
        <div className="flex align-items-center gap-2">
            <span className="font-bold">Bienvenido {user && user.full_name.split(' ')[0]}</span>
        </div>
    );

    const navegar = (ruta: string): void => {
        setVisible(false);
        navigate(ruta);
    }

    const items = [
        { label: 'Clientes', icon: 'pi pi-users' },
        { label: 'Reservaciones', icon: 'pi pi-calendar' },
        {
            label: 'Mantenimientos', icon: 'pi pi-chart-line', items: [
                { label: 'Niveles', icon: 'pi pi-file', command: () => navegar('/niveles') },
                { label: 'Clases de habitación', icon: 'pi pi-file', command: () => navegar('/claseshabitacion') },
                { label: 'Habitaciones', icon: 'pi pi-file', command: () => navegar('/habitaciones') }
            ]
        },
        { label: 'Usuarios', icon: 'pi pi-user', command: () => navegar('/usuarios') },
        { label: 'Salir', icon: 'pi pi-sign-out', command: () => setVisible(false) }
    ];

    useEffect(() => {
        const user = localStorage.getItem('auth');
        if (user) {
            const userJson = JSON.parse(user);
            const usuarioRecuperado: Usuario = { id: userJson.id, full_name: userJson.fullName, email: userJson.email, password: '', rol: { id: userJson.rol.id, nombre: userJson.rol.nombre } };
            setUser(usuarioRecuperado);
        }
    }, []);

    const filteredItems = items.filter(item => {
        if (item.label === 'Usuarios' || item.label === 'Mantenimientos') {
            return user.rol.nombre === 'ADMIN';
        }
        return true;
    });

    return (
        <div className="card flex justify-content-center">
            <Sidebar header={customHeader} visible={visible} onHide={() => setVisible(false)} icons={customIcons}>
                <Menu model={filteredItems} className='w-full md:w-15rem h-full' />
            </Sidebar>
        </div>
    );
}
