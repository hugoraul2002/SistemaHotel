import React, { useEffect, useState, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProveedorService } from '../services/ProveedorService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { AuthModulo, Proveedor } from '../types/types';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ProveedorDialog from '../components/gastos/FormProveedor';
import { useNavigate } from 'react-router-dom';
import { authModulo } from '../services/AuthService';


const ProveedoresPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [anulados, setAnulados] = useState<boolean>(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProveedorId, setEditingProveedorId] = useState<number | null>(null);
  const [userAuth, setUserAuth] = useState<AuthModulo | null>(null);
  const navigate = useNavigate();
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
  const handleEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedorId(proveedor.id);
    setIsEditing(true);
    setDialogVisible(true);
  };

  const handleNuevo = () => {
    setEditingProveedorId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingProveedorId(null);
  };
  const renderHeader = () => {
    return (
      <>
        <h1 className='font-semibold text-lg mb-4'>Listado de Proveedores</h1>
        <div className="flex place-content-between gap-2">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
            </IconField>
          </div>
          <div className="flex gap-2">
            <Button type="button" icon="pi pi-plus" rounded data-pr-tooltip="Nuevo" onClick={handleNuevo} />
            {/* <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" /> */}
            <Button type="button" label={anulados ? 'Inactivos' : 'Activos'} rounded onClick={() => setAnulados(!anulados)} size='small' />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  

  const handleSaveProveedor = async (proveedor: Proveedor) => {
    try {
      if (isEditing && editingProveedorId !== null) {
        const response = await ProveedorService.updateProveedor(editingProveedorId, proveedor);
        if (response) {
          const proveedores = await ProveedorService.getAllProveedors(anulados);
          setProveedores(proveedores);
          mostrarToast('Proveedor actualizado.', 'success');
        }
      } else {
        const response = await ProveedorService.createProveedor(proveedor);
        if (response) {
          const proveedores = await ProveedorService.getAllProveedors(anulados);
          setProveedores(proveedores);
          mostrarToast('Proveedor creado.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingProveedorId(null);
    } catch (error) {
      console.error('Error creating proveedor:', error);
      mostrarToast('Error al crear proveedor.', 'error');
    }
  };

  const actionBodyTemplate = (rowData: Proveedor) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditProveedor(rowData)} disabled={anulados} className='hover:bg-sky-500 hover:text-white'
          severity='info' outlined rounded data-pr-tooltip="Editar" />
        {userAuth?.user.rol.nombre === "ADMIN" && <Button type="button" outlined icon={anulados ? 'pi pi-replay' : 'pi pi-minus-circle'} className='hover:bg-red-500 hover:text-white' severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />}
      </div>
    );
  };

  useEffect(() => {    
    const fetchProveedores = async () => {
      try {
        const proveedores = await ProveedorService.getAllProveedors(anulados);
        setProveedores(proveedores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, [anulados]);

  useEffect(() => {
    const auth = async () => {
      try {
        const response: AuthModulo = await authModulo('Proveedores');

        if (!response.allowed) {
          navigate('/Inicio');
        }
        setUserAuth(response);
      } catch (error) {
        console.error('Error fetching auth:', error);
      }
    }

    auth();
  },[]);

  const aceptarAnular = async (proveedor: Proveedor) => {
    try {
      const response = await ProveedorService.updateAnulado(proveedor.id);
      if (response) {
        const proveedores = await ProveedorService.getAllProveedors(anulados);
        setProveedores(proveedores);
        mostrarToast(anulados ? 'Proveedor activado.' : 'Proveedor anulado.', 'success');
      }
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      mostrarToast('Error al eliminar proveedor.', 'error');
    }
  };

  const confirmarAnulacion = (proveedor: Proveedor) => {
    const mensaje = !anulados ? '¿Estás seguro de anular el registro?' : '¿Estás seguro de activar el registro?';
    confirmDialog({
      message: mensaje,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => aceptarAnular(proveedor),
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
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={proveedores} filters={filters}
        onSelectionChange={(e) => setSelectedProveedor(e.value)}
        selectionMode="single" selection={selectedProveedor!}
        globalFilterFields={['nombre', 'nit', 'telefono', 'email', 'direccion']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran proveedores.">
        <Column field="nit" sortable header="NIT" ></Column>

        <Column field="nombre" sortable header="Nombre" style={{ width: '50%' }}></Column>
        <Column field="telefono" sortable header="Teléfono" ></Column>
        <Column field="direccion" sortable header="Dirección" style={{ width: '50%' }}></Column>

        <Column field="email" sortable header="Correo" style={{ width: '50%' }}></Column>

        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '10%', textAlign: 'center' }} exportable={false}></Column>

      </DataTable>
      <ProveedorDialog
        editar={isEditing}
        id={editingProveedorId!}
        visible={dialogVisible}
        onHide={handleDialogHide}
        onSave={handleSaveProveedor}
      />
    </div>
  );
};

export default ProveedoresPage;
