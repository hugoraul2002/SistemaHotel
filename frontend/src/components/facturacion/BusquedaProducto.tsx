import React, { useState, useEffect } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Producto } from '../../types/types';
import { ProductoService } from '../../services/ProductoService';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


const BusquedaProducto: React.FC<{ onProductSelect: (product: any) => void }> = ({ onProductSelect }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        <h1 className='font-semibold text-lg mb-4'>Listado de productos</h1>
        <div className="flex place-content-between gap-2">

          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
        </div>
      </>
    );
  };

  const header = renderHeader();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productos = await ProductoService.getAll(false);
        console.log(productos);
        setProductos(productos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleRowSelect = (product: any) => {
    onProductSelect(product); // Pasar el producto seleccionado al componente padre
}; 
  return (
    <div className="card md:mx-4">
      <DataTable dataKey="id" loading={loading} showGridlines size='small' value={productos} filters={filters}
        selectionMode="single" selection={selectedProducto!} 
        onSelectionChange={(e) => setSelectedProducto(e.value)}
        globalFilterFields={['nombre', 'codigo', 'costo', 'existencia', 'esServicio']} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} header={header} emptyMessage="No se encuentran productos.">
        <Column field="codigo" sortable header="Código" style={{ width: '15%' }}></Column>
        <Column field="nombre" sortable header="Nombre" style={{ width: '30%' }}></Column>
        <Column field="precioVenta" sortable header="Precio Venta" style={{ width: '15%' }}></Column>
        <Column field="existencia" sortable header="Existencia" style={{ width: '10%' }}></Column>
        <Column
                body={(rowData) => (
                    <Button
                        label="Seleccionar"
                        icon="pi pi-check"
                        onClick={() => handleRowSelect(rowData)}
                        size='small'
                    />
                )}
                header="Acción"
            />
      </DataTable>
    </div>
  );
};

export default BusquedaProducto;
