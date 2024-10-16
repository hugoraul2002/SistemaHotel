import { useState, useEffect } from 'react';
import img1 from '../../../src/assets/img/img1.png';
import img2 from '../../../src/assets/img/img2.png';
import img3 from '../../../src/assets/img/img3.png';
import img4 from '../../../src/assets/img/img4.png';
import img5 from '../../../src/assets/img/img5.png';
import habitacion from '../../../src/assets/homepage/habitacion.jpg';
import imgUbicacion from '../../../src/assets/homepage/ubicacion.png';

import { useNavigate } from 'react-router-dom';
const images = [img1, img2, img3, img4, img5];

export default function Component() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const getPreviousIndex = (index: number) => (index - 1 + images.length) % images.length;
    const getNextIndex = (index: number) => (index + 1) % images.length;

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex flex-col">
                    <div className="flex justify-between items-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-800">HOTEL MARGARITA</div>
                        <div className='flex gap-1'>
                            <button
                                className="hover:bg-gray-500  hover:text-white px-2 py-2 rounded-xl text-sm font-semibold text-gray-700"
                                onClick={() => { console.log("hola reservar"); navigate("/reservar") }}>
                                Reservar
                            </button>
                            <button
                                className="hover:bg-gray-500  hover:text-white px-2 py-2 rounded-xl text-sm font-semibold text-gray-700"
                                onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </div>
                    </div>
                    {/* <nav className='mx-auto'>
                        <ul className="flex flex-row flex-wrap justify-center space-x-4 text-sm mt-2">
                            <li><a href="#" className="hover:text-yellow-500">Habitaciones</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Misión</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Visión</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Galería</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Encuéntranos</a></li>
                        </ul>
                    </nav> */}
                </div>
            </header>


            <main className="flex-grow">
                <div className="relative h-[300px] md:h-[600px] flex justify-center items-center">
                    <div className="absolute inset-0 flex justify-center items-center">
                        <img
                            src={images[getPreviousIndex(currentSlide)]}
                            alt="Previous slide"
                            className="w-1/4 h-full object-cover opacity-90 transition-opacity duration-1000 hidden sm:block"
                        />
                        <img
                            src={images[currentSlide]}
                            alt="Current slide"
                            className="w-full sm:w-1/2 h-full object-cover transition-opacity duration-1000"
                        />
                        <img
                            src={images[getNextIndex(currentSlide)]}
                            alt="Next slide"
                            className="w-1/4 h-full object-cover opacity-90 transition-opacity duration-1000 hidden sm:block"
                        />
                    </div>
                    {/* Seccion de resrva ahora
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4">
                        <div className="container mx-auto flex flex-wrap gap-2 md:gap-4">
                            <input type="date" placeholder="Check in" className="flex-grow p-2 border rounded text-sm" />
                            <input type="date" placeholder="Check out" className="flex-grow p-2 border rounded text-sm" />
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded">Reserva ahora</button>
                        </div>
                    </div> */}
                    <button
                        onClick={() => setCurrentSlide(getPreviousIndex(currentSlide))}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 sm:p-2"
                    >
                        <i className='pi pi-angle-left'></i>
                    </button>
                    <button
                        onClick={() => setCurrentSlide(getNextIndex(currentSlide))}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 sm:p-2"
                    >
                        <i className='pi pi-angle-right'></i>
                    </button>
                </div>

                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Nuestras Habitaciones</h2>
                    <div className="flex flex-wrap items-center md:flex-nowrap gap-4 md:gap-8">
                        <div className="flex-1">
                            <p className="mb-4">
                                En nuestras habitaciones, el confort y la elegancia se unen para ofrecerte una experiencia inolvidable.
                                Cada espacio está cuidadosamente diseñado con atención al detalle, desde la decoración acogedora hasta las comodidades modernas.
                            </p>
                            <button className="bg-yellow-500 text-white px-4 md:px-6 py-2 rounded">Learn more</button>
                        </div>
                        <div className="flex-1">
                            <img
                                src={habitacion}
                                alt="Bedroom"
                                className="max-w-[480px] w-full h-48 md:h-64 object-cover rounded"
                            />
                        </div>
                    </div>
                </section>


                <section className="bg-gray-100 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-1">Encuéntranos</h2>
                        <p>
                            <i className='pi pi-map-marker mr-1'></i>
                        <a href="https://maps.app.goo.gl/qMR7xa5T6cc3ZPsE7" className=' text-xs font-semibold text-gray-400 mb-6 hover:text-yellow-500 '>GOOGLE MAPS</a>                        
                        </p>
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <div className="flex-1">                                
                                <p className="mb-4">Localizados en el área central de Flores.</p>
                                <p>Dirección: 2da calle 6-57 Zona 02 Flores, Petén</p>
                                <p>Phone: +502 7797 0502</p>
                                <p>Email: info@hotelmargarita.com</p>
                            </div>
                            <div className="flex-1 mt-4 md:mt-0">
                                <img
                                    src={imgUbicacion}                                    
                                    alt="Map"
                                    className="max-w-[480px] w-full h-48 md:h-64 object-cover rounded cursor-pointer"
                                    onClick={() => window.open("https://maps.app.goo.gl/qMR7xa5T6cc3ZPsE7", "_blank")}
                                />
                            </div>
                        </div>
                    </div>
                </section>


            </main>

            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold mb-4">HOTEL MARGARITA</h3>
                            <p>Siente la comodidad desde el primer momento en nuestras habitaciones.</p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold mb-4">Links</h3>
                            <ul className="text-sm flex flex-col gap-2">
                                <li>
                                    <i className="pi pi-facebook mr-2"></i>
                                    <a href="https://www.facebook.com/hotel.margarita1/?locale=es_LA" className="hover:text-yellow-500">Facebook</a></li>
                                <li>
                                    <i className="pi pi-instagram mr-2"></i>
                                    <a href="#" className="hover:text-yellow-500">Instagram</a></li>
                                <li>
                                    <i className="pi pi-whatsapp mr-2"></i>
                                    <a href="#" className="hover:text-yellow-500">WhatsApp</a></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h3 className="text-lg md:text-xl font-bold mb-4">Noticias</h3>
                            <p className="mb-4">Mantente actualizado con nuevas ofertas y actualizaciones.</p>
                            <input type="email" placeholder="Tu correo" className="text-gray-700 w-full p-2 rounded mb-2 text-sm" />
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded w-full">Suscribirse</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
