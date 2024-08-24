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
import { ConfirmDialog } from 'primereact/confirmdialog';

const TiposGastosPage: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

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
                        <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" />
                        <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" />
                        <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
                    </div>
                </div>
            </>
        );
    };

    useEffect(() => {
        const fetchTiposGasto = async () => {
            try {
                const data = await TipoGastoService.getAllTipoGastos();
                setTiposGasto(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tipos de gasto:', error);
                toast.current?.show({ severity: 'error', detail: 'Error al cargar tipos de gasto.', life: 3000 });
            }
        };

        fetchTiposGasto();
    }, []);

    const header = renderHeader();
    const actionBodyTemplate = () => {
        return (
            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-pen-to-square"
                    severity='info' outlined rounded data-pr-tooltip="Editar" />
                <Button type="button" outlined icon="pi pi-trash" severity="danger" rounded data-pr-tooltip="Eliminar" />
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
        </div>
    );
};

export default TiposGastosPage;
