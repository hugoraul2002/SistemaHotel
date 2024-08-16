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
    <>
      <Menubar model={items} className='my-4'/>
      <div className='grid grid-cols-4 gap-4'>
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="O" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="D" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="L" tarifa={12} horas={3} />
        <HabitacionCard numeroHabitacion="H1" clase="PREMIUM" estado="sucia" tarifa={12} horas={3} />
      </div>
    </>
  )
}

export default CheckInPage