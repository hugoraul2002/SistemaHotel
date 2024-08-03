import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { me } from '../services/AuthService';

const PrivateRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await me();
        if (response) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation failed', error);
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
