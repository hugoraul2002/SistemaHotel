// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Autenticacion/Login';
import { Inicio } from './pages/Inicio';
import Register from './pages/Autenticacion/Register';
import Layout from './components/Layout';
import PrivateRoute from './components/RutaProtegida';
import UsuarioPage from './pages/UsuarioPage';
import NivelPage from './pages/NivelPage';
import ClaseHabitacionPage from './pages/ClaseHabitacion';
import HabitacionPage from './pages/HabitacionPage';
import ClientesPage from './pages/ClientesPage';
import ReservacionesPage from './pages/ReservacionesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/usuarios" element={<UsuarioPage />} />
            <Route path="/niveles" element={<NivelPage />} />
            <Route path="/claseshabitacion" element={<ClaseHabitacionPage />} />
            <Route path="/habitaciones" element={<HabitacionPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/reservaciones" element={<ReservacionesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
