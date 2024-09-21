import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { useNavigate } from 'react-router-dom';

import { MenuItem } from 'primereact/menuitem';
import { useUser } from '../hooks/UserContext';


export default function Barra({ visible, setVisible }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const { user } = useUser();

    const customIcons = (
        <>
            <button className="p-sidebar-icon p-link mr-2">
                {/* <span className="pi pi-search" /> */}
            </button>
        </>
    );

    const customHeader = (
        <div className="flex align-items-center gap-2">
            <span className="font-bold">{user ? `Bienvenido ${user.full_name.split(' ')[0]}` : 'Bienvenido'}</span>
        </div>
    );

    const navegar = (ruta: string): void => {
        setVisible(false);
        navigate(ruta);
    };

    const itemRenderer = (item:MenuItem ) => (
        <a className="flex align-items-center px-3 py-2 cursor-pointer" >
            <span className={`${item.icon} text-sky-400`} />
            <span className={`mx-2 ${item.items && 'font-semibold'}`}>{item.label}</span>
            {/* {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>} */}
        </a>
    );

    const items: MenuItem[] = [
        {
            label: 'Reservaciones', 
            icon: 'pi pi-calendar', 
            template: itemRenderer,
            items: [
                { label: 'Clientes', icon: 'pi pi-users', command: () => navegar('/clientes'), template: itemRenderer },
                { label: 'Reservaciones', icon: 'pi pi-calendar', command: () => navegar('/reservaciones'), template: itemRenderer }
            ]
        },
        { 
            label: 'Check In', 
            icon: 'pi pi-home', 
            command: () => navegar('/checkin'), 
            template: itemRenderer 
        },
        { 
            label: 'Cajas', 
            icon: 'pi pi-money-bill', 
            command: () => navegar('/cajas'), 
            template: itemRenderer 
        },
        { 
            label: 'Check Out', 
            icon: 'pi pi-sign-out', 
            command: () => navegar('/checkout'), 
            template: itemRenderer 
        },
        {
            label: 'Catálogos', 
            icon: 'pi pi-chart-line', 
            template: itemRenderer,
            items: [
                { label: 'Niveles', icon: 'pi pi-file', command: () => navegar('/niveles'), template: itemRenderer },
                { label: 'Clases de habitación', icon: 'pi pi-file', command: () => navegar('/claseshabitacion'), template: itemRenderer },
                { label: 'Habitaciones', icon: 'pi pi-file', command: () => navegar('/habitaciones'), template: itemRenderer }
            ]
        },
        {
            label: 'Gastos', 
            icon: 'pi pi-chart-line', 
            template: itemRenderer,
            items: [
                { label: 'Tipos de gastos', icon: 'pi pi-file', command: () => navegar('/tiposgastos'), template: itemRenderer },
                { label: 'Proveedores', icon: 'pi pi-file', command: () => navegar('/proveedores'), template: itemRenderer },
                { label: 'Gastos', icon: 'pi pi-file', command: () => navegar('/gastos'), template: itemRenderer }
            ]
        },
        { 
            label: 'Usuarios', 
            icon: 'pi pi-user', 
            command: () => navegar('/usuarios'), 
            template: itemRenderer 
        },
        { 
            label: 'Productos', 
            icon: 'pi pi-shopping-cart', 
            command: () => navegar('/productos'), 
            template: itemRenderer 
        },
        {
            label: 'Reportes', 
            icon: 'pi pi-chart-line', 
            template: itemRenderer,
            items: [
                { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => navegar('/inicio'), template: itemRenderer },
                { label: 'Reporte de Facturación', icon: 'pi pi-shopping-cart', command: () => navegar('/reporteFacturacion'), template: itemRenderer },
                { label: 'Reporte de Gastos', icon: 'pi pi-shopping-cart', command: () => navegar('/reporteGastos'), template: itemRenderer }
            ]
        },
    ];


    const filteredItems = items.filter(item => {
        if (item.label === 'Usuarios' || item.label === 'Mantenimientos' || item.label === 'Reservaciones' || item.label === 'Clientes' || item.label === 'Catálogos' || item.label === 'Productos'   || item.label === 'Check In' || item.label === 'Check Out' || item.label === 'Cajas' || item.label === 'Gastos' || item.label === 'Dashboard') {
            return user?.rol.nombre != 'CLIENTE';
        }
        return true;
    });

    return (
        <div className="card flex justify-content-center">
            <Sidebar header={customHeader} visible={visible} onHide={() => setVisible(false)} icons={customIcons}>
                <PanelMenu model={filteredItems} className='w-full md:w-15rem h-full' />
            </Sidebar>
        </div>
    );
}