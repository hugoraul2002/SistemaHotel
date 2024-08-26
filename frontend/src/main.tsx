import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './hooks/UserContext';
import 'primeicons/primeicons.css';

import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
)