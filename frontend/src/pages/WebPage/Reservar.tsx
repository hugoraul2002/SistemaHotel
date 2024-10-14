import { useEffect, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import dayjs from "dayjs";
import { Habitacion } from "../../types/types";
import { Nullable } from "primereact/ts-helpers";

export default function Reserva() {
    const stepperRef = useRef(null);
    const toast = useRef<Toast>(null);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const [personCount, setPersonCount] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [selectedHabitacion, setSelectedHabitacion] = useState<Habitacion | null>(null);
    const [facturar, setFacturar] = useState(false);
    const [cliente, setCliente] = useState({ nit: '', nombre: '', direccion: '', telefono: '' });

    const handleNextPanel1 = () => {
        // Validar fechas y número de personas
        const [startDate, endDate] = dates;
        const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

        if (!startDate || !endDate || diffDays > 7) {
            toast.current?.show({ severity: 'warn', summary: 'Error', detail: 'El rango de fechas no puede exceder 7 días', life: 3000 });
            return;
        }
        if (personCount > 10) {
            toast.current?.show({ severity: 'warn', summary: 'Error', detail: 'No se permiten más de 10 personas', life: 3000 });
            return;
        }
        stepperRef.current.nextCallback();
    };

    const handleSearch = () => {
        // Lógica para buscar habitaciones
    };

    const calculateTotal = () => {
        const diffDays = dayjs(dates![1]).diff(dayjs(dates![0]), 'day') + 1;
        return selectedHabitacion ? selectedHabitacion.precio * diffDays : 0;
    };

    const footer = (
        <div className="flex justify-end">
            <Button label="Next" icon="pi pi-arrow-right" className="bg-black border-black" onClick={handleNextPanel1} />
        </div>
    );

    return (
        <div className="flex justify-center items-center h-screen w-screen px-4 py-4">
            <Toast ref={toast} />
            <Stepper ref={stepperRef} className="flex-auto" style={{ width: '100%', height: '100%' }}>
                <StepperPanel header="Fechas y Personas">
                    <div className="flex flex-col flex-auto h-full justify-center items-center">
                        <Card title="Fechas" footer={footer} className="w-96">
                            <label className="block mb-2 font-medium">Fechas</label>
                            <Calendar
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="range"
                                minDate={new Date()}
                                maxDate={dayjs().add(60, 'day').toDate()}
                                className="w-full"
                            />
                            <label className="block mt-4 mb-2 font-medium">Número de personas</label>
                            <div className="flex items-center justify-between border-2 border-gray-300 rounded p-1">
                                <Button label="-" onClick={() => setPersonCount(Math.max(1, personCount - 1))} />
                                <span>{personCount}</span>
                                <Button label="+" onClick={() => setPersonCount(Math.min(10, personCount + 1))} />
                            </div>
                        </Card>
                    </div>
                </StepperPanel>

                <StepperPanel header="Habitación">
                    <div className="w-full p-6 flex flex-col gap-4">
                        <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
                            <Dropdown value={selectedCategory} options={[]} onChange={(e) => setSelectedCategory(e.value)} className="w-full" placeholder="Selecciona categoría" />
                            <Button label="Buscar" onClick={handleSearch} className="w-full mt-4" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {habitaciones.map(habitacion => (
                                <Card key={habitacion.id} title={habitacion.nombre}>
                                    <p>{`Máximo de personas: ${habitacion.numeroPersonas}`}</p>
                                    <p>{`Precio por noche: Q.${habitacion.precio}`}</p>
                                    <Button label="Seleccionar" onClick={() => setSelectedHabitacion(habitacion)} />
                                </Card>
                            ))}
                        </div>
                    </div>
                </StepperPanel>

                <StepperPanel header="Resumen">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Card title="Resumen de Reserva" className="w-full lg:w-2/3">
                            {dates!.length > 1 && selectedHabitacion &&
                            <p>{`Fechas: ${dates[0]?.toLocaleDateString()} - ${dates[1]?.toLocaleDateString()}`}</p>
                            <p>{`Personas: ${personCount}`}</p>
                            <p>{`Total a pagar: Q.${calculateTotal()}`}</p>
                        </Card>
                        <Card title="Datos de Facturación" className="w-full lg:w-1/3">
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox inputId="factura" checked={facturar} onChange={(e) => setFacturar(e.value)} />
                                <label htmlFor="factura">¿Deseas facturar?</label>
                            </div>
                            {facturar && (
                                <>
                                    <InputText placeholder="NIT" value={cliente.nit} onChange={(e) => setCliente({ ...cliente, nit: e.target.value })} />
                                    <InputText placeholder="Nombre" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} disabled />
                                    <InputText placeholder="Dirección" value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} disabled />
                                </>
                            )}
                            }
                        </Card>
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
