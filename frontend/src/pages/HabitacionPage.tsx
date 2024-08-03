import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { HabitacionService } from '../services/HabitacionService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Habitacion } from '../types/types';
import { Toast } from 'primereact/toast';
import HabitacionDialog from '../components/habitaciones/FormHabitacion';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


export default function HabitacionPage() {
  const toast = useRef<Toast>(null);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedHabitacion, setSelectedHabitacion] = useState<Habitacion | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    claseHabitacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nivel: { value: null, matchMode: FilterMatchMode.STARTS_WITH },    
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHabitacionId, setEditingHabitacionId] = useState<number | null>(null);

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
      <div className="flex place-content-between gap-2">
        <div>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
          </IconField>
        </div>
        <div className="flex gap-2">
          <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" onClick={() => handleNuevo()} />
          {/* <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" onClick={exportToExcel} /> */}
          <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const handleEditHabitacion = (habitacion: Habitacion) => {
    console.log(habitacion);
    setIsEditing(true);
    setEditingHabitacionId(habitacion.id);
    setDialogVisible(true);
  };

  const handleNuevo = () => {
    setEditingHabitacionId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingHabitacionId(null);
  };

  const handleSaveHabitacion = async (habitacion: Habitacion) => {
    try {
      console.log(habitacion);
      if (isEditing && editingHabitacionId !== null) {
        const response = await HabitacionService.update(editingHabitacionId, habitacion);
        if (response) {
          const habitaciones = await HabitacionService.getAll();
          setHabitaciones(habitaciones);
          mostrarToast('Habitación actualizada.', 'success');
        }
      } else {
        const response = await HabitacionService.create(habitacion);
        if (response) {
          const habitaciones = await HabitacionService.getAll();
          setHabitaciones(habitaciones);
          mostrarToast('Habitación creada.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingHabitacionId(null);
    } catch (error) {
      console.error('Error creating habitacion:', error);
      mostrarToast('Error al crear habitación.', 'error');
    }
  };

  const actionBodyTemplate = (rowData: Habitacion) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditHabitacion(rowData)}
          severity='info' outlined rounded data-pr-tooltip="Editar" />
        <Button type="button" outlined icon="pi pi-trash" severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />
      </div>
    );
  };

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const habitaciones = await HabitacionService.getAll();
        setHabitaciones(habitaciones);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching habitaciones:', error);
      }
    };

    fetchHabitaciones();
  }, []);

  const getEstadoLabel = (estado: string) => {
    const estadoOptions = [
      { label: 'Disponible', value: 'D' },
      { label: 'Reservada', value: 'R' },
      { label: 'Ocupada', value: 'O' },
      { label: 'Sucia', value: 'S' },
      { label: 'Limpieza', value: 'L' },
    ];
  
    const option = estadoOptions.find(option => option.value === estado);
    return option ? option.label : estado;
  };

  const aceptarAnular = async (habitacion: Habitacion) => {
    try {
      const response = await HabitacionService.updateAnulado(habitacion.id, { anulado: true });
      if (response) {
        const habitaciones = await HabitacionService.getAll();
        setHabitaciones(habitaciones);
        mostrarToast('Habitación eliminada.', 'success');
      }
    } catch (error) {
      console.error('Error eliminando habitación:', error);
      mostrarToast('Error al eliminar habitación.', 'error');
    }
  };

  const confirmarAnulacion = (habitacion: Habitacion) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => aceptarAnular(habitacion),
      reject: () => mostrarToast('Se canceló la anulación.', 'info'),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-info',
      rejectClassName: 'p-button-danger'
    });
  };

  return (
    <div className="card md:mx-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={habitaciones} filters={filters}
        onSelectionChange={(e) => setSelectedHabitacion(e.value)}
        selectionMode="single" selection={selectedHabitacion!}
        globalFilterFields={['nombre','precio', 'estado', 'claseHabitacion.nombre', 'nivel.nombre']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran habitaciones.">
        <Column field="nombre" sortable header="Nombre" style={{ width: '20%' }}></Column>
        <Column field="precio" sortable header="Precio" style={{ width: '20%' }}></Column>
        <Column field="estado" body={(rowData) => getEstadoLabel(rowData.estado)} sortable header="Estado" style={{ width: '15%' }}></Column>
        <Column field="nivel.nombre" sortable header="Nivel" style={{ width: '15%' }}></Column>
        <Column field="claseHabitacion.nombre" sortable header="Clase" style={{ width: '15%' }}></Column>
        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '15%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>

      <HabitacionDialog
        editar={isEditing}
        id={editingHabitacionId!}
        onHide={handleDialogHide}
        visible={dialogVisible}
        onSave={handleSaveHabitacion}
      />
    </div>
  );
}
