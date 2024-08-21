import { Card } from 'primereact/card';
import React, {  useState } from 'react';
import { classNames } from 'primereact/utils';
interface HabitacionCardProps {
    numeroHabitacion: string;
    clase: string;
    estado: string;
    tarifa: number;
    horas: number;
}

export const HabitacionCard: React.FC<HabitacionCardProps> = ({ numeroHabitacion, clase, estado, tarifa, horas }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    const estadoStyles = {
        D: 'from-green-400 to-green-600',
        O: 'from-orange-400 to-orange-600',
        sucia: 'from-red-400 to-red-600',
        L: 'from-blue-400 to-blue-600'
    };

    const estadoText = {
        D: 'Disponible',
        O: 'Ocupada',
        sucia: 'Sucia',
        L: 'Limpieza'
    };

    const bgColor: string = estadoStyles[estado as keyof typeof estadoStyles] || 'from-gray-400 to-gray-600';
    const textEstado = estadoText[estado as keyof typeof estadoText] || 'Desconocido';

    

    return (
        <>
        
        <Card
        style={{width: '175px', height: '120px', overflow: 'auto'}}
            className={classNames(
                'rounded-lg p-4 text-white shadow-lg',
                `bg-gradient-to-r ${bgColor}`,
                isDarkMode ? 'bg-opacity-100' : 'bg-opacity-50',
                'backdrop-blur-md'
            )}
        >
            <div className="flex justify-between w-full">
                <h1 className="text-xs font-bold">{numeroHabitacion}</h1>
                <span className="text-xs">{horas}hr</span>
            </div>
            <h4 className="text-xs font-semibold">{clase}</h4>
            <h4 className="text-xs mt-2 flex items-center">
                {textEstado}
                {estado.toLowerCase() === 'ocupada' && <span className="ml-2">⚠️</span>}
                {estado.toLowerCase() === 'libre' && <span className="ml-2">➕</span>}
            </h4>
            <h4 className="text-lg mt-2">Tarifa: ${tarifa.toFixed(2)}</h4>
        </Card>
        </>
    );
};
