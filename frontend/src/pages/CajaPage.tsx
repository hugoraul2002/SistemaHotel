import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { NivelService } from '../services/NivelService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Nivel } from '../types/types';
import NivelDialog from '../components/niveles/FormNivel'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUser } from '../hooks/UserContext';

function CajaPage() {
    const toast = useRef<Toast>(null);
    const { user } = useUser();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNivelId, setEditingNivelId] = useState<number | null>(null);
    const [niveles, setNiveles] = useState<Nivel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      descripcion: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
      setEditingNivelId(null);
      setIsEditing(false);
      setDialogVisible(true);
    };
  
    const renderHeader = () => {
      return (
        <>
        <h1 className='font-semibold text-lg mb-4'>Listado de niveles</h1>  
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
          </div>
        </div>
        </>
      );
    };
  
    const header = renderHeader();
  
    const actionBodyTemplate = (rowData: Nivel) => {
      return (
        <div className="flex align-items-center justify-content-end gap-2">
          <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditNivel(rowData)}
            severity='info' outlined rounded data-pr-tooltip="Editar" />
          {user?.rol.nombre==="ADMIN" &&  <Button type="button" outlined icon="pi pi-trash" severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />}
        </div>
      );
    };
  
    const handleDialogHide = () => {
      setDialogVisible(false);
      setEditingNivelId(null);
    };
  
    const handleEditNivel = (nivel: Nivel) => {
      setIsEditing(true);
      setEditingNivelId(nivel.id);
      setDialogVisible(true);
    };
  
    const handleSaveNivel = async (nivel: Nivel) => {
      try {
        console.log('nivel:', nivel);
        if (isEditing && editingNivelId !== null) {
          console.log('Updating nivel:', editingNivelId, nivel);
          const response = await NivelService.updateNivel(editingNivelId, { nombre: nivel.nombre });
          if (response) {
            const nivelesActualizados = await NivelService.getAllNiveles();
            setNiveles(nivelesActualizados);
            mostrarToast('Nivel actualizado.', 'success');
          }
        } else {
          console.log('Creating new user:', nivel);
          const response = await NivelService.createNivel({ nombre: nivel.nombre });
          console.log(response);
          if (response) {
            const nivelesActualizados = await NivelService.getAllNiveles();
            setNiveles(nivelesActualizados);
            mostrarToast('Nivel creado.', 'success');
          }
        }
        setDialogVisible(false);
        setEditingNivelId(null);
      } catch (error) {
        console.error('Error creating user:', error);
        mostrarToast('Error al crear usuario.', 'error');
      }
  
    }
  
    useEffect(() => {
      const fetchNiveles = async () => {
        try {
          const niveles = await NivelService.getAllNiveles();
          console.log(niveles);
          setNiveles(niveles);
          setLoading(false);
          console.log(niveles);
        } catch (error) {
          console.error('Error fetching niveles:', error);
          mostrarToast('Error al cargar niveles.', 'error');
        }
      };
  
      fetchNiveles();
    }, []);
  
    const confirmarAnulacion = (nivel: Nivel) => {
      confirmDialog({
        message: '¿Estás seguro de eliminar?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => acceptarAnular(nivel),
        reject: () => mostrarToast('Se cancelo la anulación.', 'info'),
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptClassName: 'p-button-info',
        rejectClassName: 'p-button-danger'
      });
    };
  
    const acceptarAnular = async (nivel: Nivel) => {
      try {
        const response = await NivelService.updateAnulado(nivel.id, { anulado: true });
        console.log('response:', response);
        if (response) {
          const nivelesActualizados = await NivelService.getAllNiveles();
          setNiveles(nivelesActualizados);
          mostrarToast('Nivel eliminado.', 'success');
        }
  
      } catch (error) {
        console.error('Error eliminando nivel:', error);
        mostrarToast('Error al eliminar usuario.', 'error');
      }
    }
  
    return (
      <div className="card md:mx-4">
        <Toast ref={toast} />
        <ConfirmDialog/>
        <DataTable dataKey="id" loading={loading} showGridlines size='small' value={niveles} filters={filters}
          globalFilterFields={['nombre', 'descripcion']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran niveles.">
          <Column field="nombre" sortable header="Nombre" style={{ width: '25%' }}></Column>
          <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '25%', textAlign: 'center' }} exportable={false}></Column>
        </DataTable>
        <NivelDialog
          editar={isEditing}
          id={editingNivelId!}
          onHide={handleDialogHide}
          visible={dialogVisible}
          onSave={handleSaveNivel}
        />
      </div>
    );
}

export default CajaPage