import React, { useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useParams } from 'react-router-dom';
import { DetalleHospedaje, Habitacion, Hospedaje } from '../../types/types';
import { HospedajeService } from '../../services/HospedajeService';
import { formatDateTime } from '../../helpers/formatDate';
import {getDetallesByHospedaje} from '../../services/DetalleHospedajeService';
const RegistroSalida = () => {
    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);
    const [detallesHospedaje, setDetallesHospedaje] = useState<DetalleHospedaje[]>([]);
    const [servicioHospedaje, setServicioHospedaje] = useState<DetalleHospedaje[]>([]);
    const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
    const { idHabitacion } = useParams();
    // Función para sumar los subtotales y calcular el total a cancelar
    // const calcularTotalAPagar = () => {
    //     const totalPagado = productos.reduce((total, item) => item.pagado ? total : total + item.subtotal, 0);
    //     const totalSubtotales = productos.reduce((total, item) => total + item.subtotal, 0);
    //     return { totalSubtotales, totalPagado };
    // };

    const { totalSubtotales, totalPagado } = {
        totalSubtotales: 0, totalPagado: 0};


    useEffect(() => {
        if (idHabitacion) {
            console.log('id habitacion llega:',idHabitacion);
          const fetchHabitacion = async () => {
            try {
              const response = await HospedajeService.getActivoByIdHabitacion(Number(idHabitacion));
              if (response) {
                setHospedaje(response);
                const detalles= await getDetallesByHospedaje(response.id);
                if (detalles) {
                    console.log(detalles);
                    setDetallesHospedaje(detalles);
                }
                
              }
              console.log(response);

            } catch (error) {
              console.error('Error fetching habitacion:', error);
            }
          };
    
          fetchHabitacion();
        }
        console.log('id habitacion:',idHabitacion);
      }, [idHabitacion]);

    return (
        <div className="p-4 flex flex-col md:flex-row gap-4">
            {/* Sección Izquierda */}
            <Card className="w-full md:w-1/3 mb-4 md:mb-0">
                <Panel header="Habitación" className="text-md mb-3">
                    <div className="flex justify-between">
                        <p className="text-sm"> Nombre</p>
                        <p className="text-sm"> {hospedaje?.habitacion?.nombre || ''}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Precio</p>
                        <p className="text-sm">Q. {hospedaje?.habitacion?.precio || ''}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Tarifa</p>
                        <p className="text-sm">{hospedaje?.habitacion?.tarifa} Horas</p>
                    </div>
                </Panel>

                <Panel header="Información del Cliente" className="text-md mb-3">
                    <div className="flex justify-between">
                        <p className="text-sm"> Cliente</p>
                        <p className="text-sm"> {hospedaje?.cliente?.nombre || 'No seleccionado'}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Tipo de Documento</p>
                        <p className="text-sm"> {hospedaje?.cliente?.tipoDocumento || ''}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Número de Documento</p>
                        <p className="text-sm"> {hospedaje?.cliente?.numDocumento || ''}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Teléfono</p>
                        <p className="text-sm"> {hospedaje?.cliente?.telefono || ''}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Dirección</p>
                        <p className="text-sm"> {hospedaje?.cliente?.direccion || ''}</p>
                    </div>
                </Panel>

                <Panel header="Información del Hospedaje" className="text-md">
                    <div className="flex justify-between">
                        <p className="text-sm"> Fecha Inicio</p>
                        <p className="text-sm"> {hospedaje && formatDateTime(hospedaje!.fechaInicio)}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Fecha Fin</p>
                        <p className="text-sm"> {hospedaje && formatDateTime(hospedaje!.fechaFin) || ''}</p>
                    </div>                    
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Monto de Penalidad</p>
                        <p className="text-sm"> Q. {hospedaje?.monto_penalidad || 0}</p>
                    </div>
                    <Divider className='my-1' />
                    <div className="flex justify-between">
                        <p className="text-sm"> Total</p>
                        <p className="text-sm"> Q. {hospedaje?.total || 0}</p>
                    </div>
                </Panel>
            </Card>

            {/* Sección Derecha */}
            <div className="w-full md:w-2/3">
                {/* Tabla de Hospedaje */}
                <Panel header="Detalles del Hospedaje" className="mb-3 text-sm">
                    <DataTable value={[]} className="p-datatable-sm text-sm">
                        <Column field="producto" header="Habitación" />
                        <Column field="cantidad" header="Cantidad" />
                        <Column field="precioUnitario" header="Precio Unitario" />
                        <Column field="descuento" header="Descuento" />
                        <Column field="subtotal" header="Subtotal" />
                        <Column field="pagado" header="Pagado" body={(rowData) => (rowData.pagado ? 'Sí' : 'No')} />
                    </DataTable>
                </Panel>

                {/* Tabla de Productos y Servicios */}
                <Panel header="Productos y Servicios Consumidos" className='text-sm'>
                    <DataTable value={[]} className="p-datatable-sm text-sm">
                        <Column field="item" header="#" />
                        <Column field="producto" header="Producto" />
                        <Column field="cantidad" header="Cantidad" />
                        <Column field="precioUnitario" header="Precio Unitario" />
                        <Column field="descuento" header="Descuento" />
                        <Column field="subtotal" header="Subtotal" />
                        <Column field="pagado" header="Pagado" body={(rowData) => (rowData.pagado ? 'Sí' : 'No')} />
                    </DataTable>
                    <div className="flex justify-between mt-3">
                        <div><strong>Total Subtotales:</strong> Q. {totalSubtotales}</div>
                        <div><strong>Total a Cancelar:</strong> Q. {totalPagado}</div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default RegistroSalida;
