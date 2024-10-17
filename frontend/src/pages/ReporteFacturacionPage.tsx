import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { getTicketFactura, reporteFactura } from '../services/FacturaService';
import { AuthModulo, ReporteFactura } from '../types/types';
import { formatDate } from '../helpers/formatDate';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as XLSX from 'xlsx';
import getPDF from '../services/FacturacionFelService';
import { Badge } from 'primereact/badge';
import { anularFactura } from '../services/FacturaService';
import FacturacionFelService from '../services/FacturacionFelService';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { InputSwitch } from 'primereact/inputswitch';
import { useNavigate } from 'react-router-dom';
import { authModulo } from '../services/AuthService';
const ReporteFacturasPage: React.FC = () => {
    const op = useRef(null);
    const toast = useRef<Toast>(null);
    const [userAuth, setUserAuth] = useState<AuthModulo | null>(null);
    const navigate = useNavigate();
    const [motivoAnulacion, setMotivoAnulacion] = useState<string>('');
    const [facturas, setFacturas] = useState<ReporteFactura[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
    const [selectedRow, setSelectedRow] = useState<ReporteFactura | null>(null);
    const [formatoTicket, setFormatoTicket] = useState(false);
    const fetchFacturas = async (data: { fechaInicio: string; fechaFin: string }) => {
        try {
            setLoading(true);
            const response = await reporteFactura(data);
            console.log(response);
            setFacturas(response);
            toast.current?.show({ severity: 'info', detail: 'Facturas consultadas correctamente.', life: 3000 });
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
        if (facturas.length <= 0) {
            toast.current?.show({ severity: 'info', detail: 'No existen registros de facturas a exportar.', life: 3000 });
            return;
        }
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

    const columnAnulado = (rowData: ReporteFactura) => {
        return (
            <Badge value={rowData.anulado == 1 ? "Anulada" : "Activa"} severity={rowData.anulado ? "secondary" : "info"}></Badge>
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex flex-col  justify-content-between align-items-center">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold mb-4 md:mb-0">Reporte de Facturas</h2>
                    <div className="flex gap-2 items-center">
                    <InputSwitch checked={formatoTicket} onChange={(e) => setFormatoTicket(e.value)} tooltip='Impresión en Ticket' tooltipOptions={{ position: 'top' }} />
                    <Button label='Exportar' severity='success' icon="pi pi-file-excel" onClick={exportToExcel} />
                    </div>
                </div>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </IconField>
            </div>
        );
    };
    useEffect(() => {
        const auth = async () => {
            try {
              const response: AuthModulo = await authModulo('ReporteFacturacion');
      
              if (!response.allowed) {
                navigate('/Inicio');
              }
              setUserAuth(response);
            } catch (error) {
              console.error('Error fetching auth:', error);
            }
          }
      
        auth();
    }, []);
    const handleAnular = async (rowData: ReporteFactura) => {
        try {
            const data = {
                idFactura: rowData.id,
                numAutorizacion: rowData.autorizacionFel,
                motivoAnulacion: motivoAnulacion,
                idUsuario: 0,
                fechaAnulacion: new Date()
            }
            console.log(data);
            if (rowData.autorizacionFel != null) {
                console.log(data);
                await FacturacionFelService.anularFacturaFel(data);
            } else {
                console.log(data);
                 await anularFactura(data);
            }
            toast.current?.show({ severity: 'success', detail: 'Factura anulada correctamente.', life: 3000 });
            handleGenerarReporte();
            setMotivoAnulacion('');
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Error al anular la factura.', life: 3000 });
        }
    }
    const confirmarAnular = () => {
        if (!selectedRow) return;
        console.log("INGRESO A CONFIRMAR", selectedRow);
        const mensaje = '¿Estás seguro de anular la factura?';
        confirmDialog({
            message: mensaje,
            header: 'Anulacion de factura.',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',            
            accept: async () => await handleAnular(selectedRow),
            reject: () => toast.current?.show({ severity: 'info', detail: 'Se canceló la anulación.', life: 3000 }),
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptClassName: 'p-button-info',
            rejectClassName: 'p-button-danger'
        });
    };
    const downloadPDF = async (numFactura: string) => {
        try {
            await getPDF.getPDF(numFactura); // Llamada al servicio que descarga el PDF
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Error al descargar el PDF.', life: 3000 });
            console.error('Error al descargar PDF:', error);
        }
    };

    const downloadTicketPDF = async (idFactura: number, numFactura: string) => {
        try {
            await getTicketFactura(idFactura, numFactura); // Llamada al servicio que descarga el PDF
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Error al descargar el PDF.', life: 3000 });
            console.error('Error al descargar PDF:', error);
        }
    };
    const pdfButtonTemplate = (rowData: ReporteFactura) => {
        return (
            <div className='flex gap-1'>
                <Button
                    icon="pi pi-file-pdf"
                    className="p-button-rounded"
                    severity='danger'
                    onClick={() =>{ formatoTicket ? downloadTicketPDF(rowData.id, rowData.numFactura) : downloadPDF(rowData.numFactura)}}
                    tooltip="Descargar PDF"
                    disabled={rowData.anulado == 1 || rowData.autorizacionFel == null}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-times-circle"
                    severity='warning'
                    className="p-button-rounded"
                    onClick={(e) => {
                        setSelectedRow(rowData);
                        op.current.toggle(e)
                    }}
                    tooltip="Anular"
                    disabled={rowData.anulado == 1}
                    tooltipOptions={{ position: 'top' }}
                />
                <OverlayPanel ref={op} className='p-1'>
                    <FloatLabel >
                        <InputTextarea className='w-full font-mono text-sm' id="motivo" value={motivoAnulacion} onChange={(e) => setMotivoAnulacion(e.target.value)} rows={4} cols={45} />
                        <label htmlFor="motivo">Motivo Anulación</label>
                    </FloatLabel>
                    <div className="flex justify-end mt-1">
                        <Button
                            icon="pi pi-check-circle"
                            severity='info'
                            className="p-button-rounded"
                            onClick={() => confirmarAnular()}
                            tooltip="Anular"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                </OverlayPanel>
            </div>
        );
    };
    const totalFacturado = facturas.reduce((acc, factura) => acc + (factura.total || 0), 0);


    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Totales:" colSpan={4} footerStyle={{ textAlign: 'right' }} />

                <Column footer={'Q ' + totalFacturado} footerStyle={{ textAlign: 'center' }} />
                <Column colSpan={3} footer={''} />
            </Row>
        </ColumnGroup>
    );

    return (
        <div className="card">
            <ConfirmDialog />
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
            <DataTable value={facturas} footerColumnGroup={footerGroup} paginator rows={10} loading={loading} dataKey="numFactura"
                globalFilter={globalFilterValue} header={renderHeader()} emptyMessage="No se encontraron facturas." size='small'>
                <Column field="fecha" body={(rowData: ReporteFactura) => formatDate(new Date(rowData.fecha))} header="Fecha" sortable></Column>
                <Column field="numFactura" header="Consecutivo" style={{ textAlign: 'center' }} sortable></Column>
                <Column field="nit" header="NIT" sortable></Column>
                <Column field="cliente" header="Cliente" sortable></Column>
                <Column field="total" header="Total" sortable body={(rowData) => rowData.total.toFixed(2)}></Column>
                <Column field="usuario" header="Usuario que registra" sortable></Column>
                <Column field="autorizacionFel" header="Autorización FEL" sortable></Column>
                <Column field="anulado" body={columnAnulado} header="Anulada" sortable></Column>
                <Column body={pdfButtonTemplate} header="Opciones"></Column>
            </DataTable>
        </div>
    );
};

export default ReporteFacturasPage;
