import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HabitacionService } from '../../services/HabitacionService';
import { NivelService } from '../../services/NivelService';
import { ClaseHabitacionService } from '../../services/ClaseHabitacionService';
import { Habitacion, Nivel, ClaseHabitacion } from '../../types/types';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { HabitacionDialogProps } from '../../types/types';
import { HabitacionSchema, HabitacionValidador } from '../../helpers/validators/Validadores';

const HabitacionDialog: React.FC<HabitacionDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [clases, setClases] = useState<ClaseHabitacion[]>([]);
  const [nivel, setNivel] = useState<Nivel | null>();
  const [clase, setClase] = useState<ClaseHabitacion | null>();
  const [estado, setEstado] = useState<string | null>();
  const [advertencias, setAdvertencias] = useState<string>('');
  const estadoOptions = [
    { label: 'Disponible', value: 'D' },
    { label: 'Reservada', value: 'R' },
    { label: 'Ocupada', value: 'O' },
    { label: 'Sucia', value: 'S' },
    { label: 'Limpieza', value: 'L' },
  ];

  const defaultValues = {
    nombre: '',
    precio: 0,
    estado: '',
    nivel: { id: 0, nombre: '' },
    claseHabitacion: { id: 0, nombre: '' }
  };

  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<HabitacionValidador>({
    defaultValues,
    resolver: zodResolver(HabitacionSchema),
  });

  useEffect(() => {
    setAdvertencias('');
    const fetchDatos = async () => {
      try {
        const [nivelesData, clasesData] = await Promise.all([
          NivelService.getAllNiveles(),
          ClaseHabitacionService.getAllClaseHabitaciones()
        ]);

        setNiveles(nivelesData);
        setClases(clasesData);

        if (editar && id) {
          const habitacion = await HabitacionService.getById(id);
          setValue('nombre', habitacion.nombre);
          setValue('precio', habitacion.precio);
          setEstado(habitacion.estado);
          setNivel(nivelesData.find((n:Nivel)  => n.id === habitacion.nivelId ) );
          setClase(clasesData.find((c:ClaseHabitacion) => c.id === habitacion.claseHabitacionId) );
        } else {
          reset(defaultValues);
        }
      } catch (error) {
        setError('root', { type: 'manual', message: 'Error al cargar los registros.' });
        console.error('Error fetching data:', error);
      }
    };

    if (visible) {
      fetchDatos();
    }
  }, [visible, editar, id, setValue, reset]);

  const onSubmit: SubmitHandler<HabitacionValidador> = async (data) => {
    try {
      if (!nivel || !clase || !estado) {
        setAdvertencias('Debe seleccionar un campo válido.');
        return;
      }
      const habitacion: Habitacion = { id: id, nombre:data.nombre, precio:data.precio, estado:estado ,nivel: nivel, claseHabitacion: clase, anulado: false };
      await onSave(habitacion);
      onHide(); 
    } catch (error) {
      console.error('Error al guardar habitación:', error);
      setError('root', { type: 'manual', message: 'Error al guardar la habitación.' });
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-end">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label={isSubmitting ? "Guardando" : "Guardar"} icon="pi pi-check" type="submit" form="habitacionForm" />
    </div>
  );

  const handleNivelChange = (e: DropdownChangeEvent) => {
    setNivel(e.value);
  };

  const handleClaseChange = (e: DropdownChangeEvent) => {
    setClase(e.value);
  };
  const handleEstadoChange = (e: DropdownChangeEvent) => {
    setEstado(e.value);
  };

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={editar ? "Editar Habitación" : "Nueva Habitación"} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <form id="habitacionForm" onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" {...register('nombre')} />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
        </div>

        <div className="field">
          <label htmlFor="precio">Precio</label>
          <InputText id="precio" type="number" {...register('precio', { valueAsNumber: true })} />
          {errors.precio && <small className="p-error">{errors.precio.message}</small>}
        </div>

        <div className="field">
          <label htmlFor="estado">Estado</label>
          <Dropdown id="estado"  value={estado} options={estadoOptions} onChange={handleEstadoChange} placeholder="Seleccione un estado" />        
        </div>

        <div className="field">
          <label htmlFor="nivel">Nivel</label>
          <Dropdown id="nivel" value={nivel} options={niveles} onChange={handleNivelChange} optionLabel="nombre" placeholder="Seleccione un nivel" />
        </div>

        <div className="field">
          <label htmlFor="claseHabitacion">Clase de Habitación</label>
          <Dropdown id="claseHabitacion" value={clase} options={clases} onChange={handleClaseChange} optionLabel="nombre" placeholder="Seleccione una clase" />
        </div>
        {advertencias && <small className="p-error">{advertencias}</small>}
      </form>
    </Dialog>
  );
};

export default HabitacionDialog;
