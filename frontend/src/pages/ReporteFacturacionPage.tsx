import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { reporteFactura } from '../services/FacturaService';
import { ReporteFactura } from '../types/types';
import { formatDate } from '../helpers/formatDate';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as XLSX from 'xlsx';

const ReporteFacturasPage: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [facturas, setFacturas] = useState<ReporteFactura[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());

    const fetchFacturas = async (data: { fechaInicio: string; fechaFin: string }) => {
        try {
            setLoading(true);
            const response = await reporteFactura(data);
            console.log(response);
            setFacturas(response);
            setLoading(false);
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Error al cargar los datos del reporte.', life: 3000 });
            setLoading(false);
        }
    };

    const handleGenerarReporte = () => {
        if (!fechaInicio || !fechaFin) {
            toast.current?.show({ severity: 'warn', detail: 'Por favor, selecciona ambas fechas.', life: 3000 });
            return;
        }

        const data = {
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaFin.toISOString().split('T')[0],
        };

        fetchFacturas(data);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(facturas.map(factura => ({
            Fecha: formatDate(new Date(factura.fecha)),
            'Número de Factura': factura.numFactura,
            NIT: factura.nit,
            Cliente: factura.cliente,
            Total: factura.total.toFixed(2),
            'Usuario que registra': factura.usuario
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
        XLSX.writeFile(wb, 'Reporte de Facturas.xlsx');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col  justify-content-between align-items-center">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold mb-4 md:mb-0">Reporte de Facturas</h2>
                    <Button label='Exportar' severity='success' icon="pi pi-file-excel" onClick={exportToExcel} />
                </div>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </IconField>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="flex gap-4 mb-4">
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
            <DataTable value={facturas} paginator rows={10} loading={loading} dataKey="numFactura"
                globalFilter={globalFilterValue} header={renderHeader()} emptyMessage="No se encontraron facturas.">
                <Column field="fecha" body={(rowData: ReporteFactura) => formatDate(new Date(rowData.fecha))} header="Fecha" sortable></Column>
                <Column field="numFactura" header="Número de Factura" sortable></Column>
                <Column field="nit" header="NIT" sortable></Column>
                <Column field="cliente" header="Cliente" sortable></Column>
                <Column field="total" header="Total" sortable body={(rowData) => rowData.total.toFixed(2)}></Column>
                <Column field="usuario" header="Usuario que registra" sortable></Column>
            </DataTable>
        </div>
    );
};

export default ReporteFacturasPage;
