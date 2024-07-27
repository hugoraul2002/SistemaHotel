import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="layout">
      <Navbar visible={visible} setVisible={setVisible} />
      <div className="flex px-">
        <Sidebar visible={visible} setVisible={setVisible} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
