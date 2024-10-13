import { useEffect, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { createCliente, createRegistroPago, createReservacion, registrarEnlacePago, updateCheckoutId } from "../../services/PasarelaPagosService";
import { ClaseHabitacionService } from "../../services/ClaseHabitacionService";
import { ClaseHabitacion, Cliente, Habitacion, Usuario } from "../../types/types";
import { Toast } from "primereact/toast";
import { HabitacionService } from "../../services/HabitacionService";
import dayjs from "dayjs";
import { InputText } from "primereact/inputtext";
export default function Reserva() {
    const stepperRef = useRef(null);
    const toast = useRef<Toast>(null);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const [personCount, setPersonCount] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<ClaseHabitacion | null>(null);
    const [claseHabitaciones, setClaseHabitaciones] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [selectedHabitacion, setSelectedHabitacion] = useState<Habitacion | null>(null);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<string>('NIT');
    const [cliente, setCliente] = useState<Cliente>({
        id: 0,
        nombre: '',
        tipoDocumento: 'NIT',
        numeroDocumento: '',
        telefono: '',
        direccion: '',
        activo: true,
        usuario: {} as Usuario
    });
    const tiposDocumento = [
        { label: 'NIT', value: 'NIT' },
        { label: 'CUI', value: 'CUI' },
        { label: 'IDE', value: 'IDE' }
    ];
    const horaCheckIn = "15:00";
    const horaCheckOut = "11:00";
    const handleSearch = async () => {
        try {


            // Asegúrate de que dates tenga los valores correctos
            if (dates && dates.length === 2) {
                console.log("FECHAS SELECCIONADAS", dates);
                console.log(dayjs(dates[0]).format(`YYYY-MM-DD HH:mm`));
                console.log(dayjs(dates[1]).format(`YYYY-MM-DD HH:mm`));

                const fechaInicio = dayjs(dates[0]).format(`YYYY-MM-DD ${horaCheckIn}`);
                const fechaFin = dayjs(dates[1]).format(`YYYY-MM-DD ${horaCheckOut}`);
                console.log({
                    claseHabitacionId: selectedCategory!.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                });
                const response = await HabitacionService.getHabitacionesDisponibles({
                    claseHabitacionId: selectedCategory!.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                });
                setHabitaciones(response);
                console.log(response);
            } else {
                console.error("Fechas no válidas");
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const mostrarToast = (detalle: string, tipo: "success" | "info" | "warn" | "error") => {
        toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
    };

    const footer = (
        <div className="flex justify-end">
            <Button label="Next" icon="pi pi-arrow-right" className="bg-black border-black" onClick={() => stepperRef.current.nextCallback()} />
        </div>
    );

    useEffect(() => {
        const fetchClaseHabitaciones = async () => {
            try {
                const data: ClaseHabitacion[] = await ClaseHabitacionService.getClasesReservacion();

                // Mapea los objetos para el Dropdown
                const dropdownOptions = data.map(clase => ({
                    label: clase.nombre, // Usar 'nombre' como la etiqueta
                    value: clase // El valor será el objeto entero o solo su 'id'
                }));

                setClaseHabitaciones(dropdownOptions);
                mostrarToast('Categorías cargadas.', 'info');
                setSelectedCategory(dropdownOptions[0].value); // Selecciona la primera opción
                console.log(data);
            } catch (error) {
                console.error('Error fetching clase habitaciones:', error);
                mostrarToast('Error al cargar clases de habitación.', 'error');
            }
        };

        fetchClaseHabitaciones();
    }, []);
    const handleClienteChange = (field: keyof Cliente, value: string) => {
        setCliente((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const manejarPago = async () => {
        const enlacePago = await registrarEnlacePago(selectedHabitacion, cliente);
        console.log("Enlace de pago generado:", enlacePago);

        // Establecer la URL del enlace de pago en el estado
        setUrlPago(enlacePago.url);
    };
    const handleRegistrarReserva = async () => {
        try {
            if (!selectedHabitacion || !cliente || dates?.length !== 2) {
                mostrarToast('Debes seleccionar una habitación y registrar un cliente', 'warn');
                return;
            }

            const clienteResponse = await createCliente(cliente);

            if (clienteResponse) {
                const fechaInicio = dayjs(dates![0]).format(`YYYY-MM-DD ${horaCheckIn}`);
                const fechaFin = dayjs(dates![1]).format(`YYYY-MM-DD ${horaCheckOut}`);
                const nuevaReservacion = {
                    id: 0,
                    habitacion: selectedHabitacion,
                    cliente: clienteResponse,
                    clienteId:clienteResponse.id,
                    usuario: {} as Usuario,
                    total: selectedHabitacion.precio,
                    estado: 'pendiente',
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    fechaRegistro: new Date(),
                    numeroAdultos: personCount,
                    numeroNinos: 0,
                    observaciones: '',
                    anulado: false,
                };
                console.log(clienteResponse);
                console.log(nuevaReservacion);
                const reservacionResponse = await createReservacion(nuevaReservacion)

                if (reservacionResponse) {

                    const pago = await createRegistroPago({
                        checkoutId: '-',
                        descripcion: "Hospedaje de habitación " + selectedHabitacion.nombre + ", cliente: " + cliente.nombre + " , documento: " + cliente.numeroDocumento,
                        reservacionId: reservacionResponse.id,
                        fechaRegistro: new Date(),
                        fechaPagado: null,
                        estado: 'Pendiente',
                    })
                    if (pago) {
                        console.log(pago);
                        const enlacePago = await registrarEnlacePago(selectedHabitacion, cliente, pago.id);
                        console.log("Enlace de pago generado:", enlacePago);
                        window.open(enlacePago.url, '_blank');
                        window.close();
                        mostrarToast('Reservación registrada', 'success');
                    }


                } else {
                    mostrarToast('Error al registrar la reservación', 'error');
                }
            }

            // Llamamos a la función de registrarEnlacePago
            // const enlacePago = await registrarEnlacePago(selectedHabitacion, cliente);
            // console.log("Enlace de pago generado:", enlacePago);

            // Redirigir al enlace de pago
            // window.location.href = enlacePago.url;
            // window.open('https://app.recurrente.com/checkout-session/ch_ej4lontknyyzu6gd', '_blank');
            // window.close();
        } catch (error) {
            mostrarToast('Error al generar enlace de pago.', 'error');
            console.error(error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen px-4 py-4">
            <Toast ref={toast} />
            <Stepper ref={stepperRef} className="flex-auto" style={{ width: '100%', height: '100%' }}>
                <StepperPanel header="Header I">
                    <div className="flex flex-col flex-auto h-full justify-center items-center">
                        <Card title="Fechas" footer={footer} className="w-96">
                            <label className="block mb-2 font-medium">Fechas</label>
                            <Calendar
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                hideOnRangeSelection
                                className="w-full"
                            />
                            <label className="block mt-4 mb-2 font-medium">Número de personas</label>
                            <div className="flex w-full items-center justify-between border-2 border-gray-300 rounded p-1">
                                <button
                                    onClick={() => setPersonCount(Math.max(1, personCount - 1))}
                                    className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
                                >
                                    -
                                </button>
                                <span className="text-lg w-full text-center">{personCount}</span>
                                <button
                                    onClick={() => setPersonCount(personCount + 1)}
                                    className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r"
                                >
                                    +
                                </button>
                            </div>
                        </Card>
                    </div>
                </StepperPanel>

                <StepperPanel header="Habitación">
                    <div className="w-full p-6 flex flex-col gap-4">
                        <div className="p-4 border rounded bg-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-medium">Fechas seleccionadas:</p>
                                <p>{dates ? `${dates[0]?.toLocaleDateString()} → ${dates[1]?.toLocaleDateString()}` : 'No dates selected'}</p>
                            </div>
                            <div>
                                <p className="text-lg font-medium">Personas: {personCount}</p>
                                <p>Adultos {personCount}</p>
                            </div>
                        </div>

                        <Dropdown
                            value={selectedCategory}
                            options={claseHabitaciones}
                            onChange={(e) => { setSelectedCategory(e.value); console.log(e.value) }}
                            placeholder="Select a category"
                            className="w-full mb-4"
                        />

                        <Button
                            label="Buscar"
                            className="bg-black border-black text-white w-full"
                            onClick={handleSearch}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {habitaciones.length > 0 && habitaciones.map((habitacion) => (
                                <Card key={habitacion.id} className="shadow-lg ">
                                    <img src="https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0" alt={habitacion.nombre} className="w-full h-40 object-cover rounded-t-lg" />
                                    <div className="p-4">
                                        <h2 className="text-lg font-bold">{habitacion.nombre}</h2>
                                        <p>Máximo de personas: {habitacion.numeroPersonas}</p>
                                        <p className="text-lg font-medium mt-2">Desde Q. {habitacion.precio} por noche.</p>
                                        <Button label="Seleccionar" className="mt-4 w-full bg-gray-200 text-black border-gray-700" onClick={() => setSelectedHabitacion(habitacion)} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="flex pt-4 justify-between">
                        <Button label="Regresar" icon="pi pi-arrow-left" className="bg-black border-black" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next" icon="pi pi-arrow-right" className="bg-black border-black" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>

                <StepperPanel header="Resumen">
                    <div className="flex flex-col flex-auto h-full">
                        <h2 className="text-3xl font-bold my-2">Tu Resumen</h2>
                        <Card title="Habitación Seleccionada" className="mb-4">
                            {selectedHabitacion ? (
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold">{selectedHabitacion.nombre}</h2>
                                        <p>Desde Q. {selectedHabitacion.precio} por noche</p>
                                        <p>Personas Máximas: {selectedHabitacion.numeroPersonas}</p>
                                    </div>
                                    <div>
                                        <img src="https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0" alt="Room" className="w-48 h-24 rounded-lg" />
                                    </div>
                                </div>
                            ) : (
                                <p>No se ha seleccionado ninguna habitación</p>
                            )}
                        </Card>

                        <Card title="Detalle huésped" className='text-left text-sm' subTitle="Ingrese la información solicitada">
                            <div className="card flex flex-col gap-3">
                                <InputText placeholder="Nombre" value={cliente.nombre} onChange={(e) => handleClienteChange('nombre', e.target.value)} />

                                <Dropdown options={tiposDocumento} value={cliente.tipoDocumento} onChange={(e) => handleClienteChange('tipoDocumento', e.value)} />

                                <InputText placeholder="Documento" value={cliente.numeroDocumento} onChange={(e) => handleClienteChange('numeroDocumento', e.target.value)} />

                                <InputText placeholder="Teléfono" value={cliente.telefono} onChange={(e) => handleClienteChange('telefono', e.target.value)} />

                                <InputText placeholder="Dirección" value={cliente.direccion} onChange={(e) => handleClienteChange('direccion', e.target.value)} />
                            </div>
                            <div className="mt-8">
                                <Button label="Registrarse" className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" onClick={() => {
                                    console.log("Cliente registrado:", cliente);
                                    mostrarToast('Cliente registrado correctamente.', 'success');
                                }} />
                            </div>
                        </Card>
                    </div>

                    <div className="flex pt-4 justify-between">
                        <Button label="Regresar" icon="pi pi-arrow-left" className="bg-black border-black" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="PAGAR" icon="pi pi-save" className="bg-black border-black"
                            onClick={handleRegistrarReserva}
                        />

                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
