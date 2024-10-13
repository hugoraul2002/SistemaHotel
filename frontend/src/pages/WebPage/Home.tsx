import { useState, useEffect } from 'react';
import img1 from '../../../src/assets/img/img1.png';
import img2 from '../../../src/assets/img/img2.png';
import img3 from '../../../src/assets/img/img3.png';
import img4 from '../../../src/assets/img/img4.png';
import img5 from '../../../src/assets/img/img5.png';
import { useNavigate } from 'react-router-dom';
const images = [img1, img2, img3, img4, img5];

export default function Component() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const getPreviousIndex = (index: number) => (index - 1 + images.length) % images.length;
    const getNextIndex = (index: number) => (index + 1) % images.length;

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-evenly items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        <i className={isMenuOpen ? 'pi pi-chevron-left' : 'pi pi-bars'}></i>
                    </button>
                    <div className="text-xl md:text-2xl font-bold text-gray-800">HOTEL MARGARITA</div>
                    <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                        <ul className="md:flex space-y-2 md:space-y-0 md:space-x-4 text-sm">
                            <li><a href="#" className="hover:text-yellow-500">Habitaciones</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Misión</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Visión</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Galería</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Encuéntranos</a></li>
                        </ul>
                    </nav>
                    <div className='flex gap-1'>
                        <button className="md:bg-gray-500 text-white px-4 py-2 rounded text-sm" onClick={() => { console.log("hola reservar");navigate("/reservar")}}>Reservar</button>
                        <button className="text-gray-500 md:bg-gray-500 hover:text-white md:text-white px-4 py-2 rounded text-sm radius"  onClick={() => navigate("/login")}>Inicia sesión</button>
                    </div>
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
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4">
                        <div className="container mx-auto flex flex-wrap gap-2 md:gap-4">
                            <input type="date" placeholder="Check in" className="flex-grow p-2 border rounded text-sm" />
                            <input type="date" placeholder="Check out" className="flex-grow p-2 border rounded text-sm" />
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded">Reserva ahora</button>
                        </div>
                    </div>
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
                    <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8">
                        <div className="flex-1">
                            <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum itaque adipisci amet qui doloremque tempore numquam, iste, iure dignissimos accusamus iusto? Quo non voluptatem nihil perspiciatis, modi nemo omnis sed! </p>
                            <button className="bg-yellow-500 text-white px-4 md:px-6 py-2 rounded">Learn more</button>
                        </div>
                        <div className="flex-1">
                            <img src="/placeholder.svg?height=300&width=500" alt="Bedroom" className="w-full h-48 md:h-64 object-cover rounded" />
                        </div>
                    </div>
                </section>

                <section className="bg-gray-100 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">Encuéntranos</h2>
                        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8">
                            <div className="flex-1">
                                <p className="mb-4">Localizados en el área central de Flores.</p>
                                <p>Dirección: 1 Avenida 0-2 Santa Elena</p>
                                <p>Phone: +502 4110-0001</p>
                                <p>Email: info@hotelmargarita.com</p>
                            </div>
                            <div className="flex-1">
                                <img src="/placeholder.svg?height=300&width=500" alt="Map" className="w-full h-48 md:h-64 object-cover rounded" />
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
                            <p>Experiencia única en Flores.</p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold mb-4">Quick Links</h3>
                            <ul className="text-sm">
                                <li><a href="#" className="hover:text-yellow-500">Rooms</a></li>
                                <li><a href="#" className="hover:text-yellow-500">Dining</a></li>
                                <li><a href="#" className="hover:text-yellow-500">Events</a></li>
                                <li><a href="#" className="hover:text-yellow-500">Contact</a></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h3 className="text-lg md:text-xl font-bold mb-4">Newsletter</h3>
                            <p className="mb-4">Stay updated with our latest offers and news.</p>
                            <input type="email" placeholder="Your email" className="w-full p-2 rounded mb-2 text-sm" />
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded w-full">Subscribe</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
