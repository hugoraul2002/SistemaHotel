import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UsuarioService } from '../../services/UsuarioService';
import { Usuario, Rol } from '../../types/types';
import { Password } from 'primereact/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsuarioSchema } from '../../helpers/validators/Validadores';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { RolService } from '../../services/RolService';
import { UsuarioValidador } from '../../helpers/validators/Validadores';
import { UsuarioDialogProps } from '../../types/types';

const UsuarioDialog: React.FC<UsuarioDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Rol>({ id: 0, nombre: '' });
  const [roles, setRoles] = useState<Rol[]>([]);
  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } = useForm<UsuarioValidador>({
    defaultValues: {
      full_name: '',
      email: '',
      rol: { id: 0, nombre: '' },
      password: ''
    },
    resolver: zodResolver(UsuarioSchema),
  });
  useEffect(() => {
    if (!visible) {
      reset({
        full_name: '',
        email: '',
        password: '',
        rol: roles[0]
      });
      setPassword('');
      setRol(roles[0]);
      setValue('rol', roles[0]);
    }
  }, [visible, reset]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RolService.getAllRols();
        setRoles(response);

      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('root', { type: 'manual', message: 'Error al cargar roles' });
      }
    };

    const fetchUser = async (userId: number) => {
      try {
        const user = await UsuarioService.getUserById(userId);
        setValue('full_name', user.fullName);
        setValue('email', user.email);
        const rol = roles.find(rol => rol.id === user.rolId) || { id: user.rolId, nombre: '' };
        setValue('rol', rol);
        setRol(rol);
        setValue('password', '');

        //Limpiar textos de error
        setError('email', { message: '' })
        setError('full_name', { message: '' })
        setError('rol', { message: '' })
        setError('password', { message: '' })

      } catch (error) {
        console.error('Error fetching user:', error);
        setError('root', { type: 'manual', message: 'Error al cargar usuario' });
      }
    };

    fetchRoles().then(() => {
      if (editar && id) {
        fetchUser(id);
      } else {
        reset({
          full_name: '',
          email: '',
          rol: { id: 0, nombre: '' },
          password: ''
        });
      }
      setPassword('');
    });


  }, [editar, id, reset, setValue]);

  const onSubmit: SubmitHandler<UsuarioValidador> = async (data) => {
    try {
      console.log(data);
      const usuario: Usuario = { id: id, full_name: data.full_name, email: data.email, rol: data.rol, password: data.password! };
      console.log(usuario);
      onSave(usuario);
      onHide();
    } catch (error) {
      setError('root', { message: "Error al retornar el usuario" });
    }
  };

  return (
    <Dialog header={editar ? "Editar Usuario" : "Crear Usuario"} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card flex flex-col gap-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon hidden md:block">
              <i className="pi pi-user"></i>
            </span>
            <InputText {...register('full_name')} placeholder="Nombre" />
          </div>
          {errors.full_name && <div className="text-red-500 text-left text-xs">{errors.full_name.message}</div>}
          <div className="p-inputgroup w-full">
            <span className="p-inputgroup-addon hidden md:block">
              <i className="pi pi-envelope"></i>
            </span>
            <InputText {...register('email')} placeholder="Email" />
          </div>
          {errors.email && <div className="text-red-500 text-left text-xs">{errors.email.message}</div>}
          {!editar &&
            <div className="p-inputgroup w-full">
              <span className="p-inputgroup-addon hidden md:block">
                <i className="pi pi-key"></i>
              </span>
              <Password
                className="w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValue('password', e.target.value);
                }}
                feedback={true}
                promptLabel="Ingresa tu contraseña"
                weakLabel="Débil"
                mediumLabel="Medio"
                strongLabel="Fuerte"
                placeholder='Contraseña'
              />
            </div>
          }
          {errors.password && <div className="text-red-500 text-left text-xs">{errors.password.message}</div>}
          <div className="p-inputgroup w-full">
            <div className="w-full">
              <Dropdown
                value={rol}
                options={roles}
                optionLabel="nombre"
                placeholder="Seleccione un rol"
                className="w-full md:w-14rem"
                onChange={(e: DropdownChangeEvent) => { setRol(e.target.value); setValue('rol', e.target.value); console.log(e.target.value); }}
              />
            </div>
          </div>
          {errors.rol && <div className="text-red-500 text-left text-xs">{errors.rol.message}</div>}
          <div className="mt-8">
            <Button
              label={isSubmitting ? 'Guardando...' : editar ? 'Guardar cambios' : 'Crear usuario'}
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

export default UsuarioDialog;
