// import React, { useState, useEffect } from 'react';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ClienteService } from '../../services/ClienteService';
// import { Cliente } from '../../types/types';
// import { ClienteDialogProps } from '../../types/types';
// import { ClienteSchema, ClienteValidador } from '../../helpers/validators/Validadores';

// const ClienteDialog: React.FC<ClienteDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
//   const [advertencias, setAdvertencias] = useState<string>('');

//   const defaultValues = {
//     nombre: '',
//     tipoDocumento: '',
//     numeroDocumento: '',
//     telefono: '',
//     direccion: '',
//     activo: false,
//   };

//   const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<ClienteValidador>({
//     defaultValues,
//     resolver: zodResolver(ClienteSchema),
//   });

//   useEffect(() => {
//     setAdvertencias('');
//     const fetchDatos = async () => {
//       try {
//         if (editar && id) {
//           const cliente = await ClienteService.getById(id);
//           setValue('nombre', cliente.nombre);
//           setValue('tipoDocumento', cliente.tipoDocumento);
//           setValue('numeroDocumento', cliente.numeroDocumento);
//           setValue('telefono', cliente.telefono);
//           setValue('direccion', cliente.direccion);
//           setValue('activo', cliente.activo);
//         } else {
//           reset(defaultValues);
//         }
//       } catch (error) {
//         setError('root', { type: 'manual', message: 'Error al cargar los registros.' });
//         console.error('Error fetching data:', error);
//       }
//     };

//     if (visible) {
//       fetchDatos();
//     }
//   }, [visible, editar, id, setValue, reset]);

//   const onSubmit: SubmitHandler<ClienteValidador> = async (data) => {
//     try {
//       const cliente: Cliente = { id: id, ...data };
//       await onSave(cliente);
//       onHide(); 
//     } catch (error) {
//       console.error('Error al guardar cliente:', error);
//       setError('root', { type: 'manual', message: 'Error al guardar el cliente.' });
//     }
//   };

//   const dialogFooter = (
//     <div className="flex justify-content-end">
//       <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
//       <Button label={isSubmitting ? "Guardando" : "Guardar"} icon="pi pi-check" type="submit" form="clienteForm" />
//     </div>
//   );

//   return (
//     <Dialog visible={visible} style={{ width: '450px' }} header={editar ? "Editar Cliente" : "Nuevo Cliente"} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
//       <form id="clienteForm" onSubmit={handleSubmit(onSubmit)} className="p-fluid">
//         <div className="field">
//           <label htmlFor="nombre">Nombre</label>
//           <InputText id="nombre" {...register('nombre')} />
//           {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
//         </div>

//         <div className="field">
//           <label htmlFor="tipoDocumento">Tipo de Documento</label>
//           <InputText id="tipoDocumento" {...register('tipoDocumento')} />
//           {errors.tipoDocumento && <small className="p-error">{errors.tipoDocumento.message}</small>}
//         </div>

//         <div className="field">
//           <label htmlFor="numeroDocumento">Número de Documento</label>
//           <InputText id="numeroDocumento" {...register('numeroDocumento')} />
//           {errors.numeroDocumento && <small className="p-error">{errors.numeroDocumento.message}</small>}
//         </div>

//         <div className="field">
//           <label htmlFor="telefono">Teléfono</label>
//           <InputText id="telefono" {...register('telefono')} />
//           {errors.telefono && <small className="p-error">{errors.telefono.message}</small>}
//         </div>

//         <div className="field">
//           <label htmlFor="direccion">Dirección</label>
//           <InputText id="direccion" {...register('direccion')} />
//           {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
//         </div>

//         <div className="field-checkbox">
//           <input type="checkbox" id="activo" {...register('activo')} />
//           <label htmlFor="activo">Activo</label>
//         </div>
        
//         {advertencias && <small className="p-error">{advertencias}</small>}
//       </form>
//     </Dialog>
//   );
// };

// export default ClienteDialog;
