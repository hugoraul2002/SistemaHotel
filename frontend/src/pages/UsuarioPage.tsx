import { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UsuarioService } from '../services/UsuarioService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AuthModulo, Usuario } from '../types/types';
import { Toast } from 'primereact/toast';
import FormUsuario from '../components/usuarios/FormUsuario';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from 'react-router-dom';
import { authModulo } from '../services/AuthService';

export default function UsuarioPage() {
  const [userAuth, setUserAuth] = useState<AuthModulo | null>(null);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    rol: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    console.log('filters:', _filters);
    if ('value' in _filters['global']) {
      _filters['global'].value = value;
    }
    console.log('filters:', _filters);

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <>
        <h1 className='font-semibold text-lg mb-4'>Listado de usuarios</h1>
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

  const handleEditUsuario = (user: Usuario) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setDialogVisible(true);
  };
  const handleNuevo = () => {
    setEditingUserId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };


  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingUserId(null);
  };
  const handleSaveUser = async (user: Usuario) => {
    try {
      if (isEditing && editingUserId !== null) {
        const response = await UsuarioService.updateUser(editingUserId, { full_name: user.full_name, email: user.email, rolId: user.rol.id });
        if (response) {
          const users = await UsuarioService.getAllUsers();
          setUsuarios(users);
          mostrarToast('Usuario actualizado.', 'success');
        }
      } else {
        const response = await UsuarioService.createUser({ full_name: user.full_name, email: user.email, password: user.password, rol_id: user.rol.id });
        if (response) {
          const users = await UsuarioService.getAllUsers();
          setUsuarios(users);
          mostrarToast('Usuario creado.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingUserId(null);
    } catch (error) {
      console.error('Error creando usuario:', error);
      mostrarToast('Error al crear usuario.', 'error');
    }

  }

  const actionBodyTemplate = (rowData: Usuario) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditUsuario(rowData)}
          severity='info' outlined rounded data-pr-tooltip="Editar" />
        {userAuth?.user.rol.nombre === "ADMIN" && <Button type="button" outlined icon="pi pi-trash" severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded data-pr-tooltip="Eliminar" />}
      </div>
    );
  };

  useEffect(() => {
    const auth = async () => {
      try {
        const response: AuthModulo = await authModulo('Usuarios');

        if (!response.allowed) {
          navigate('/Inicio');
        }
        setUserAuth(response);
      } catch (error) {
        console.error('Error fetching auth:', error);
      }
    }

    auth();
    const fetchUsuarios = async () => {
      try {
        const users = await UsuarioService.getAllUsers();
        setUsuarios(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const acceptarAnular = async (usuario: Usuario) => {
    try {
      const response = await UsuarioService.updateAnulado(usuario.id, { anulado: true });
      console.log('response:', response);
      if (response) {
        const users = await UsuarioService.getAllUsers();
        setUsuarios(users);
        mostrarToast('Usuario eliminado.', 'success');
      }

    } catch (error) {
      console.error('Error eliminando usuario:', error);
      mostrarToast('Error al eliminar usuario.', 'error');
    }
  }

  const confirmarAnulacion = (usuario: Usuario) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptarAnular(usuario),
      reject: () => mostrarToast('Se cancelo la anulación.', 'info'),
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
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={usuarios} filters={filters}
        onSelectionChange={(e) => setSelectedUser(e.value)}
        selectionMode="single" selection={selectedUser!}
        globalFilterFields={['fullName', 'email', 'rol']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentran usuarios.">
        <Column field="fullName" sortable header="Nombre" style={{ width: '25%' }}></Column>
        <Column field="email" sortable header="Email" style={{ width: '25%' }}></Column>
        <Column field="rol" sortable header="Rol" style={{ width: '25%' }}></Column>
        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '25%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>

      <FormUsuario
        editar={isEditing}
        id={editingUserId!}
        onHide={handleDialogHide}
        visible={dialogVisible}
        onSave={handleSaveUser}
      />
    </div>
  );
}
