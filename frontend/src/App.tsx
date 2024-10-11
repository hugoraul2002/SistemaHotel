import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Autenticacion/Login';
import Dashboard from './pages/Inicio';
import Register from './pages/Autenticacion/Register';
import Layout from './components/Layout';
import PrivateRoute from './components/RutaProtegida';
import UsuarioPage from './pages/UsuarioPage';
import NivelPage from './pages/NivelPage';
import ClaseHabitacionPage from './pages/ClaseHabitacion';
import HabitacionPage from './pages/HabitacionPage';
import ClientesPage from './pages/ClientesPage';
import ReservacionesPage from './pages/ReservacionesPage';
import RegistrarHospedaje from './components/hospedajes/RegistroHospedaje';
import ProductosPage from './pages/ProductosPage';
import CheckInPage from './pages/CheckInPage';
import CajaPage from './pages/CajaPage';
import ProveedoresPage from './pages/ProveedoresPage';
import TiposGastosPage from './pages/TiposGastosPage';
import GastosPage from './pages/GastosPage';
import CheckOutPage from './pages/CheckOutPage';
import RegistroSalida from './components/facturacion/RegistroSalida';
import ReporteFacturasPage from './pages/ReporteFacturacionPage';
import ReporteGastosPage from './pages/ReporteGastos';
import CierreCaja from './pages/CierreCajaPage';
import ReporteHojaVidaPage from './pages/ReporteHojaVida';
import InicioPage from './pages/WebPage/Home';
import Reserva from './pages/WebPage/Reservar';
function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservar" element={<Reserva />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/inicio" element={<Dashboard />} />
              <Route path="/usuarios" element={<UsuarioPage />} />
              <Route path="/niveles" element={<NivelPage />} />
              <Route path="/claseshabitacion" element={<ClaseHabitacionPage />} />
              <Route path="/habitaciones" element={<HabitacionPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/reservaciones" element={<ReservacionesPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/checkin" element={<CheckInPage />} />
              <Route path="/registrohospedaje/:idHabitacion" element={<RegistrarHospedaje />} />
              <Route path="/cajas" element={<CajaPage />} />
              <Route path="/tiposgastos" element={<TiposGastosPage />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/gastos" element={<GastosPage />} />
              <Route path="/checkout" element={<CheckOutPage />} />
              <Route path="/registrosalida/:idHabitacion" element={<RegistroSalida />} />
              <Route path="/reporteFacturacion" element={<ReporteFacturasPage />} />
              <Route path="/reporteGastos" element={<ReporteGastosPage />} />
              <Route path="/cierreCaja/:idApertura" element={<CierreCaja />} />
              <Route path="/ReporteHojaVida" element={<ReporteHojaVidaPage />} />

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;