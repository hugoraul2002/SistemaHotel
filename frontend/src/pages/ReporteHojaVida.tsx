import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import * as XLSX from 'xlsx';
import { Producto, ReporteHojaVida } from '../types/types';
import { ProductoService } from '../services/ProductoService';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { formatDateTimeFormat2 } from '../helpers/formatDate';
interface RegistroProducto {
    id: number;
    nombre: string;
}

const ReporteHojaVidaPage: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [reportes, setReportes] = useState<ReporteHojaVida[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
    const [selectedProducto, setSelectedProducto] = useState<RegistroProducto| null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);

    const fetchReportes = async (data: { fechaInicio: string; fechaFin: string }) => {
        try {
            setReportes([]);
            console.log('data', data);
            setLoading(true);
            const response = await ProductoService.reporteHojaVida(data);
            console.log('Reporte consultado correctamente:', response);
            setReportes(response);
            toast.current?.show({ severity: 'info', detail: 'Reporte consultado correctamente.', life: 3000 });
            setLoading(false);
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Error al cargar los datos del reporte.', life: 3000 });
            setLoading(false);
        }
    };

    const handleGenerarReporte = async () => {
        if (!fechaInicio || !fechaFin || !selectedProducto) {
            toast.current?.show({ severity: 'warn', detail: 'Por favor, completa todos los parámetros.', life: 3000 });
            return;
        }

        const data = {
            productoId: selectedProducto.id,
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaFin.toISOString().split('T')[0],
        };

        await fetchReportes(data);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const exportToExcel = () => {
        if (reportes.length <= 0) {
            toast.current?.show({ severity: 'info', detail: 'No existen registros a exportar.', life: 3000 });
            return;
        }

        const ws = XLSX.utils.json_to_sheet(reportes.map(reporte => ({
            Fecha: reporte.fecha,
            Tipo: reporte.tipo,
            'Existencia Anterior': reporte.existenciaAnterior,
            Cantidad: reporte.cantidad,
            'Existencia Actual': reporte.existenciaActual,
            Detalle: reporte.detalle,
            Usuario: reporte.usuario,
            Costo: reporte.costo.toFixed(2),
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoja de Vida');
        XLSX.writeFile(wb, 'Reporte_Hoja_Vida.xlsx');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col justify-content-between align-items-center">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold mb-4 md:mb-0">Reporte de Hoja de Vida</h2>
                    <Button label='Exportar' severity='success' icon="pi pi-file-excel" onClick={exportToExcel} />
                </div>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </IconField>
            </div>
        );
    };

    useEffect(() => {
        console.log('Fetching productos...');
        const fetchProductos = async () => {
          try {
            const response = await ProductoService.getRegistrosDropDown();
            console.log('Productos fetched:', response);
            setProductos(response);
          } catch (error) {
            console.error('Error fetching productos:', error);
            toast.current?.show({ severity: 'error', detail: 'Error al cargar los datos del producto.', life: 3000 });
          }
        };
        fetchProductos();
      }, []);
    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="flex gap-4 mb-4">
                <Dropdown
                    value={selectedProducto}
                    onChange={(e) => setSelectedProducto(e.value)}
                    options={productos}
                    optionLabel="nombre"
                    placeholder="Selecciona un producto"
                    className=" md:w-14rem"
                />
                <Calendar
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.value as Date)}
                    placeholder="Fecha Inicio"
                    dateFormat="yy-mm-dd"
                    showIcon
                />
                <Calendar
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.value as Date)}
                    placeholder="Fecha Fin"
                    dateFormat="yy-mm-dd"
                    showIcon
                />
                <Button label="Generar Reporte" icon="pi pi-file" onClick={handleGenerarReporte} />
            </div>
            <DataTable value={reportes} paginator rows={10} loading={loading} dataKey="id"
                globalFilter={globalFilterValue} header={renderHeader()} emptyMessage="No se encontraron registros." size='small'>
                <Column field="fechaHora"  header="Fecha" body={(rowData) => formatDateTimeFormat2(rowData.fechaHora)}  style={{textAlign: 'center'}}></Column>
                <Column field="tipo" header="Tipo"  style={{textAlign: 'center'}}></Column>
                <Column field="existenciaAnterior" header="Existencia Anterior"  style={{textAlign: 'center'}}></Column>
                <Column field="cantidad" header="Cantidad"  style={{textAlign: 'center'}}></Column>
                <Column field="existenciaActual" header="Existencia Actual" style={{textAlign: 'center'}}></Column>
                <Column field="detalle" header="Detalle" ></Column>
                <Column field="usuario" header="Usuario" ></Column>
                <Column field="costo" header="Costo" body={(rowData) => rowData.costo.toFixed(2)} style={{textAlign: 'center'}}></Column>
                <Column  header="Importe Movimiento" body={(rowData) => (rowData.costo * rowData.cantidad).toFixed(2)} style={{textAlign: 'center'}}></Column>
            </DataTable>
        </div>
    );
};

export default ReporteHojaVidaPage;
