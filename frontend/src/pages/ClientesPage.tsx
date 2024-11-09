import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ClienteService } from '../services/ClienteService'
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AuthModulo, Cliente } from '../types/types';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ClienteDialog from '../components/clientes/ClienteDialog';
import { authModulo } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export default function ClientePage() {
  const toast = useRef<Toast>(null);
  const [userAuth, setUserAuth] = useState<AuthModulo | null>(null);
  const navigate = useNavigate();
  const [anulados, setAnulados] = useState<boolean>(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tipoDocumento: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    numDocumento: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    telefono: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    direccion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // 'user.fullName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClienteId, setEditingClienteId] = useState<number | null>(null);

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
        <h1 className='font-semibold text-lg mb-4'>Listado de clientes</h1>
        <div className="flex place-content-between gap-2">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
            </IconField>
          </div>
          <div className="flex gap-2">
            <Button type="button" icon="pi pi-plus" rounded  onClick={() => handleNuevo()} />
            {/* <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" onClick={exportToExcel} /> */}
            {/* <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" /> */}
            <Button type="button" label={anulados ? 'Inactivos' : 'Activos'} rounded onClick={() => setAnulados(!anulados)} size='small' />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  const handleEditCliente = (cliente: Cliente) => {
    console.log(cliente);
    setEditingClienteId(cliente.id);
    setIsEditing(true);
    setDialogVisible(true);
  };

  const handleNuevo = () => {
    setEditingClienteId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingClienteId(null);
  };

  const handleSaveCliente = async (cliente: Cliente) => {
    try {
      console.log(cliente);
      if (isEditing && editingClienteId !== null) {
        const response = await ClienteService.update(editingClienteId, cliente);
        if (response) {
          const clientes = await ClienteService.getAll(anulados);
          setClientes(clientes);
          mostrarToast('Cliente actualizado.', 'success');
        }
      } else {
        const response = await ClienteService.create(cliente);
        if (response) {
          const clientes = await ClienteService.getAll(anulados);
          setClientes(clientes);
          mostrarToast('Cliente creado.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingClienteId(null);
    } catch (error) {
      console.error('Error creating cliente:', error);
      mostrarToast('Error al crear cliente.', 'error');
    }
  };

  const actionBodyTemplate = (rowData: Cliente) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditCliente(rowData)} disabled={anulados} className='hover:bg-sky-500 hover:text-white'
          severity='info' outlined rounded  />
        {userAuth?.user.rol.nombre === "ADMIN" && <Button type="button" outlined icon={anulados ? 'pi pi-replay' : 'pi pi-minus-circle'} className='hover:bg-red-500 hover:text-white'  severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded />}
      </div>
    );
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientes = await ClienteService.getAll(anulados);

        setClientes(clientes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, [anulados]);

  useEffect(() => {
    const auth = async () => {
      try {
        const response: AuthModulo = await authModulo('Clientes');

        if (!response.allowed) {
          navigate('/Inicio');
        }
        setUserAuth(response);
      } catch (error) {
        console.error('Error fetching auth:', error);
      }
    }

    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aceptarAnular = async (cliente: Cliente) => {
    try {
      const response = await ClienteService.updateActivo(cliente.id);
      if (response) {
        const clientes = await ClienteService.getAll(anulados);
        setClientes(clientes);
        mostrarToast(anulados ? 'Cliente activado.' : 'Cliente anulado.', 'success');
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      mostrarToast('Error al eliminar cliente.', 'error');
    }
  };

  const confirmarAnulacion = (cliente: Cliente) => {
    const mensaje = !anulados ? '¿Estás seguro de anular el registro?' : '¿Estás seguro de activar el registro?';
    confirmDialog({
      message: mensaje,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => aceptarAnular(cliente),
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
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={clientes} filters={filters}
        onSelectionChange={(e) => setSelectedCliente(e.value)}
        selectionMode="single" selection={selectedCliente!}
        globalFilterFields={['nombre', 'tipoDocumento', 'numDocumento', 'telefono', 'direccion']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran clientes.">
        <Column field="id" header="Código" style={{ width: 'auto', textAlign: 'center' }}></Column>        
        <Column field="nombre" sortable header="Nombre" style={{ width: '20%' }}></Column>
        <Column field="tipoDocumento" sortable header="Tipo Documento" style={{ width: '15%' }}></Column>
        <Column field="numDocumento" sortable header="Número Documento" style={{ width: '20%' }}></Column>
        <Column field="telefono" sortable header="Teléfono" style={{ width: '15%' }}></Column>
        <Column field="direccion" sortable header="Dirección" style={{ width: '20%' }}></Column>
        <Column field="email" sortable header="Email" style={{ width: '20%' }}></Column>
        <Column field="nacionalidad" sortable header="Nacionalidad" style={{ width: '20%' }}></Column>

        {/* <Column field="user.fullName" sortable header="Usuario" style={{ width: '20%' }}></Column> */}

        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '10%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>
      <ClienteDialog
        editar={isEditing}
        id={editingClienteId!}
        visible={dialogVisible}
        onHide={handleDialogHide}
        onSave={handleSaveCliente}

      />
    </div>
  );
}
