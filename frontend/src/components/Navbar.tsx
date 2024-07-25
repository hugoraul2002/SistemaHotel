import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
// import logo from '../assets/logo_hotel_margarita.jpg';
interface NavbarProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ visible, setVisible }) => {
  const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = React.useState(false);
  const menu = useRef<Menu>(null);
  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const userMenuItems = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => handleLogout(),
    },
  ];

  const start = (
    <div className='flex place-items-center'> 
      {/* <img
        alt="logo"
        src={logo}
        className="logo"
      /> */}
      <h1 className='text-lg text-gray-400 inline-block ml-4 mr-2 font-semibold'>HOTEL MARGARITA</h1>
      <Button
        icon="pi pi-bars"
        severity="secondary" text
        // className="p-button-rounded p-button-outlined"
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
        text={darkTheme ? false: true}  
        onClick={toggleTheme}
      />

      <Avatar
        label="U"
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
