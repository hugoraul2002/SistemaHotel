import React, { useEffect } from 'react';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { MetodoPago } from '../../types/types';
import { AperturaCajaService } from '../../services/AperturaCajaService';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';

interface RegistroPagoProps {
  monto: number;
  tipoDocumento: 'R' | 'H' | 'FV' | 'FG';
  setOpcionesPago: React.Dispatch<React.SetStateAction<MetodoPago[]>>;
  onSave: () => void;
  mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
  opcionesPago: MetodoPago[];
  editar: boolean;
}

const RegistroPago: React.FC<RegistroPagoProps> = ({ monto, tipoDocumento, setOpcionesPago, onSave, mostrarToast, opcionesPago, editar }) => {
  const [aperturaId, setAperturaId] = React.useState<number>(0);
  const [aplicaApertura, setAplicaApertura] = React.useState<string>('Otros fondos');
  const [tieneApertura, setTieneApertura] = React.useState<boolean>(false);
  useEffect(() => {
    if (editar) {
      if (opcionesPago.some((pago) => pago.idApertura !== null && pago.idApertura !== undefined)) {
        setAplicaApertura('Caja');
      } else {
        setAplicaApertura('Otros fondos');
      }
    } else {
      const getAperturaActiva = async () => {
        try {
          const apertura = await AperturaCajaService.getAperturaUsuario();
          if (apertura) {
            console.log('apertura', apertura);
            console.log('aperturaActiva', apertura.aperturaActiva);
            if (apertura.aperturaActiva) {
              setAperturaId(apertura.data.id_apertura);
              setTieneApertura(true);
            }
          }
        } catch (error) {
          mostrarToast('Error al obtener apertura activa', 'error');
        }
      }

      getAperturaActiva();
    }
  }, [opcionesPago, setOpcionesPago]);

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const _pagos = [...opcionesPago];
    const { newData, index } = e;
    const metodoPago: MetodoPago = {
      metodo: newData.metodo,
      monto: newData.monto,
    };
    _pagos[index] = metodoPago;
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
  const validaMontoPago = () => {
    let montoPagado: number = 0;
    opcionesPago.map(pago => {
      montoPagado += pago.monto;
    })
    if (!opcionesPago.some(pago => pago.monto > 0)) {
      mostrarToast('Ingrese una opción de pago.', 'warn');
      return false;
    }
    if (montoPagado > monto) {
      mostrarToast('El monto ingresado supera al monto a pagar.', 'warn');
      return false;
    }
    if (montoPagado < monto) {
      mostrarToast('El monto ingresado es menor al monto a pagar.', 'warn');
      return false;
    }
    return true;
  }
  const handleSave = () => {
    if (validaMontoPago()) {
      console.log('pagos', opcionesPago);
      const opciones_de_pago = opcionesPago
        .map(pago => {
          pago.idApertura = aplicaApertura === 'Caja' ? aperturaId : null;
          return pago;
        })
      console.log('opciones_de_pago', opciones_de_pago);
      setOpcionesPago(opciones_de_pago);
      onSave();
    }
  };

  const subtitulo = () => {
    switch (tipoDocumento) {
      case 'R':
        return 'Reservación';
      case 'H':
        return 'Hospedaje';
      case 'FV':
        return 'Venta';
      case 'FG':
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
        {!editar &&
          <Column rowEditor bodyStyle={{ textAlign: 'center' }}></Column>
        }
      </DataTable>
      <div className="flex flex-col gap-4 my-4 justify-end">
        <p>Pagado: Q. {opcionesPago.reduce((acumulado, pago) => acumulado + pago.monto, 0).toFixed(2)}</p>
        <p>Total: Q. {monto.toFixed(2)}</p>
      </div>
      {tipoDocumento == 'FG' &&
        <div className="flex flex-wrap gap-4 my-4 justify-end">
          <div className="flex align-items-center">
            <RadioButton inputId="caja" disabled={!tieneApertura} name="caja" value="Caja" onChange={(e: RadioButtonChangeEvent) => setAplicaApertura(e.value)} checked={aplicaApertura === 'Caja'} />
            <label htmlFor="caja" className="ml-2">Caja</label>
          </div>
          <div className="flex align-items-center">
            <RadioButton inputId="otrosfondos" name="pizza" value="Otros fondos" onChange={(e: RadioButtonChangeEvent) => setAplicaApertura(e.value)} checked={aplicaApertura === 'Otros fondos'} />
            <label htmlFor="otrosfondos" className="ml-2">Otros fondos</label>
          </div>
        </div>
      }
      <Button label="Guardar" icon="pi pi-check" onClick={handleSave} className="mt-3" />
    </div>
  );
};

export default RegistroPago;
