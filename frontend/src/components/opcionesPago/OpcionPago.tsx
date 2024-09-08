import React, { useEffect, useState } from 'react';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { MetodoPago } from '../../types/types';


interface RegistroPagoProps {
  idDocumento: number;
  tipoDocumento: 'R' | 'H' | 'V' | 'G';
  setOpcionesPago: React.Dispatch<React.SetStateAction<MetodoPago[]>>;
  onSave: () => void;
  mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
}

const RegistroPago: React.FC<RegistroPagoProps> = ({ idDocumento, tipoDocumento, setOpcionesPago, onSave, mostrarToast }) => {
  const [pagos, setPagos] = useState<MetodoPago[]>([
    { metodo: 'EFECTIVO', monto: 0 },
    { metodo: 'TARJETA', monto: 0 },
  ]);

  useEffect(() => {
    setOpcionesPago(pagos);
  }, [pagos, setOpcionesPago]);

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const _pagos = [...pagos];
    const { newData, index } = e;
    _pagos[index] = newData;
    setPagos(_pagos);
  };

  const montoEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: InputNumberValueChangeEvent) => options.editorCallback!(e.value)}
        mode="currency"
        currency="Q"
      />
    );
  };

  const handleSave = () => {
    if (pagos.some(pago => pago.monto > 0)) {
      console.log('pagos', pagos);
      onSave();
    } else {
      mostrarToast('Complete una opción de pago.', 'warn');
    }
  };

  const subtitulo = () => {
    switch (tipoDocumento) {
      case 'R':
        return 'Reservación';
      case 'H':
        return 'Hospedaje';
      case 'V':
        return 'Venta';
      case 'G':
        return 'Gasto';
      default:
        return '';
    }
  };

  return (
    <div className="card p-fluid">
      <h1>Registro de Pago de {subtitulo()}</h1>

      <DataTable value={pagos} editMode="row" dataKey="metodo" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '30rem' }}>
        <Column field="metodo" header="Método de Pago" style={{ width: '50%' }}></Column>
        <Column
          field="monto"
          header="Monto"
          editor={montoEditor}
          style={{ width: '50%' }}
          body={(rowData: MetodoPago) => `Q. ${rowData.monto.toFixed(2)}`}
        />
        <Column rowEditor  bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>

      <Button label="Guardar" icon="pi pi-check" onClick={handleSave} className="mt-3" />
    </div>
  );
};

export default RegistroPago;
