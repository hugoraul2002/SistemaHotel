import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProveedorService } from '../../services/ProveedorService';
import { Proveedor } from '../../types/types';
import { ProveedorDialogProps } from '../../types/types';

const ProveedorDialog: React.FC<ProveedorDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    nit: '',
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
  };

  const { register, handleSubmit, reset, setValue,  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        if (editar && id) {
          const proveedor = await ProveedorService.getProveedorById(id);
          setValue('nit', proveedor.nit);
          setValue('nombre', proveedor.nombre);
          setValue('telefono', proveedor.telefono);
          setValue('direccion', proveedor.direccion);
          setValue('email', proveedor.email);
        } else {            
          reset(defaultValues);
        }
      } catch (error) {
        setErrors({ root: 'Error al cargar el registro de proveedor.' });
        console.error('Error fetching proveedor:', error);
      }
    };

    if (visible) {
      fetchProveedor();
      setErrors({});
    }
  }, [visible, editar, id, setValue, reset]);

  const validate = (data: any) => {
    const newErrors: { [key: string]: string } = {};
    if (!data.nit) newErrors.nit = 'El nit es obligatorio';
    if (!data.nombre) newErrors.nombre = 'El nombre del proveedor es obligatorio';
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'El email es inválido.';
    return newErrors;
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setErrors({});
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const proveedor: Proveedor = { id: id || 0, ...data, anulado: false };
      onSave(proveedor);
      onHide();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      setErrors({ root: 'Error al guardar el proveedor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-end">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label={isSubmitting ? "Guardando" : "Guardar"} icon="pi pi-check" type="submit" form="proveedorForm" />
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={editar ? "Editar Proveedor" : "Nuevo Proveedor"} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <form id="proveedorForm" onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="field">
          <label htmlFor="nit">NIT</label>
          <InputText id="nit" {...register('nit')} />
          {errors.nit && <small className="p-error">{errors.nit}</small>}
        </div>

        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" {...register('nombre')} />
          {errors.nombre && <small className="p-error">{errors.nombre}</small>}
        </div>

        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <InputText id="telefono" {...register('telefono')} />
          {errors.telefono && <small className="p-error">{errors.telefono}</small>}
        </div>

        <div className="field">
          <label htmlFor="direccion">Dirección</label>
          <InputText id="direccion" {...register('direccion')} />
          {errors.direccion && <small className="p-error">{errors.direccion}</small>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText id="email" {...register('email')} />
          {errors.email && <small className="p-error">{errors.email}</small>}
        </div>
      </form>
    </Dialog>
  );
};

export default ProveedorDialog;
