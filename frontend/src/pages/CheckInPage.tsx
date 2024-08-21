import React, { useEffect, useState } from 'react'
import { HabitacionCard } from '../components/hospedajes/HabitacionCard'
import { NivelService } from '../services/NivelService';
import { Nivel } from '../types/types';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

function CheckInPage() {
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const fetchNiveles = async () => {
      const nivelesRegistros: Nivel[] = await NivelService.getAllNiveles();
      console.log(nivelesRegistros);
      const menuItems = nivelesRegistros.map((nivel: Nivel) => ({
        label: nivel.nombre,
        icon: 'pi pi-warehouse',
      }));
      setItems(menuItems);
    };

    fetchNiveles();
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <Menubar  model={items} className='lg:my-0 md:my-10 my-12'/>
      <div className='flex flex-wrap gap-1'>
        <HabitacionCard  numeroHabitacion="H1" clase="PREMIUM" estado="O" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="D" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="L" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="sucia" tarifa={12} horas={3} />
      </div>
    </div>
  )
}

export default CheckInPage