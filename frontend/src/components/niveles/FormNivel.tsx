import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NivelSchema, NivelValidador } from '../../helpers/validators/Validadores';
import { Nivel } from '../../types/types';
import { NivelService } from '../../services/NivelService';
import {NivelDialogProps} from '../../types/types';

const NivelDialog: React.FC<NivelDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<NivelValidador>({
    defaultValues: {
      nombre:''
    },
    resolver: zodResolver(NivelSchema),
  });
  useEffect(() => {
    if (!visible) {
      reset({
        nombre:''
      });
    }
  }, [visible, reset]);

  useEffect(() => {
    const fetchNivel = async () => {
        try{
            const nivel = await NivelService.getNivelById(id) ;
            setValue('nombre',nivel.nombre)            
        } catch(error){
            setError('root', { type: 'manual', message: 'Error al cargar el nivel.' });
        }
    }


      if (editar && id) {
        fetchNivel();
      } else {
        reset({
          nombre:''
        });
      }


  }, [editar, id, reset, setValue]);

  const onSubmit: SubmitHandler<NivelValidador> = async (data) => {
    try {
      console.log(data);
      const nivel: Nivel = {id:id,nombre:data.nombre, anulado:false};
      console.log(nivel);
      onSave(nivel);
      onHide();
    } catch (error) {
      setError('root', { message: "Error al retornar el nivel." });
    }
  };

  return (
    <Dialog header={editar ? "Editar Nivel" : "Crear Nivel"} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card flex flex-col gap-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText {...register('nombre')} placeholder="Nombre" />
          </div>
          {errors.nombre && <div className="text-red-500 text-left text-xs">{errors.nombre.message}</div>}
          
          <div className="mt-8">
            <Button
              label={isSubmitting ? 'Guardando...' : editar ? 'Guardar cambios' : 'Crear nivel'}
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

export default NivelDialog;
