import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TipoGastoSchema, TipoGastoValidador } from '../../helpers/validators/Validadores';
import { TipoGasto } from '../../types/types';
import { TipoGastoService } from '../../services/TipoGastoService';
import {TipoGastoProps} from '../../types/types';

const TipoGastoDialog: React.FC<TipoGastoProps> = ({ editar, id, onHide, visible, onSave }) => {
  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<TipoGastoValidador>({
    defaultValues: {
      tipo:''
    },
    resolver: zodResolver(TipoGastoSchema),
  });
  useEffect(() => {
    if (!visible) {
      reset({
        tipo:''
      });
    }
  }, [visible, reset]);

  useEffect(() => {
    const fetchTipoGasto = async () => {
        try{
            const tipoGasto: TipoGasto = await TipoGastoService.getTipoGastoById(id) ;
            setValue('tipo',tipoGasto.tipo)            
        } catch(error){
            setError('root', { type: 'manual', message: 'Error al cargar el tipo de gasto.' });
        }
    }


      if (editar && id) {
        fetchTipoGasto();
      } else {
        reset({
          tipo:''
        });
      }


  }, [editar, id, reset, setValue]);

  const onSubmit: SubmitHandler<TipoGastoValidador> = async (data) => {
    try {
      console.log(data);
      const tipoGasto: TipoGasto = {id:id,tipo:data.tipo, anulado:false};
      console.log(tipoGasto);
      onSave(tipoGasto);
      onHide();
    } catch (error) {
      setError('root', { message: "Error al retornar el tipo de gasto." });
    }
  };

  return (
    <Dialog header={editar ? "Editar Tipo de Gasto" : "Crear tipo de gasto"} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card flex flex-col gap-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText {...register('tipo')} placeholder="Tipo Gasto" />
          </div>
          {errors.tipo && <div className="text-red-500 text-left text-xs">{errors.tipo.message}</div>}
          
          <div className="mt-8">
            <Button
              label={isSubmitting ? 'Guardando...' : editar ? 'Guardar cambios' : 'Registrar'}
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

export default TipoGastoDialog;
