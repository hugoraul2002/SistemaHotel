import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { UsuarioService } from '../../services/UsuarioService';
import { Usuario, Rol } from '../../types/types';
import { Password } from 'primereact/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsuarioSchema } from '../../helpers/validators/Validadores';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { RolService } from '../../services/RolService';

interface UsuarioDialogProps {
  editar: boolean;
  id: number;
  onHide: () => void;
  visible: boolean;
  onSave: (usuario: Usuario) => void;
}

const UsuarioDialog: React.FC<UsuarioDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const { control, register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<Usuario>({
    defaultValues: {
      full_name: '',
      email: '',
      id_rol: 1,
      password: ''
    },
    resolver: zodResolver(UsuarioSchema),
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RolService.getAllRols();
        setRoles(response);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchUser = async (userId: number) => {
      try {
        const user = await UsuarioService.getUserById(userId);
        setValue('full_name', user.full_name);
        setValue('email', user.email);
        setValue('id_rol', user.id_rol);
        setValue('password', ''); // Clear password field
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchRoles();

    if (editar && id) {
      fetchUser(id);
    } else {
      reset();
    }
  }, [editar, id, reset, setValue]);

  const onSubmit = (data: Usuario) => {
    onSave(data);
    onHide();
  };

  return (
    <Dialog header={editar ? "Editar Usuario" : "Crear Usuario"} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card flex flex-col gap-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => <InputText {...field} placeholder="Nombre" />}
            />
          </div>
          {errors.full_name && <div className="text-red-500 text-left text-xs">{errors.full_name.message}</div>}

          <div className="p-inputgroup w-full">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <InputText {...field} placeholder="Email" />}
            />
          </div>
          {errors.email && <div className="text-red-500 text-left text-xs">{errors.email.message}</div>}

          <div className="p-inputgroup w-full">
            <span className="p-inputgroup-addon">
              <i className="pi pi-key" style={{ color: 'slateblue' }}></i>
            </span>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  className="w-full"
                  {...field}
                  feedback={true}
                  promptLabel="Ingresa tu contraseña"
                  weakLabel="Débil"
                  mediumLabel="Medio"
                  strongLabel="Fuerte"
                />
              )}
            />
          </div>
          {errors.password && <div className="text-red-500 text-left text-xs">{errors.password.message}</div>}

          <div className="p-inputgroup w-full">
            <div className="card flex justify-content-center">
              <Controller
                name="id_rol"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={roles}
                    optionLabel="nombre"
                    placeholder="Seleccione un rol"
                    className="w-full md:w-14rem"
                    onChange={(e: DropdownChangeEvent) => field.onChange(e.value)}
                  />
                )}
              />
            </div>
          </div>
          {errors.id_rol && <div className="text-red-500 text-left text-xs">{errors.id_rol.message}</div>}

          <div className="mt-8">
            <Button
              label={isSubmitting ? 'Guardando...' : editar ? 'Guardar cambios' : 'Crear usuario'}
              icon={isSubmitting && "pi pi-spin pi-spinner"}
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
