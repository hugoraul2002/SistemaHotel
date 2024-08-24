import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUser } from '../hooks/UserContext';
import { AperturaCajaService } from '../services/AperturaCajaService';
import { AperturaCaja, ArqueoCaja } from '../types/types';
import { ArqueoCajaService } from '../services/ArqueoCajaService';

function CajaPage() {
    const [aperturasCaja, setAperturasCaja] = useState<AperturaCaja[]>([]);
    const [selectedApertura, setSelectedApertura] = useState<AperturaCaja | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [arqueoDialogVisible, setArqueoDialogVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        monto: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fecha: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        observaciones: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [monto, setMonto] = useState<number>(0);
    const [observaciones, setObservaciones] = useState<string>('');
    const toast = useRef<Toast>(null);
    const { user } = useUser();

    const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
        toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        if ('value' in _filters['global']) {
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleNuevo = () => {
        setMonto(0);
        setObservaciones('');
        setDialogVisible(true);
    };

    const handleDialogHide = () => {
        setDialogVisible(false);
    };

    const handleSaveApertura = async () => {
        if (monto <= 0) {
            mostrarToast('El monto debe ser mayor a 0.', 'warn');
            return;
        }

        try {
            const nuevaApertura: AperturaCaja = {
                id: 0,
                monto,
                observaciones,
                fecha: new Date(),
                userId: user!.id,
                anulado: false,
                user: user!
            };

            await AperturaCajaService.createApertura(nuevaApertura);
            const aperturas = await AperturaCajaService.getAllAperturas();
            setAperturasCaja(aperturas);
            mostrarToast('Apertura creada exitosamente.', 'success');
            setDialogVisible(false);
        } catch (error) {
            console.error('Error creando apertura de caja:', error);
            mostrarToast('Error al crear apertura de caja.', 'error');
        }
    };

    const confirmarAnulacion = (apertura: AperturaCaja) => {
        confirmDialog({
            message: '¿Estás seguro de anular esta apertura?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => acceptarAnular(apertura),
            reject: () => mostrarToast('Se canceló la anulación.', 'info'),
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptClassName: 'p-button-info',
            rejectClassName: 'p-button-danger',
        });
    };

    const acceptarAnular = async (apertura: AperturaCaja) => {
        try {
            const response = await AperturaCajaService.updateAnulado(apertura.id, { anulado: true });
            if (response) {
                const aperturas = await AperturaCajaService.getAllAperturas();
                setAperturasCaja(aperturas);
                mostrarToast('Apertura anulada exitosamente.', 'success');
            }
        } catch (error) {
            console.error('Error anulando apertura:', error);
            mostrarToast('Error al anular apertura.', 'error');
        }
    };

    const handleArqueo = (apertura: AperturaCaja) => {
        setSelectedApertura(apertura);
        setMonto(0);
        setArqueoDialogVisible(true);
    };

    const handleArqueoDialogHide = () => {
        setArqueoDialogVisible(false);
        setSelectedApertura(null);
    };

    const handleSaveArqueo = async () => {
        if (monto <= 0) {
            mostrarToast('El monto debe ser mayor a 0.', 'warn');
            return;
        }

        if (selectedApertura) {
            try {
              const nuevoArqueo:ArqueoCaja = {
                id: 0,
                aperturaId: selectedApertura?.id,
                monto,
                observaciones,
                fecha: new Date(),
                userId: user!.id,
                anulado: false
            };
                await ArqueoCajaService.createArqueo(nuevoArqueo);
                const aperturas = await AperturaCajaService.getAllAperturas();
                setAperturasCaja(aperturas);
                mostrarToast('Arqueo registrado exitosamente.', 'success');
                setArqueoDialogVisible(false);
            } catch (error) {
                console.error('Error registrando arqueo de caja:', error);
                mostrarToast('Error al registrar arqueo de caja.', 'error');
            }
        }
    };

    useEffect(() => {
        const fetchAperturas = async () => {
            try {
                const aperturas = await AperturaCajaService.getAllAperturas();
                setAperturasCaja(aperturas);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching aperturas:', error);
                mostrarToast('Error al cargar aperturas de caja.', 'error');
            }
        };

        fetchAperturas();
    }, []);

    const renderHeader = () => {
        return (
            <>
                <h1 className='font-semibold text-lg mb-4'>Listado de Aperturas de Caja</h1>
                <div className="flex place-content-between gap-2">
                    <div>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
                        </IconField>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nueva Apertura" onClick={handleNuevo} />
                        <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" />
                        <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
                    </div>
                </div>
            </>
        );
    };

    const actionBodyTemplate = (rowData: AperturaCaja) => {
        return (
            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-wallet" rounded data-pr-tooltip="Registrar Arqueo"
                    onClick={() => handleArqueo(rowData)} disabled={!!rowData.arqueoCaja} />
                {user?.rol.nombre === "ADMIN" && (
                    <Button type="button" outlined icon="pi pi-trash" severity="danger" rounded data-pr-tooltip="Anular"
                        onClick={() => confirmarAnulacion(rowData)} />
                )}
            </div>
        );
    };

    const arqueoColumnTemplate = (rowData: AperturaCaja) => {
        return rowData.arqueoCaja ? `${rowData.arqueoCaja.monto}` : '';
    };

    return (
        <div className="card md:mx-4">
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable dataKey="id" loading={loading} showGridlines size='small' value={aperturasCaja} filters={filters}
                globalFilterFields={['user.fullName', 'monto', 'fecha', 'observaciones']} paginator rows={10}
                header={renderHeader()} emptyMessage="No se encontraron registros" scrollable scrollHeight="600px">
                <Column field="id" header="#" sortable style={{ flexGrow: 1, flexBasis: '5%' }} />
                <Column field="user.fullName" header="Responsable" sortable style={{ flexGrow: 1, flexBasis: '20%' }} />
                <Column field="monto" header="Monto" sortable style={{ flexGrow: 1, flexBasis: '15%' }} />
                <Column field="fecha" header="Fecha Apertura" sortable style={{ flexGrow: 1, flexBasis: '20%' }} />
                <Column field="observaciones" header="Observaciones" sortable style={{ flexGrow: 1, flexBasis: '20%' }} />
                <Column field="arqueoCaja.monto" body={arqueoColumnTemplate} header="Arqueo de Caja" style={{ flexGrow: 1, flexBasis: '15%' }} />
                <Column header="Acciones" body={actionBodyTemplate} exportable={false} style={{ flexGrow: 1, flexBasis: '15%', minWidth: '8rem' }} />
            </DataTable>

            <Dialog visible={dialogVisible} style={{ width: '400px' }} header="Nueva Apertura" modal className="p-fluid" onHide={handleDialogHide}>
                <div className="field">
                    <label htmlFor="monto">Monto Inicial</label>
                    <InputText id="monto" value={monto.toString()} onChange={(e) => setMonto(Number(e.target.value))} />
                </div>
                <div className="field">
                    <label htmlFor="observaciones">Observaciones</label>
                    <InputTextarea id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                </div>
                <div className="flex place-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" outlined onClick={handleDialogHide} />
                    <Button label="Registrar" icon="pi pi-check" onClick={handleSaveApertura} />
                </div>
            </Dialog>

            <Dialog visible={arqueoDialogVisible} style={{ width: '400px' }} header="Registrar Arqueo" modal className="p-fluid" onHide={handleArqueoDialogHide}>
                <div className="field">
                    <label htmlFor="apertura">Apertura</label>
                    <InputText id="apertura" value={`#${selectedApertura?.id || ''} - ${selectedApertura?.fecha.toLocaleString() || ''}`} readOnly />
                </div>
                <div className="field">
                    <label htmlFor="montoArqueo">Monto del Arqueo</label>
                    <InputText id="montoArqueo" value={monto.toString()} onChange={(e) => setMonto(Number(e.target.value))} />
                </div>
                <div className="flex place-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" outlined onClick={handleArqueoDialogHide} />
                    <Button label="Registrar" icon="pi pi-check" onClick={handleSaveArqueo} />
                </div>
            </Dialog>
        </div>
    );
}

export default CajaPage;
