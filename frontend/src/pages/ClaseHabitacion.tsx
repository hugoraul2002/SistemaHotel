import { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ClaseHabitacionService } from '../services/ClaseHabitacionService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ClaseHabitacion } from '../types/types';
import FormClaseHabitacion from '../components/clases_habitacion/FormClaseHabitacion';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUser } from '../hooks/UserContext';

export default function ClaseHabitacionPage() {
  const toast = useRef<Toast>(null);
  const { user } = useUser();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClaseHabitacionId, setEditingClaseHabitacionId] = useState<number | null>(null);
  const [claseHabitaciones, setClaseHabitaciones] = useState<ClaseHabitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

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
    setEditingClaseHabitacionId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const renderHeader = () => {
    return (
      <>
        <h1 className='font-semibold text-lg mb-4'>Listado de clases de habitaciones</h1>
        <div className="flex place-content-between gap-2">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
            </IconField>
          </div>
          <div className="flex gap-2">
            <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" onClick={handleNuevo} />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  const actionBodyTemplate = (rowData: ClaseHabitacion) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditClaseHabitacion(rowData)}
          severity='info' outlined rounded data-pr-tooltip="Editar" />
        {user?.rol.nombre === "ADMIN" && <Button type="button" outlined icon="pi pi-trash" severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />}
      </div>
    );
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingClaseHabitacionId(null);
  };

  const handleEditClaseHabitacion = (claseHabitacion: ClaseHabitacion) => {
    setIsEditing(true);
    setEditingClaseHabitacionId(claseHabitacion.id);
    setDialogVisible(true);
  };

  const handleSaveClaseHabitacion = async (claseHabitacion: ClaseHabitacion) => {
    try {
      console.log('claseHabitacion:', claseHabitacion);
      if (isEditing && editingClaseHabitacionId !== null) {
        console.log('Updating claseHabitacion:', editingClaseHabitacionId, claseHabitacion);
        const response = await ClaseHabitacionService.updateClaseHabitacion(editingClaseHabitacionId, { nombre: claseHabitacion.nombre });
        if (response) {
          const claseHabitacionesActualizadas = await ClaseHabitacionService.getAllClaseHabitaciones();
          setClaseHabitaciones(claseHabitacionesActualizadas);
          mostrarToast('Clase de habitación actualizada.', 'success');
        }
      } else {
        console.log('Creating new claseHabitacion:', claseHabitacion);
        const response = await ClaseHabitacionService.createClaseHabitacion({ nombre: claseHabitacion.nombre });
        console.log(response);
        if (response) {
          const claseHabitacionesActualizadas = await ClaseHabitacionService.getAllClaseHabitaciones();
          setClaseHabitaciones(claseHabitacionesActualizadas);
          mostrarToast('Clase de habitación creada.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingClaseHabitacionId(null);
    } catch (error) {
      console.error('Error creando claseHabitacion:', error);
      mostrarToast('Error al crear clase de habitación.', 'error');
    }
  };

  useEffect(() => {
    const fetchClaseHabitaciones = async () => {
      try {
        const data = await ClaseHabitacionService.getAllClaseHabitaciones();
        setClaseHabitaciones(data);
        setLoading(false);
        console.log(data);
      } catch (error) {
        console.error('Error fetching clase habitaciones:', error);
        mostrarToast('Error al cargar clases de habitación.', 'error');
      }
    };

    fetchClaseHabitaciones();
  }, []);

  const confirmarAnulacion = (claseHabitacion: ClaseHabitacion) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptarAnular(claseHabitacion),
      reject: () => mostrarToast('Se canceló la anulación.', 'info'),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-info',
      rejectClassName: 'p-button-danger'
    });
  };

  const acceptarAnular = async (claseHabitacion: ClaseHabitacion) => {
    try {
      const response = await ClaseHabitacionService.updateAnulado(claseHabitacion.id, { anulado: true });
      console.log('response:', response);
      if (response) {
        const claseHabitacionesActualizadas = await ClaseHabitacionService.getAllClaseHabitaciones();
        setClaseHabitaciones(claseHabitacionesActualizadas);
        mostrarToast('Clase de habitación eliminada.', 'success');
      }
    } catch (error) {
      console.error('Error eliminando claseHabitacion:', error);
      mostrarToast('Error al eliminar clase de habitación.', 'error');
    }
  };

  return (
    <div className="card md:mx-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={claseHabitaciones} filters={filters}
        globalFilterFields={['nombre',]} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran clases de habitación.">
        <Column field="nombre" sortable header="Nombre" style={{ width: '25%' }}></Column>
        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '25%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>
      <FormClaseHabitacion
        editar={isEditing}
        id={editingClaseHabitacionId!}
        onHide={handleDialogHide}
        visible={dialogVisible}
        onSave={handleSaveClaseHabitacion}
      />
    </div>
  );
}
