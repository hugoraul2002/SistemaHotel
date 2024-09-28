import React, { useEffect, useState, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GastoService } from '../services/GastoService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Gasto, MetodoPago, OpcionPago } from '../types/types';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { formatDate } from '../helpers/formatDate';
import { createOpcionPago } from '../services/OpcionPagoService';
import GastoDialog from '../components/gastos/GastoDialog';
import { useUser } from '../hooks/UserContext';

const GastosPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { user } = useUser();
  const [anulados, setAnulados] = useState<boolean>(false);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    descripcion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    monto: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fecha: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'proveedor.nombre': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'tipoGasto.nombre': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'user.fullName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGastoId, setEditingGastoId] = useState<number | null>(null);

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
        <h1 className='font-semibold text-lg mb-4'>Listado de Gastos</h1>
        <div className="flex place-content-between gap-2">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
            </IconField>
          </div>
          <div className="flex gap-2">
            <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" onClick={() => handleNuevo()} />
            <Button type="button" label={anulados ? 'Inactivos' : 'Activos'} rounded onClick={() => setAnulados(!anulados)} size='small' />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  const handleEditGasto = (gasto: Gasto) => {
    console.log(gasto);
    setEditingGastoId(gasto.id);
    setIsEditing(true);
    setDialogVisible(true);
  };

  const handleNuevo = () => {
    setEditingGastoId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingGastoId(null);
  };

  const metodoMap = {
    EFECTIVO: 'EFE',
    TARJETA: 'TAR',
    CHEQUE: 'CHE',
    TRANSFERENCIA: 'TRA',
  };

  const handleSaveGasto = async (gasto: Gasto, metodosPago: MetodoPago[]): Promise<void> => {
    try {
      if (isEditing && editingGastoId !== null) {
        const response = await GastoService.updateGasto(editingGastoId, gasto);
        if (response) {
          const gastos = await GastoService.getAllGastos(anulados);
          setGastos(gastos);
          mostrarToast('Gasto actualizado.', 'success');
        }
      } else {
        const response = await GastoService.createGasto(gasto);
        if (response) {
          const { id } = response;
          metodosPago.forEach(async (mp) => {
            if (mp.monto > 0) {
              const opcionPago: OpcionPago = {
                id: 0,
                aperturaId: mp.idApertura,
                tipoDocumento: 'FG',
                documentoId: id,
                metodo: metodoMap[mp.metodo as keyof typeof metodoMap] || '',
                monto: mp.monto,
                fecha: new Date(),
              }
              await createOpcionPago(opcionPago);
            }
          })
          const gastos = await GastoService.getAllGastos(anulados);
          setGastos(gastos);
          mostrarToast('Gasto creado.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingGastoId(null);
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      mostrarToast('Error al guardar gasto.', 'error');
    }
  };

  const actionBodyTemplate = (rowData: Gasto) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button
          type="button"
          icon="pi pi-pen-to-square"
          onClick={() => handleEditGasto(rowData)}
          disabled={anulados}
          className='hover:bg-sky-500 hover:text-white'
          severity='info'
          outlined
          rounded
          data-pr-tooltip="Editar"
        />
        {user?.rol.nombre === "ADMIN" && (
          <Button
            type="button"
            outlined
            icon={anulados ? 'pi pi-replay' : 'pi pi-minus-circle'}
            className='hover:bg-red-500 hover:text-white'
            severity="danger"
            onClick={() => confirmarAnulacion(rowData)}
            rounded
            disabled={rowData.anulado}
            data-pr-tooltip={anulados ? "Reactivar" : "Anular"}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const gastos = await GastoService.getAllGastos(anulados);
        console.log(gastos);
        setGastos(gastos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gastos:', error);
        mostrarToast('Error al cargar gastos.', 'error');
      }
    };

    fetchGastos();
  }, [anulados]);

  const aceptarAnular = async (gasto: Gasto) => {
    try {
      const response = await GastoService.updateAnulado(gasto.id);
      if (response) {
        const gastos = await GastoService.getAllGastos(anulados);
        setGastos(gastos);
        mostrarToast(anulados ? 'Gasto activado.' : 'Gasto anulado.', 'success');
      }
    } catch (error) {
      console.error('Error al anular gasto:', error);
      mostrarToast('Error al anular gasto.', 'error');
    }
  };

  const confirmarAnulacion = (gasto: Gasto) => {
    const mensaje = !anulados ? '¿Estás seguro de anular el gasto?' : '¿Estás seguro de activar el gasto?';
    confirmDialog({
      message: mensaje,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => aceptarAnular(gasto),
      reject: () => mostrarToast('Se canceló la acción.', 'info'),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-info',
      rejectClassName: 'p-button-danger'
    });
  };

  // Funciones para exportar a Excel y PDF (opcional)

  return (
    <div className="card md:mx-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        dataKey="id"
        loading={loading}
        showGridlines
        size='small'
        value={gastos}
        filters={filters}
        onSelectionChange={(e) => setSelectedGasto(e.value)}
        selectionMode="single"
        selection={selectedGasto!}
        globalFilterFields={['descripcion', 'monto', 'fecha', 'proveedor.nombre', 'tipoGasto.tipo', 'usuario.fullName']}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '60rem' }}
        header={header}
        emptyMessage="No se encuentran gastos."
      >
        <Column field="descripcion" sortable header="Descripción" style={{ width: 'auto' }}></Column>
        <Column field="monto" sortable header="Monto" style={{ width: 'auto' }}></Column>
        <Column
          field="fecha"
          body={rowData => formatDate(rowData.fecha)}
          sortable
          header="Fecha"
          style={{ width: 'auto' }}
        ></Column>
        <Column field="tipoGasto.tipo" sortable header="Tipo Gasto" style={{ width: 'auto' }}></Column>
        <Column field="proveedor.nombre" sortable header="Proveedor" style={{ width: 'auto' }}></Column>
        <Column field="usuario.fullName" sortable header="Usuario" style={{ width: 'auto' }}></Column>
        <Column
          body={actionBodyTemplate}
          header="Acciones"
          bodyStyle={{ width: 'auto', textAlign: 'center' }}
          exportable={false}
        ></Column>
      </DataTable>
      <GastoDialog
        editar={isEditing}
        id={editingGastoId!}
        visible={dialogVisible}
        onHide={handleDialogHide}
        onSave={handleSaveGasto}
        mostrarToast={mostrarToast}
      />
      {/* <Dialog visible={dialogVisible} onHide={handleDialogHide}>
      <RegistroPago idDocumento={1} tipoDocumento="G" setOpcionesPago={setMetodosPago} onSave={()=> console.log('onSave')} 
      mostrarToast={mostrarToast}/>
      </Dialog> */}
    </div>
  );
};

export default GastosPage;
