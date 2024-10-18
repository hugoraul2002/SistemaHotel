import React, { useEffect, useState } from 'react';
import { Usuario } from '../types/types';
import { me } from '../services/AuthService';

const Dashboard: React.FC = () => {
  const [userAuth, setUserAuth] = useState<Usuario | null>(null);

  useEffect(() => {
    const auth = async () => {
      try {
        const user: Usuario = await me();
        setUserAuth(user);
      } catch (error) {
        console.error('Error fetching auth:', error);
      }
    };

    auth();
  }, []);

  if (userAuth?.rol.nombre !== "ADMIN") {
    return (
      <div className="flex items-start justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mt-8">
          <h1 className="text-xl font-bold text-center text-gray-800 mb-4">¡Bienvenido!</h1>
          <p className="text-gray-600 text-justify">
            Puedes navegar en distintos módulos en la barra lateral.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="p-4 mt-8"></div>
      <iframe
        title="Reporte Power BI"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiMTcxNTY3MzktMDM0NS00OTdlLTkwMmItNjg5MTQwZmZiZjJiIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9"
        frameBorder="0"
        allowFullScreen={true}
      />
    </div>
  );
};

export default Dashboard;
