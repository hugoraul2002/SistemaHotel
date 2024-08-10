import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { logout } from '../services/AuthService';
import { Usuario } from '../types/types';

interface NavbarProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ setVisible }) => {
const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = useState(false);
  const [user, setUser] = useState<Usuario>({ id: 0, full_name: '', email: '', password: '', rol: { id: 0, nombre: '' } });
  const menu = useRef<Menu>(null);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const user = localStorage.getItem('auth');
    if (user) {
      const userJson = JSON.parse(user);
      const usuarioRecuperado: Usuario = { id: userJson.id, full_name: userJson.fullName, email: userJson.email, password: '', rol: { id: userJson.rol.id, nombre: userJson.rol.nombre } };
      setUser(usuarioRecuperado);
    }
  }, []);

  const userMenuItems = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => handleLogout(),
    },
  ];

  const start = (
    <div className='flex place-items-center'>
      <h1 className='text-lg text-gray-400 inline-block ml-4 mr-2 font-semibold'>HOTEL MARGARITA</h1>
      <Button
        icon="pi pi-bars"
        severity="secondary" text
        onClick={() => setVisible(true)}
      />
    </div>
  );

  const end = (
    <>
      <Button
        icon={darkTheme ? "pi pi-moon" : "pi pi-sun"}
        size='small'
        style={{ height: '2rem', width: '2rem' }}
        severity={darkTheme ? 'secondary' : 'help'}
        className="mr-3"
        rounded
        text={!darkTheme}
        onClick={toggleTheme}
      />

      <Avatar
        label={user ? user.full_name.substring(0, 1) : ''}
        shape="circle"
        className="mr-2"
        onClick={(e) => menu.current?.toggle(e)}
      />
      <Menu model={userMenuItems} popup ref={menu} />
    </>
  );

  return <Menubar start={start} end={end} />;
};

export default Navbar;
