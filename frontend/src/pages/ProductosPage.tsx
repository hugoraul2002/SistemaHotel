import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Producto } from '../types/types';
import { ProductoService } from '../services/ProductoService';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ProductoDialog from '../components/productos/FormProducto';

const ProductosPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductoId, setEditingProductoId] = useState<number | null>(null);
  const [anulados, setAnulados] = useState<boolean>(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
    setEditingProductoId(null);
    setIsEditing(false);
    setDialogVisible(true);
  };
  const renderHeader = () => {
    return (
      <>
        <h1 className='font-semibold text-lg mb-4'>Listado de productos</h1>
        <div className="flex place-content-between gap-2">

          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
          <div className="flex gap-1">
            <Button type="button" icon="pi pi-plus" rounded onClick={handleNuevo} />
            <Button type="button" label={anulados ? 'Inactivos' : 'Activos'} rounded onClick={() => setAnulados(!anulados)} />

          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  const handleEditProducto = (producto: Producto) => {
    setEditingProductoId(producto.id);
    setIsEditing(true);
    setDialogVisible(true);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditingProductoId(null);
  };

  const handleSaveProducto = async (producto: Producto) => {
    try {
      if (isEditing && editingProductoId !== null) {
        const response = await ProductoService.updateProducto(producto);
        if (response) {
          const productos = await ProductoService.getAll(anulados);
          setProductos(productos);
          mostrarToast('Producto actualizado.', 'success');
        }
      } else {
        const response = await ProductoService.createProducto(producto);
        if (response) {
          const productos = await ProductoService.getAll(anulados);
          setProductos(productos);
          mostrarToast('Producto creado.', 'success');
        }
      }
      setDialogVisible(false);
      setEditingProductoId(null);
    } catch (error) {
      console.error('Error creating producto:', error);
      mostrarToast('Error al crear producto.', 'error');
    }
  };

  const actionBodyTemplate = (rowData: Producto) => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button type="button" icon="pi pi-pen-to-square" onClick={() => handleEditProducto(rowData)}
          severity='info' outlined rounded />
        <Button type="button" outlined icon="pi pi-trash" severity="danger" onClick={() => confirmarAnulacion(rowData)} rounded />
      </div>
    );
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productos = await ProductoService.getAll(anulados);
        console.log(productos);
        setProductos(productos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [anulados]);

  const aceptarAnular = async (producto: Producto) => {
    try {
      const response = await ProductoService.updateActivo(producto.id);
      if (response) {
        const productos = await ProductoService.getAll(anulados);
        setProductos(productos);
        mostrarToast('Producto eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      mostrarToast('Error al eliminar producto.', 'error');
    }
  };

  const confirmarAnulacion = (producto: Producto) => {
    confirmDialog({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => aceptarAnular(producto),
      reject: () => mostrarToast('Se canceló la anulación.', 'info'),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-info',
      rejectClassName: 'p-button-danger'
    });
  };

  const esServicioTemplate = (rowData: Producto) => {
    return (
      <div className="flex align-items-center gap-2">
        <p>{rowData.esServicio ? 'Si' : 'No'}</p>
      </div>
    );
  };


  return (
    <div className="card md:mx-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={productos} filters={filters}
        selectionMode="single" selection={selectedProducto!}
        onSelectionChange={(e) => setSelectedProducto(e.value)}
        globalFilterFields={['nombre', 'codigo', 'costo', 'existencia', 'esServicio']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} header={header} emptyMessage="No se encuentran productos.">
        <Column field="codigo" sortable header="Código" style={{ width: '15%' }}></Column>
        <Column field="nombre" sortable header="Nombre" style={{ width: '30%' }}></Column>
        <Column field="costo" sortable header="Costo" style={{ width: '15%' }}></Column>
        <Column field="precioVenta" sortable header="Precio Venta" style={{ width: '15%' }}></Column>
        <Column field="existencia" sortable header="Existencia" style={{ width: '10%' }}></Column>
        <Column field="esServicio" body={esServicioTemplate} sortable header="Servicio" style={{ width: '10%' }}></Column>
        {/* <Column field="fechaIngreso" sortable header="Fecha Ingreso" style={{ width: '15%' }}></Column> */}
        <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '10%', textAlign: 'center' }} exportable={false}></Column>
      </DataTable>

      <ProductoDialog
        editar={isEditing}
        id={editingProductoId!}
        visible={dialogVisible}
        onHide={handleDialogHide}
        onSave={handleSaveProducto}
      />
    </div>
  );
};

export default ProductosPage;
