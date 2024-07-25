
import { useState, useEffect } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UsuarioService } from '../services/UsuarioService';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Usuario } from '../types/types';


export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH }

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
      <div className="flex place-content-between gap-2">
        <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
        </IconField>
        </div>
        <div className="flex gap-2">
          <Button type="button" icon="pi pi-file" rounded data-pr-tooltip="CSV" />
          <Button type="button" icon="pi pi-file-excel" severity="success" rounded data-pr-tooltip="XLS" />
          <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded data-pr-tooltip="PDF" />
        </div>
      </div>


    );
  };
  const header = renderHeader();
  const handleEditCustomer = (user: Usuario) => {
    console.log('Edit user:', user);
  };


  const handleDeleteCustomerClick = (user: Usuario) => {
    console.log('Delete user:', user);
  };
  const actionBodyTemplate = (rowData: Usuario) => {

    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditCustomer(rowData)}
          severity='info' rounded data-pr-tooltip="CSV" />
        <Button type="button" icon="pi pi-trash" severity="danger" onClick={() => handleDeleteCustomerClick(rowData)} rounded data-pr-tooltip="XLS" />
      </div>
    );
  };
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const users = await UsuarioService.getAllUsers();
        setUsuarios(users);
        setLoading(false);
        console.log(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsuarios();
  }, []);


  return (
    <div className="card md:mx-4">
      <DataTable dataKey="id" loading={loading} stripedRows size='small' value={usuarios} filters={filters}
        globalFilterFields={['fullName', 'email']} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} header={header} emptyMessage="No se encuentraron usuarios.">
        <Column field="fullName" sortable header="Nombre" style={{ width: '25%' }}></Column>
        <Column field="email" sortable header="Email" style={{ width: '25%' }}></Column>
        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '25%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>
    </div>
  );
}
