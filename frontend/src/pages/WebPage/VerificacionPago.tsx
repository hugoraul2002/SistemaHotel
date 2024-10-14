import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verificarTransaccion } from '../../services/PasarelaPagosService';
import { Reservacion } from '../../types/types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import dayjs from 'dayjs';
import { set } from 'react-hook-form';

interface transaccionResult {
    id: number;
    checkoutId: string;
    descripcion: string;
    reservacionId: number;
    fechaRegistro: Date;
    fechaPagado: Date;
    estado: string;
    reservacion: Reservacion;
}

export default function VerificacionPago() {
    const { idHash } = useParams();
    const [transaccion, setTransaccion] = React.useState<transaccionResult>();
    const toast = React.useRef<Toast>(null);
    const [success, setSuccess] = React.useState(false);
    useEffect(() => {
        const verificaTransaccion = async () => {
            try {
                if (idHash) {
                    const response = await verificarTransaccion({ idHash: idHash });
                    console.log(response);
                    if (response && response.success) {
                        setTransaccion(response.pago);
                        toast.current?.show({ severity: 'success', detail: 'Pago verificado correctamente', life: 3000 });
                        setSuccess(true);
                    } else {
                        toast.current?.show({ severity: 'error', detail: 'Error al verificar el pago', life: 3000 });
                        setSuccess(false);
                    }
                }                
            } catch (error) {
                setSuccess(false); 
                console.log(error);
            }
        };
        verificaTransaccion();
    }, [idHash]);

    if(!success) {
        return <div className="flex justify-center items-center h-screen">ERROR AL VERIFICAR EL PAGO...</div>;
    }

    if (!transaccion) {
        return <div className="flex justify-center items-center h-screen">Cargando información de la transacción...</div>;
    }

    const { reservacion, fechaPagado, estado } = transaccion;
    const { habitacion, cliente, total, fechaInicio, fechaFin } = reservacion;

    return (
        <div className="flex justify-center items-center h-screen">
            <Toast ref={toast} />
            <Card className="w-[400px] md:w-[600px] p-4 shadow-lg">
                <h2 className="text-xl font-bold text-center mb-4">¡Pago registrado exitosamente!</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-medium">Detalles de la transacción:</h3>
                    <p><strong>Cliente:</strong> {cliente.nombre}</p>
                    <p><strong>Habitación:</strong> {habitacion.nombre}</p>
                    <p><strong>Precio total:</strong> Q{total}</p>
                    <p><strong>Fecha de pago:</strong> {dayjs(fechaPagado).format('DD/MM/YYYY')}</p>
                    <p><strong>Estado:</strong> {estado}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-medium">Detalles de la reservación:</h3>
                    <p><strong>Fecha de inicio:</strong> {dayjs(fechaInicio).format('DD/MM/YYYY')}</p>
                    <p><strong>Fecha de fin:</strong> {dayjs(fechaFin).format('DD/MM/YYYY')}</p>
                </div>
                <div className="flex justify-center mt-6">
                    <Button label="Volver al inicio" icon="pi pi-home" className="bg-black border-black" onClick={() => window.location.href = '/'} />
                </div>
            </Card>
        </div>
    );
}
