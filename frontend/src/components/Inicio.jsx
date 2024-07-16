import { useNavigate } from 'react-router-dom';
export const Inicio = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <p className='text-gray-600 font-bold'>HOTEL MARGARITA</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
          <a href="#home" className="text-gray-500 hover:bg-gray-600 hover:text-white hover:font-bold px-3 py-2 rounded-md text-sm font-medium">Reservaciones</a>
            <a href="#home" className="text-gray-500 hover:bg-gray-600 hover:text-white hover:font-bold px-3 py-2 rounded-md text-sm font-medium">Check In</a>
            
            <a href="#about" className="text-gray-500 hover:bg-gray-600 hover:text-white hover:font-bold px-3 py-2 rounded-md text-sm font-medium">Check Out</a>
            <a href="#contact" className="text-gray-500 hover:bg-gray-600 hover:text-white hover:font-bold px-3 py-2 rounded-md text-sm font-medium"
            onClick={handleLogout}>Cerrar sesión</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
