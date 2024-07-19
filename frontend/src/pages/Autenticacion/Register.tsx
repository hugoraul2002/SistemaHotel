import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { UsuarioClienteSchema, UsuarioCliente } from '../../helpers/validators/Validadores';


const Register = () => {
  const toast = useRef<Toast>(null);
  const showSuccess = () => {
    toast.current?.show({ severity: 'success',  detail: 'Usuario registrado.', life: 3000 });
  }
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<UsuarioCliente>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      nombre: '',
      tipo_documento: 'NIT',
      num_documento: '',
      telefono: '',
      direccion: '',
    },
    resolver: zodResolver(UsuarioClienteSchema),
  });
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<string>('NIT');
  const onSubmit: SubmitHandler<UsuarioCliente> = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess();
      // const request = {
      //   userData: {
      //     full_name: data.full_name,
      //     email: data.email,
      //     password: data.password,
      //   },
      //   clienteData: {
      //     nombre: data.nombre,
      //     tipoDocumento: data.tipo_documento,
      //     numDocumento: data.num_documento,
      //     telefono: data.telefono,
      //     direccion: data.direccion,
      //     activo: true
      // }};
      console.log(data)
    } catch (error) {
      setError('root', { message: 'Error al registrar el usuario' });
    }
  };

  const tiposDocumento = [
    { label: 'NIT', value: 'NIT' },
    { label: 'CUI', value: 'CUI' },
    { label: 'IDE', value: 'IDE' }
  ];

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <div className='flex flex-col md:flex-row gap-3'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Datos de usuario" subTitle="Ingrese sus credenciales">
            <div className="card flex flex-col gap-3">
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText {...register('full_name')} placeholder="Nombre" />
              </div>
              {errors.full_name && <div className="text-red-500 text-left text-xs">{errors.full_name.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope" ></i>
                </span>
                <InputText {...register('email')} placeholder="Email" />
              </div>
              {errors.email && <div className="text-red-500 text-left text-xs">{errors.email.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-key" style={{ color: 'slateblue' }}></i>
                </span>
                <InputText {...register('password')} placeholder="Contraseña" />
              </div>
              {errors.password && <div className="text-red-500 text-left text-xs">{errors.password.message}</div>}
            </div>
          </Card>

          <Card title="Datos cliente" subTitle="Por favor, ingrese sus datos">
            <div className="card flex flex-col gap-3">
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText {...register('nombre')} placeholder="Nombre" />
              </div>
              {errors.nombre && <div className="text-red-500 text-left text-xs">{errors.nombre.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-id-card"></i>
                </span>
                <Dropdown
                  {...register('tipo_documento')}
                  options={tiposDocumento}
                  value={selectedTipoDocumento}
                  onChange={(e: DropdownChangeEvent) => setSelectedTipoDocumento(e.value)}
                  placeholder="Tipo de documento"
                />
              </div>
              {errors.tipo_documento && <div className="text-red-500 text-left text-xs">{errors.tipo_documento.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-id-card"></i>
                </span>
                <InputText {...register('num_documento')} placeholder="Documento" />
              </div>
              {errors.num_documento && <div className="text-red-500 text-left text-xs">{errors.num_documento.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-phone"></i>
                </span>
                <InputText {...register('telefono')} placeholder="Teléfono" />
              </div>
              {errors.telefono && <div className="text-red-500 text-left text-xs">{errors.telefono.message}</div>}
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-map-marker"></i>
                </span>
                <InputText {...register('direccion')} placeholder="Dirección" />
              </div>
              {errors.direccion && <div className="text-red-500 text-left text-xs">{errors.direccion.message}</div>}
            </div>
            <div className="mt-8">
              <Button label={isSubmitting ? 'Registrando...' : 'Registrarse'} icon={isSubmitting && "pi pi-spin pi-spinner"} className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" />
              {/* <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button> */}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Register;

