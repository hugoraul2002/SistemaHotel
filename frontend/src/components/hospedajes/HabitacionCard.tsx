import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
interface HabitacionCardProps {
    idHabitacion: number;
    numeroHabitacion: string;
    clase: string;
    estado: string;
    horas: number;
    recepcion:boolean;
}

export const HabitacionCard: React.FC<HabitacionCardProps> = ({ idHabitacion, numeroHabitacion, clase, estado, horas, recepcion }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const estadoStyles = {
        D: 'from-green-400 to-green-600',
        O: 'from-orange-400 to-orange-600',
        S: 'from-red-400 to-red-600',
        R: 'from-blue-400 to-blue-600'
    };

    const estadoText = {
        D: 'Disponible',
        O: 'Ocupada',
        S: 'Ocupada',
        L: 'Limpieza',
        R: 'Reservada'
    };

    const bgColor: string = estadoStyles[estado as keyof typeof estadoStyles] || 'from-gray-400 to-gray-600';
    const textEstado = estadoText[estado as keyof typeof estadoText] || 'Desconocido';

    const Recepcionar = () => {
        if (estado === 'R' || estado === 'D') {
            navigate(`/registrohospedaje/${idHabitacion}`);        
        }
        if (!recepcion &&(estado === 'O' || estado === 'S' )) {
            navigate(`/registrosalida/${idHabitacion}`);
        }
    }
    return (
        <div
            className={classNames(
                'rounded-lg text-white shadow-lg',
                `bg-gradient-to-r ${bgColor}`,
                isDarkMode ? 'bg-opacity-100' : 'bg-opacity-50',
                'backdrop-blur-md',
                'flex flex-col justify-between',
                'p-3',
                'flex-grow max-w-[210px] max-h-[210px]',
                'min-w-[175px]',
                'min-h-[120px]'
            )}
        >
            <div id="info" className="flex justify-between">
                <div className="flex flex-col justify-between">
                    <h1 className="text-xs font-bold">{numeroHabitacion}</h1>
                    <h4 className="text-xs font-semibold">{clase}</h4>
                </div>
                <p className="text-xs text-right">{horas}hr</p>
            </div>
            <h4 id="estado" className="text-xs mt-2 text-center bg-white bg-opacity-15 cursor-pointer hover:bg-opacity-40" onClick={() => Recepcionar()}>
                {textEstado}
            </h4>
        </div>
    );
};
