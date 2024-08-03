import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClaseHabitacionSchema, ClaseHabitacionValidador } from '../../helpers/validators/Validadores';
import { ClaseHabitacion } from '../../types/types';
import { ClaseHabitacionService } from '../../services/ClaseHabitacionService';
import {FormClaseHabitacionProps} from '../../types/types';

const FormClaseHabitacion: React.FC<FormClaseHabitacionProps> = ({ editar, id, onHide, visible, onSave }) => {
  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<ClaseHabitacionValidador>({
    defaultValues: {
      nombre: ''
    },
    resolver: zodResolver(ClaseHabitacionSchema),
  });

  useEffect(() => {
    if (!visible) {
      reset({
        nombre: ''
      });
    }
  }, [visible, reset]);

  useEffect(() => {
    const fetchClaseHabitacion = async () => {
      try {
        const claseHabitacion = await ClaseHabitacionService.getClaseHabitacionById(id);
        setValue('nombre', claseHabitacion.nombre);
      } catch (error) {
        setError('root', { type: 'manual', message: 'Error al cargar la clase de habitación.' });
      }
    };

    if (editar && id) {
      fetchClaseHabitacion();
    } else {
      reset({
        nombre: ''
      });
    }
  }, [editar, id, reset, setValue]);

  const onSubmit: SubmitHandler<ClaseHabitacionValidador> = async (data) => {
    try {
      const claseHabitacion: ClaseHabitacion = { id: id, nombre: data.nombre, anulado: false };
      onSave(claseHabitacion);
      onHide();
    } catch (error) {
      setError('root', { message: "Error al retornar la clase de habitación." });
    }
  };

  return (
    <Dialog header={editar ? "Editar Clase de Habitación" : "Crear Clase de Habitación"} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card flex flex-col gap-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-tag"></i>
            </span>
            <InputText {...register('nombre')} placeholder="Nombre" />
          </div>
          {errors.nombre && <div className="text-red-500 text-left text-xs">{errors.nombre.message}</div>}
          
          <div className="mt-8">
            <Button
              label={isSubmitting ? 'Guardando...' : editar ? 'Guardar cambios' : 'Crear'}
              icon={isSubmitting ? "pi pi-spin pi-spinner" : undefined}
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              type="submit"              
            />
            {errors.root && <div className="text-red-500 mt-1 text-sm">{errors.root.message}</div>}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default FormClaseHabitacion;
