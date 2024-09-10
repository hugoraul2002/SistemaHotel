import React, { useEffect } from 'react';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { MetodoPago } from '../../types/types';
import { AperturaCajaService } from '../../services/AperturaCajaService';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';

interface RegistroPagoProps {
  idDocumento: number;
  tipoDocumento: 'R' | 'H' | 'V' | 'G';
  setOpcionesPago: React.Dispatch<React.SetStateAction<MetodoPago[]>>;
  onSave: () => void;
  mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
  opcionesPago: MetodoPago[];
}

const RegistroPago: React.FC<RegistroPagoProps> = ({ tipoDocumento, setOpcionesPago, onSave, mostrarToast, opcionesPago }) => {

  const [aperturaId, setAperturaId] = React.useState<number>(0);
  const [aplicaApertura, setAplicaApertura] = React.useState<string>('Otros fondos');

  useEffect(() => {
    setOpcionesPago(opcionesPago);
    const getAperturaActiva = async () => {
      try {
        const apertura = await AperturaCajaService.getAperturaUsuario();
        setAperturaId(apertura.id);
      } catch (error) {
        mostrarToast('Error al obtener apertura activa', 'error');
      }
    }

    getAperturaActiva();
  }, [opcionesPago, setOpcionesPago]);


  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const _pagos = [...opcionesPago];
    const { newData, index } = e;
    _pagos[index] = newData;
    setOpcionesPago(_pagos);
  };

  const montoEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: InputNumberValueChangeEvent) => options.editorCallback!(e.value)}
        mode="currency"
        currency="GTQ"
      />
    );
  };

  const handleSave = () => {
    if (opcionesPago.some(pago => pago.monto > 0) && aplicaApertura !== '') {
      console.log('pagos', opcionesPago);
      const opciones_de_pago = opcionesPago.map(pago => {
        pago.idApertura = aplicaApertura==='Caja' ? aperturaId : null;
        return pago;
      })
      console.log('opciones_de_pago', opciones_de_pago);
      setOpcionesPago(opciones_de_pago);
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
      <h1 className="text-lg font-semibold">Registro de Pago de {subtitulo()}</h1>

      <DataTable value={opcionesPago} editMode="row" dataKey="metodo" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '30rem' }}>
        <Column field="metodo" header="Método de Pago" style={{ width: '50%' }}></Column>
        <Column
          field="monto"
          header="Monto"
          editor={montoEditor}
          style={{ width: '50%' }}
          body={(rowData: MetodoPago) => `Q. ${rowData.monto.toFixed(2)}`}
        />
        <Column rowEditor bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
      <div className="flex flex-wrap gap-3">
        <div className="flex align-items-center">
          <RadioButton inputId="caja" name="caja" value="Caja" onChange={(e: RadioButtonChangeEvent) => setAplicaApertura(e.value)} checked={aplicaApertura === 'Caja'} />
          <label htmlFor="caja" className="ml-2">Caja</label>
        </div>
        <div className="flex align-items-center">
          <RadioButton inputId="otrosfondos" name="pizza" value="Otros fondos" onChange={(e: RadioButtonChangeEvent) => setAplicaApertura(e.value)} checked={aplicaApertura === 'Otros fondos'} />
          <label htmlFor="otrosfondos" className="ml-2">Otros fondos</label>
        </div>
      </div>
      <Button label="Guardar" icon="pi pi-check" onClick={handleSave} className="mt-3" />
    </div>
  );
};

export default RegistroPago;
