import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
export default function Barra({ visible, setVisible }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const customIcons = (
        <>
            <button className="p-sidebar-icon p-link mr-2">
                <span className="pi pi-search" />
            </button>
        </>
    );

    const customHeader = (
        <div className="flex align-items-center gap-2">
            {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
            <span className="font-bold">Hugo</span>
        </div>
    );

    const navegar = (ruta: string): void => {
        setVisible(false);
        navigate(ruta);
    }

    const items = [
        { label: 'Clientes', icon: 'pi pi-users' },
        { label: 'Reservaciones', icon: 'pi pi-calendar' },
        { label: 'Recepción', icon: 'pi pi-sign-in' },
        { label: 'Salidas', icon: 'pi pi-sign-out' },
        { label: 'Facturación', icon: 'pi pi-file' },
        { label: 'Gastos', icon: 'pi pi-money-bill' },
        { label: 'Cajas', icon: 'pi pi-box' },
        {
            label: 'Reportes', icon: 'pi pi-chart-line', items: [
                { label: 'Reporte de Ventas', icon: 'pi pi-file' },
                { label: 'Reporte de Gastos', icon: 'pi pi-file' }
            ]
        },
        { label: 'Usuarios', icon: 'pi pi-user',command: () => navegar('/usuarios')},
        { label: 'Configuración', icon: 'pi pi-cog' },
        { label: 'Salir', icon: 'pi pi-sign-out' }
    ];

    return (
        <div className="card flex justify-content-center">
            <Sidebar header={customHeader} visible={visible} onHide={() => setVisible(false)} icons={customIcons}>
                <Menu model={items}  className='w-full md:w-15rem'/>
            </Sidebar>
        </div>
    );
}
