import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Cliente, Usuario } from '../../types/types';
interface ClienteDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (cliente: Cliente) => void;
  cliente: Cliente | null;
}

const ClienteDialog: React.FC<ClienteDialogProps> = ({ visible, onHide, onSave, cliente }) => {
  const [nombre, setNombre] = useState(cliente ? cliente.nombre : '');
  const [tipoDocumento, setTipoDocumento] = useState(cliente ? cliente.tipoDocumento : '');
  const [numeroDocumento, setNumeroDocumento] = useState(cliente ? cliente.numeroDocumento : '');
  const [telefono, setTelefono] = useState(cliente ? cliente.telefono : '');
  const [direccion, setDireccion] = useState(cliente ? cliente.direccion : '');
  const [formValid, setFormValid] = useState(false);

  const tipoDocumentoOptions = [
    { label: 'NIT', value: 'NIT' },
    { label: 'CUI', value: 'CUI' },
    { label: 'IDE', value: 'IDE' }
  ];

  useEffect(() => {
    setFormValid(
      nombre.trim() !== '' &&
      tipoDocumento.trim() !== '' &&
      numeroDocumento.trim() !== '' &&
      telefono.trim() !== '' &&
      direccion.trim() !== ''
    );
  }, [nombre, tipoDocumento, numeroDocumento, telefono, direccion]);

  const handleSave = () => {
    if (formValid) {
      const newCliente: Cliente = {
        id: cliente ? cliente.id : 0,
        nombre,
        tipoDocumento,
        numeroDocumento,
        telefono,
        direccion,
        activo: true,
        usuario:{} as Usuario,
      };
      onSave(newCliente);
    }
  };

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header="Cliente" modal onHide={onHide}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoFocus />
        </div>
        <div className="field">
          <label htmlFor="tipoDocumento">Tipo de Documento</label>
          <Dropdown id="tipoDocumento" value={tipoDocumento} options={tipoDocumentoOptions} onChange={(e) => setTipoDocumento(e.value)} placeholder="Seleccione" />
        </div>
        <div className="field">
          <label htmlFor="numeroDocumento">Número de Documento</label>
          <InputText id="numeroDocumento" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <InputText id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="direccion">Dirección</label>
          <InputText id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div className="p-d-flex p-jc-end">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
          <Button label="Guardar" icon="pi pi-check" onClick={handleSave} disabled={!formValid} />
        </div>
      </div>
    </Dialog>
  );
};

export default ClienteDialog;
