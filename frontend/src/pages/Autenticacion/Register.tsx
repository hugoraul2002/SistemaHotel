import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { UsuarioClienteSchema, UsuarioCliente } from '../../helpers/validators/Validadores';
import { registerCliente } from '../../services/AuthService';
import { Password } from 'primereact/password';
// import { useNavigate } from 'react-router-dom';

const Register = () => {
  // const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const showSuccess = () => {
    toast.current?.show({ severity: 'success', detail: 'Usuario registrado.', life: 3000 });
  }
  const showWarn = () => {
    toast.current?.show({ severity: 'warn', detail: 'Datos inválidos.', life: 3000 });
  };

  const { register, handleSubmit, setError, setValue, formState: { errors, isSubmitting } } = useForm<UsuarioCliente>({
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
      const response = await registerCliente(data);
      showSuccess();
      // navigate('/Inicio');
      console.log(response);
    } catch (error) {
      setError('root', { message: "Error al registrar usuario." });
    }
  };

  const tiposDocumento = [
    { label: 'NIT', value: 'NIT' },
    { label: 'CUI', value: 'CUI' },
    { label: 'IDE', value: 'IDE' }
  ];

  return (
    <Card className="flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:flex-row gap-3'>
        <Toast ref={toast} />
        <Card title="Datos de usuario" className='text-left text-sm' subTitle="Ingrese sus credenciales">
          <div className="card flex flex-col gap-3">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText {...register('full_name')} placeholder="Nombre" />
            </div>
            {errors.full_name && <div className="text-red-500 text-left text-xs">{errors.full_name.message}</div>}
            <div className="p-inputgroup w-full">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <InputText {...register('email')} placeholder="Email" />
            </div>
            {errors.email && <div className="text-red-500 text-left text-xs">{errors.email.message}</div>}
            <div className="p-inputgroup w-full">
              <span className="p-inputgroup-addon">
                <i className="pi pi-key" style={{ color: 'slateblue' }}></i>
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
              />
            </div>
            {errors.password && <div className="text-red-500 text-left text-xs">{errors.password.message}</div>}
          </div>
        </Card>
        
        <Card title="Datos cliente" className='text-left text-sm' subTitle="Por favor, ingrese sus datos">
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
            <Button label={isSubmitting ? 'Registrando...' : 'Registrarse'} icon={isSubmitting && "pi pi-spin pi-spinner"} className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" onClick={() => {
              if (Object.keys(errors).length > 0) {
                showWarn();
              }
            }} />
            {errors.root && <div className="text-red-500 mt-1 text-sm">{errors.root.message}</div>}
          </div>
        </Card>
      </form>
    </Card>
  );
};

export default Register;
