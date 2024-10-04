import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EncabezadoCierre, TransaccionesCaja } from '../types/types';
import { Button } from 'primereact/button';
import { CierreCajaService } from '../services/CierreCajaService';
import { useParams } from 'react-router-dom';
import { fechaHoraFormato, formatDate } from '../helpers/formatDate';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Badge } from 'primereact/badge';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { FilterMatchMode } from 'primereact/api';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const CierreCaja: React.FC = () => {
    const op = useRef(null);
    const toast = useRef<Toast>(null);
    const [observaciones, setObservaciones] = useState<string>('');
    const [transacciones, setTransacciones] = useState<TransaccionesCaja[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTransaccion, setSelectedTransaccion] = useState<TransaccionesCaja | null>(null);
    const [encabezado, setEncabezado] = useState<EncabezadoCierre | null>(null);
    const { idApertura } = useParams();
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tipo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        razon: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        documentoId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        totalEfectivo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        totalTarjeta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        totalTransferencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        totalCheque: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        anulado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

    });
    const [conCierre, setConCierre] = useState<boolean>(false);

    useEffect(() => {
        const fetchTransacciones = async () => {
            setLoading(true);
            try {
                const encabezadoCierre = await CierreCajaService.getEncabezadoCierre(Number(idApertura));
                if (encabezadoCierre) {
                    setEncabezado(encabezadoCierre[0]);
                    setConCierre(encabezadoCierre[0].existeCierre);
                    if (encabezadoCierre[0].existeCierre ==1) {
                        setObservaciones(encabezadoCierre[0].observacionesCierre);
                    }
                }
                const response = await CierreCajaService.getTransaccionesCierre(Number(idApertura));
                console.log(encabezado);
                setTransacciones(response);
            } catch (error) {
                console.error('Error fetching transacciones:', error);
            } finally {
                setLoading(false);
                console.log(encabezado);
            }
        };

        if (idApertura) fetchTransacciones();
    }, [idApertura]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };
        if ('value' in _filters['global']) {
            _filters['global'].value = value;
        }
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const mostrarToast = (severity: string, summary: string, detail: string) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };

    const handleSave = async () => {
        try {
            if (encabezado && !conCierre) {
                const cierre = {
                    arqueoId: encabezado.idArqueo,
                    userId: 0,
                    fecha: new Date(),
                    montoSistema: totalEfectivo,
                    observaciones: observaciones,
                    anulado: false
                }
                const response = await CierreCajaService.createCierre(cierre);                
                if (response) {
                    setConCierre(true);
                    mostrarToast('success', 'Cierre creado', 'Cierre creado exitosamente.');
                }
            }
        } catch (error) {
            console.error('Error saving cierre:', error);
        }   
    };

    const startContent = (
        <React.Fragment>
            {encabezado &&
                <div className='font-mono'>
                    <p> <span className='text-lg font-semibold'>CAJA #{encabezado?.idApertura}</span> Apertura: Q {encabezado?.montoApertura}</p>
                    <p>Fecha de Apertura: {fechaHoraFormato(encabezado?.fechaApertura)}</p>
                    <p>Cajero: {encabezado?.usuario}</p>
                </div>

            }
        </React.Fragment>
    );

    const centerContent = (
        <React.Fragment>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText className='font-mono' placeholder="Search" value={globalFilterValue} onChange={onGlobalFilterChange} />
            </IconField>
        </React.Fragment>
    );

    const endContent = (
        <div className='flex gap-2'>
            <Button icon={conCierre ? 'pi pi-eye' : 'pi pi-plus-circle'}
                severity='info'
                tooltip={conCierre ? 'Ver observaciones' : 'Agregar observaciones'}                
                tooltipOptions={{ position: 'top' }}
                onClick={(e) => op.current.toggle(e)} />
            <Button icon="pi pi-save"
                severity='warning'
                tooltip="Guardar"
                disabled={conCierre || (encabezado ? encabezado.aplicaCierre==0 : false)}
                tooltipOptions={{ position: 'top' }} 
                onClick={() => confirmarGuardar()} />
            <OverlayPanel ref={op} className='p-1'>
                <FloatLabel >
                    <InputTextarea className='w-full font-mono text-sm' id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={4} cols={45} disabled={conCierre}/>
                    <label htmlFor="observaciones">Observaciones</label>
                </FloatLabel>
            </OverlayPanel>
        </div>
    );

    const cardTotalSistema = () => {
        return (
            <div className="rounded-lg border px-2">
                <div className=" p-2 rounded-t-lg flex gap-1 items-center">
                    <i className="pi pi-money-bill "></i>
                    <h2 className="font-semibold">Total Sistema</h2>
                </div>
                <div className="p-2 flex justify-center">
                    <p >Q. {filteredTransacciones.length > 0 ? totalEfectivo.toFixed(2) : '0.00'}</p>
                </div>
            </div>
        )
    }

    const cardTotalCajero = () => {
        return (
            <div className="rounded-lg border px-2">
                <div className=" p-2 rounded-t-lg flex gap-1 items-center">
                    <i className="pi pi-user "></i>

                    <h2 className="font-semibold">Total Cajero</h2>
                </div>
                <div className="p-2 flex justify-center">
                    <p >Q. {encabezado && encabezado.montoArqueo ? encabezado?.montoArqueo.toFixed(2) : '0.00'}</p>
                </div>
            </div>
        )
    }

    const cardDiferenciaCaja = () => {
        return (
            <div className="rounded-lg border px-2">
                <div className=" p-2 rounded-t-lg flex gap-1 items-center">
                    <i className="pi pi-calculator"></i>

                    <h2 className="font-semibold">Diferencia</h2>
                </div>
                <div className="p-2 flex justify-center">
                    <p >Q. {encabezado && encabezado.montoArqueo && totalEfectivo ? (encabezado?.montoArqueo - totalEfectivo).toFixed(2) : '0.00'}</p>
                </div>
            </div>
        )
    }

    const columnAnulado = (rowData: TransaccionesCaja) => {
        return (
            <Badge value={rowData.anulado ? "Anulada" : "Activa"} severity={rowData.anulado ? "secondary" : "info"}></Badge>
        )
    }

    const confirmarGuardar = () => {
        const mensaje = '¿Estás seguro de registrar el cierre de caja?';
        confirmDialog({
          message: mensaje,
          header: 'Registro de cierre',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept: () => handleSave(),
          reject: () => mostrarToast('info','Cancelado', 'No se realizaron cambios.'),
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          acceptClassName: 'p-button-info',
          rejectClassName: 'p-button-danger'
        });
      };

    const filteredTransacciones = transacciones.filter(item => !item.anulado);

    const totalDocumentos = filteredTransacciones.length;

    const totalEfectivo = filteredTransacciones.reduce((acc, item) => {
        if (item.tipo === 'FACT GASTO') {
            return acc - (item.totalEfectivo || 0);
        } else if (item.tipo === 'FACT HOSPEDAJE') {
            return acc + (item.totalEfectivo || 0);
        }
        return acc;
    }, 0);

    const totalTarjeta = filteredTransacciones.reduce((acc, item) => {
        if (item.tipo === 'FACT HOSPEDAJE') {
            return acc + (item.totalTarjeta || 0);
        } else if (item.tipo === 'FACT GASTO') {
            return acc - (item.totalTarjeta || 0);
        }
        return acc;
    }, 0);

    const totalTransferencia = filteredTransacciones.reduce((acc, item) => {
        if (item.tipo === 'FACT HOSPEDAJE') {
            return acc + (item.totalTransferencia || 0);
        } else if (item.tipo === 'FACT GASTO') {
            return acc - (item.totalTransferencia || 0);
        }
        return acc;
    }, 0);

    const totalCheque = filteredTransacciones.reduce((acc, item) => {
        if (item.tipo === 'FACT HOSPEDAJE') {
            return acc + (item.totalCheque || 0);
        } else if (item.tipo === 'FACT GASTO') {
            return acc - (item.totalCheque || 0);
        }
        return acc;
    }, 0);

    const totalGeneral = totalEfectivo + totalTarjeta + totalTransferencia + totalCheque;

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Totales:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
                <Column footer={totalDocumentos} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalEfectivo} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalTarjeta} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalTransferencia} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalCheque} footerStyle={{ textAlign: 'center' }} />
                <Column footer={'Q ' + totalGeneral} footerStyle={{ textAlign: 'center' }} />
                <Column footer={''} />


            </Row>
        </ColumnGroup>
    );
    return (
        <div className="card font-mono">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h2 className='font-semibold text-lg mb-4 md:mb-0
            '>Cierre de Caja</h2>
            <Toolbar className='my-4' start={startContent} center={centerContent} end={endContent} />
            <DataTable footerColumnGroup={footerGroup} className='font-mono' selectionMode="single" selection={selectedTransaccion!} value={transacciones} size='small' loading={loading} paginator rows={25}
                onSelectionChange={(e) => setSelectedTransaccion(e.value)} rowsPerPageOptions={[5, 10, 25]} emptyMessage="No hay transacciones disponibles." filters={filters} globalFilterFields={['fecha', 'tipo', 'razon', 'documentoId', 'totalEfectivo', 'totalTarjeta', 'totalTransferencia', 'totalCheque', 'total', 'anulado']}>
                <Column field="fecha" style={{ textAlign: 'center' }} body={rowData => formatDate(rowData.fecha)} header="Fecha" sortable bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="tipo" header="Tipo" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="razon" header="Razón" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} sortable />
                <Column field="documentoId" style={{ textAlign: 'center' }} header="Documento" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="totalEfectivo" style={{ textAlign: 'center' }} header="Total Efectivo" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="totalTarjeta" style={{ textAlign: 'center' }} header="Total Tarjeta" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="totalTransferencia" style={{ textAlign: 'center' }} header="Total Transferencia" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="totalCheque" style={{ textAlign: 'center' }} header="Total Cheque" bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="total" style={{ textAlign: 'center' }} header="Total" sortable bodyClassName={rowData => rowData.tipo === 'FACT GASTO' ? 'text-red-800' : 'text-green-800'} />
                <Column field="anulado" body={columnAnulado} style={{ textAlign: 'center' }} header="Estado" />

            </DataTable>
            <div className="card flex justify-content-center w-full">

            </div>
            <Toolbar className='my-4 font-mono' start={cardTotalSistema} center={cardTotalCajero} end={cardDiferenciaCaja} />
        </div>
    );
};

export default CierreCaja;
