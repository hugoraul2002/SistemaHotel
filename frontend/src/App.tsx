// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Autenticacion/Login';
import { Inicio } from './pages/Inicio';
import Register from './pages/Autenticacion/Register';
import Layout from './components/Layout';
import PrivateRoute from './components/RutaProtegida';
import UsuarioPage from './pages/UsuarioPage';

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
            {/* Agrega aquí más rutas protegidas si es necesario */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
