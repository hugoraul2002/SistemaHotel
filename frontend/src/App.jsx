
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import  Login from './components/Login'
import { Inicio } from './components/Inicio';

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
