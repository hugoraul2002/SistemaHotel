import React, { useEffect, useState, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TipoGastoService } from '../services/TipoGastoService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TipoGasto } from '../types/types';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import TipoGastoDialog from '../components/gastos/FormTipoGasto';

const TiposGastosPage: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTipoId, setEditingTipoId] = useState<number | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [anulados, setAnulados] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const handleDialogHide = () => {
        setDialogVisible(false);
        setEditingTipoId(null);
    };

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

    const renderHeader = () => {
        return (
            <>
                <h1 className='font-semibold text-lg mb-4'>Listado de Tipos de Gasto</h1>
                <div className="flex place-content-between gap-2">
                    <div>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
                        </IconField>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" onClick={() => handleNuevo()} />
                        <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" />
                        <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
                        <Button type="button" label={anulados ? 'Inactivos' : 'Activos'} rounded onClick={() => setAnulados(!anulados)} size='small' />
                    </div>
                </div>
            </>
        );
    };
    const handleNuevo = () => {
        setEditingTipoId(null);
        setIsEditing(false);
        setDialogVisible(true);
    };

    const handleEditTipoGasto = (tipoGasto: TipoGasto) => {
        setIsEditing(true);
        setEditingTipoId(tipoGasto.id);
        setDialogVisible(true);
    };
    const handleSave = async (tipoGasto: TipoGasto) => {
        try {
            console.log('tipoGasto:', tipoGasto);
            if (isEditing && editingTipoId !== null) {
                const response = await TipoGastoService.updateTipoGasto(editingTipoId, { tipo: tipoGasto.tipo });
                if (response) {
                    const tiposGastoActualizados = await TipoGastoService.getAllTipoGastos(anulados);
                    setTiposGasto(tiposGastoActualizados);
                    mostrarToast('Tipo de gasto actualizado.', 'success');
                }
            } else {
                console.log('Creating new tipo:', tipoGasto);
                const response = await TipoGastoService.createTipoGasto({ id: 0, tipo: tipoGasto.tipo, anulado: false });
                console.log(response);
                if (response) {
                    const tiposGastoActualizados = await TipoGastoService.getAllTipoGastos(anulados);
                    setTiposGasto(tiposGastoActualizados);
                    mostrarToast('Nivel creado.', 'success');
                }
            }
            setDialogVisible(false);
            setEditingTipoId(null);
        } catch (error) {
            console.error('Error creating user:', error);
            mostrarToast('Error al crear tipo de gasto.', 'error');
        }

    }

    const aceptarAnular = async (id: number) => {
        try {
          const response = await TipoGastoService.updateAnulado(id);
          if (response) {
            const tiposGasto = await TipoGastoService.getAllTipoGastos(anulados);
            setTiposGasto(tiposGasto);
            mostrarToast(anulados ? 'Tipo de gasto activado.' : 'Tipo de gasto inactivado.', 'success');
          }
        } catch (error) {
          console.error('Error eliminando tipo de gasto.', error);
          mostrarToast('Error al eliminar tipo de gasto.', 'error');
        }
      };

    const confirmarAnulacion = (tipoGasto: TipoGasto) => {
        const mensaje = !anulados ? '¿Estás seguro de anular el registro?' : '¿Estás seguro de activar el registro?';
        confirmDialog({
          message: mensaje,
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept: () => aceptarAnular(tipoGasto.id),
          reject: () => mostrarToast('Se canceló la anulación.', 'info'),
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          acceptClassName: 'p-button-info',
          rejectClassName: 'p-button-danger'
        });
      };

    useEffect(() => {
        const fetchTiposGasto = async () => {
            try {
                const data = await TipoGastoService.getAllTipoGastos(anulados);
                console.log('data:', data);
                setTiposGasto(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tipos de gasto:', error);
                toast.current?.show({ severity: 'error', detail: 'Error al cargar tipos de gasto.', life: 3000 });
            }
        };

        fetchTiposGasto();
    }, [anulados]);

    const header = renderHeader();
    const actionBodyTemplate = (rowData: TipoGasto) => {
        return (
            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-pen-to-square"
                    severity='info' outlined rounded onClick={() => handleEditTipoGasto(rowData)} data-pr-tooltip="Editar" disabled={anulados} className='hover:bg-sky-500 hover:text-white' />
                <Button type="button" outlined icon={anulados ? 'pi pi-replay' : 'pi pi-minus-circle'} className='hover:bg-red-500 hover:text-white'  severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />
            </div>
        );
    };
    return (
        <div className="card md:mx-4">
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable dataKey="id" loading={loading} showGridlines size='small' value={tiposGasto} filters={filters}
                globalFilterFields={['nombre']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran tipos de gasto.">
                <Column field="tipo" sortable header="Tipo de Gasto" style={{ width: '75%' }}></Column>
                <Column header="Acciones" body={actionBodyTemplate} bodyStyle={{ width: '25%', textAlign: 'center' }} exportable={false}></Column>
            </DataTable>
            <TipoGastoDialog
                editar={isEditing}
                id={editingTipoId!}
                onHide={handleDialogHide}
                visible={dialogVisible}
                onSave={handleSave}
            />
        </div>
    );
};

export default TiposGastosPage;
