
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import  Login from './pages/Autenticacion/Login';
import { Inicio } from './pages/Inicio';
import Register from './pages/Autenticacion/Register';

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={ <Login />  } />
      <Route path='/register' element={ <Register />  } />
      <Route path='/Inicio' element={ <Inicio />  } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
