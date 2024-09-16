import { useEffect, useState } from 'react';
import { HabitacionCard } from '../components/hospedajes/HabitacionCard';
import { NivelService } from '../services/NivelService';
import { Nivel, HabitacionRecepcion } from '../types/types';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { HabitacionService } from '../services/HabitacionService';
import { Panel } from 'primereact/panel';

function CheckOutPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [habitaciones, setHabitaciones] = useState<HabitacionRecepcion[]>([]);
  const [selectedNivel, setSelectedNivel] = useState<Nivel | null>(null);

  useEffect(() => {
    const fetchNiveles = async () => {
      const nivelesRegistros: Nivel[] = await NivelService.getAllNiveles();
      console.log(nivelesRegistros);
      const menuItems = nivelesRegistros.map((nivel: Nivel) => ({
        label: nivel.nombre,
        icon: 'pi pi-warehouse',
        command: () => setSelectedNivel(nivel),
      }));
      setItems(menuItems);
      if (nivelesRegistros.length > 0) {
        setSelectedNivel(nivelesRegistros[0]);         
      }
    };
    
    fetchNiveles();
  }, []);

  useEffect(() => {
    if (selectedNivel) {
      fetchHabitaciones(selectedNivel.id);
    }
  }, [selectedNivel]);

  const fetchHabitaciones = async (idNivel: number) => {
    const habitacionesRegistros: HabitacionRecepcion[] = await HabitacionService.getHabitacionesSalida(idNivel);
    console.log(habitacionesRegistros);
    setHabitaciones(habitacionesRegistros);
  };

  return (
    <Panel header='Check Out' style={{ width: '100%' , height: '100vh'}}>

    <div className='flex flex-col gap-2'>
      <Menubar model={items} className='lg:my-0 md:my-10 my-12' />
      <div className='flex flex-wrap gap-1'>
        {habitaciones.map((habitacion: HabitacionRecepcion) => (
          <HabitacionCard
            recepcion={false}
            key={habitacion.id}
            idHabitacion={habitacion.id}
            numeroHabitacion={habitacion.nombre}
            clase={habitacion.clase}
            estado={habitacion.estado}
            horas={habitacion.tarifa}
          />
        ))}
      </div>
    </div>

    </Panel>
  );
}

export default CheckOutPage;
