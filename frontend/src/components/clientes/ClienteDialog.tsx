import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClienteService } from '../../services/ClienteService';
import { Cliente } from '../../types/types';
import { Dropdown } from 'primereact/dropdown';
import { ClienteDialogProps } from '../../types/types';
import { ClienteSchema } from '../../helpers/validators/Validadores';
import { ClienteValidador } from '../../helpers/validators/Validadores';
import { useUser } from '../../hooks/UserContext';

const ClienteDialog: React.FC<ClienteDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const [tipoDocumento, setTipoDocumento] = useState<string>('NIT');
  const { user } = useUser();
  const tipoDocumentoOptions = [
    { label: 'NIT', value: 'NIT' },
    { label: 'CUI', value: 'CUI' },
    { label: 'IDE', value: 'IDE' }
  ];

  const defaultValues = {
    nombre: '',
    tipoDocumento: '',
    documento: '',
    telefono: '',
    direccion: ''
  };

  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<ClienteValidador>({
    defaultValues,
    resolver: zodResolver(ClienteSchema),
  });

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (editar && id) {
          const cliente = await ClienteService.getById(id);
          console.log(cliente);
          setValue('nombre', cliente.nombre);
          setValue('num_documento', cliente.numDocumento);
          setValue('telefono', cliente.telefono);
          setValue('direccion', cliente.direccion);
          setTipoDocumento(cliente.tipoDocumento)
        } else {
          reset(defaultValues);
        }
      } catch (error) {
        setError('root', { type: 'manual', message: 'Error al cargar el registro de cliente.' });
        console.error('Error fetching cliente:', error);
      }
    };

    if (visible) {
      fetchCliente();
    }
  }, [visible, editar, id, setValue, reset]);

  const onSubmit: SubmitHandler<ClienteValidador> = async (data) => {
    try {
      // const cliente: Cliente = { id, nombre: data.nombre, tipoDocumento, numeroDocumento: data.num_documento, telefono: data.telefono, direccion: data.direccion, activo: true,  );
      const cliente :Cliente = { id, nombre: data.nombre, tipoDocumento, numeroDocumento: data.num_documento, telefono: data.telefono, direccion: data.direccion, activo: true, usuario: user! };
      await onSave(cliente);
      onHide();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError('root', { type: 'manual', message: 'Error al guardar el cliente.' });
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-end">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label={isSubmitting ? "Guardando" : "Guardar"} icon="pi pi-check" type="submit" form="clienteForm" />
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={editar ? "Editar Cliente" : "Nuevo Cliente"} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <form id="clienteForm" onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="field">
          <label htmlFor="nombre">Nombre Completo</label>
          <InputText id="nombre" {...register('nombre')} />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
        </div>

        <div className="field">
          <label htmlFor="tipoDocumento">Tipo de Documento</label>
          <Dropdown id="tipoDocumento" value={tipoDocumento} options={tipoDocumentoOptions} onChange={(e) => setTipoDocumento(e.value)} placeholder="Seleccione un tipo de documento" />
        </div>

        <div className="field">
          <label htmlFor="documento">Documento</label>
          <InputText id="documento" {...register('num_documento')} />
          {errors.num_documento && <small className="p-error">{errors.num_documento.message}</small>}
        </div>

        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <InputText id="telefono" {...register('telefono')} />
          {errors.telefono && <small className="p-error">{errors.telefono.message}</small>}
        </div>

        <div className="field">
          <label htmlFor="direccion">Dirección</label>
          <InputText id="direccion" {...register('direccion')} />
          {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
        </div>
      </form>
    </Dialog>
  );
};

export default ClienteDialog;
