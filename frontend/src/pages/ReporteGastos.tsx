import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { GastoService } from '../services/GastoService'; // Suponiendo que tienes un servicio para obtener los datos
import { ReporteGasto } from '../types/types';
import * as XLSX from 'xlsx';
import { formatDate } from '../helpers/formatDate';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

const ReporteGastosPage: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [gastos, setGastos] = useState<ReporteGasto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());

    const fetchGastos = async (data: { fechaInicio: string; fechaFin: string }) => {
        try {
            setLoading(true);
            const response = await GastoService.reporteGasto(data);
            setGastos(response);
            toast.current?.show({ severity: 'info', detail: 'Gastos consultados correctamente.', life: 3000 });
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

        console.log(data);

        fetchGastos(data);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const exportToExcel = () => {
        if (gastos.length <= 0) {
            toast.current?.show({ severity: 'info', detail: 'No existen registros de gastos a exportar.', life: 3000 });
            return;
        }

        const ws = XLSX.utils.json_to_sheet(gastos.map(gasto => ({
            Fecha: formatDate(new Date(gasto.fecha)),
            Gasto: gasto.gasto,
            Total: gasto.total.toFixed(2),
            Efectivo: gasto.efectivo.toFixed(2),
            Tarjeta: gasto.tarjeta.toFixed(2),
            Proveedor: gasto.proveedor,
            'Tipo de Gasto': gasto.tipogasto,
            Usuario: gasto.usuario
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Gastos');
        XLSX.writeFile(wb, 'Reporte de Gastos.xlsx');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col justify-content-between align-items-center">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold mb-4 md:mb-0">Reporte de Gastos</h2>
                    <Button label='Exportar' severity='success' icon="pi pi-file-excel" onClick={exportToExcel} />
                </div>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </IconField>
            </div>
        );
    };

    // Calcular los totales
    const totalGastos = gastos.reduce((acc, gasto) => acc + (gasto.total || 0), 0);
    const totalEfectivo = gastos.reduce((acc, gasto) => acc + (gasto.efectivo || 0), 0);
    const totalTarjeta = gastos.reduce((acc, gasto) => acc + (gasto.tarjeta || 0), 0);
    const totalTransferencia = gastos.reduce((acc, gasto) => acc + (gasto.transferencia || 0), 0);
    const totalCheque = gastos.reduce((acc, gasto) => acc + (gasto.cheque || 0), 0);

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Totales:" colSpan={2} footerStyle={{ textAlign: 'right' }} />
            
                <Column footer={'Q ' + totalEfectivo} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalTarjeta} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalTransferencia} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalCheque} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalGastos} footerStyle={{ textAlign: 'center' }} />
                <Column footer={''} />
                <Column footer={''} />
                <Column footer={''} />
            </Row>
        </ColumnGroup>
    );

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
            <DataTable value={gastos} paginator rows={10} loading={loading} dataKey="fecha"
                globalFilter={globalFilterValue} header={renderHeader()} emptyMessage="No se encontraron gastos." footerColumnGroup={footerGroup} size='small'>
                <Column field="fecha" body={(rowData: ReporteGasto) => formatDate(new Date(rowData.fecha))} header="Fecha" sortable></Column>
                <Column field="gasto" header="Gasto" sortable></Column>
                <Column field="efectivo" header="Efectivo" body={(rowData) => (rowData.efectivo ? rowData.efectivo.toFixed(2) : '0.00')} sortable style={{ textAlign: 'center' }}></Column>
                <Column field="tarjeta" header="Tarjeta" body={(rowData) => (rowData.tarjeta ? rowData.tarjeta.toFixed(2) : '0.00')} sortable style={{ textAlign: 'center' }}></Column>
                <Column field="transferencia" header="Transferencia" body={(rowData) => (rowData.transferencia ? rowData.transferencia.toFixed(2) : '0.00')} sortable style={{ textAlign: 'center' }}></Column>
                <Column field="cheque" header="Cheque" body={(rowData) => (rowData.cheque ? rowData.cheque.toFixed(2) : '0.00')} sortable style={{ textAlign: 'center' }}></Column>
                <Column field="total" header="Total" body={(rowData) => (rowData.total ? rowData.total.toFixed(2) : '0.00')} sortable></Column>

                <Column field="proveedor" header="Proveedor" sortable></Column>
                <Column field="tipogasto" header="Tipo de Gasto" sortable></Column>
                <Column field="usuario" header="Usuario" sortable></Column>
            </DataTable>
        </div>
    );
};

export default ReporteGastosPage;
