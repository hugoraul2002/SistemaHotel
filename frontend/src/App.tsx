
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import  Login from './pages/Login';
import { Inicio } from './pages/Inicio';

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={ <Login />  } />
      <Route path='/Inicio' element={ <Inicio />  } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
