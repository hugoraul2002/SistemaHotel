import { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import {
  createCliente,
  createRegistroPago,
  createReservacion,
  registrarEnlacePago,
} from "../../services/PasarelaPagosService";
import { ClaseHabitacionService } from "../../services/ClaseHabitacionService";
import {
  ClaseHabitacion,
  Cliente,
  Habitacion,
  Usuario,
} from "../../types/types";
import { Toast } from "primereact/toast";
import { HabitacionService } from "../../services/HabitacionService";
import dayjs from "dayjs";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Chip } from "primereact/chip";
import { Message } from "primereact/message";

export default function Reserva() {
  const stepperRef = useRef(null);
  const toast = useRef<Toast>(null);
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const [personCount, setPersonCount] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<ClaseHabitacion | null>(null);
  const [claseHabitaciones, setClaseHabitaciones] = useState<
    { label: string; value: ClaseHabitacion }[]
  >([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [otrasHabitaciones, setOtrasHabitaciones] = useState<Habitacion[]>([]);
  const [selectedHabitacion, setSelectedHabitacion] =
    useState<Habitacion | null>(null);
  const [totalNoches, setTotalNoches] = useState<number>(0);
  const [errorMessageClient, setErrorMessageClient] = useState<string>("");
  const [cliente, setCliente] = useState<Cliente>({
    id: 0,
    nombre: "",
    tipoDocumento: "NIT",
    numeroDocumento: "",
    telefono: "",
    direccion: "",
    activo: true,
    email: "",
    nacionalidad: "",
  });
  const tiposDocumento = [
    { label: "NIT", value: "NIT" },
    { label: "CUI", value: "CUI" },
    { label: "IDE", value: "IDE" },
  ];
  const horaCheckIn = "15:00";
  const horaCheckOut = "11:00";
  const handleSearch = async () => {
    try {
      // Asegúrate de que dates tenga los valores correctos
      if (
        dates &&
        dates.length === 2 &&
        dates[0] !== null &&
        dates[1] != null
      ) {
        console.log("FECHAS SELECCIONADAS", dates);
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
          numPersonas: personCount,
        });
        if (response) {
          setHabitaciones(response.habitacionesDisponibles);
          setOtrasHabitaciones(response.otrasHabitacionesDisponibles);
          if (response.habitacionesDisponibles.length > 0) {
            mostrarToast("Habitaciones consultadas.", "info");
          } else {
            if (response.otrasHabitacionesDisponibles.length > 0) {
              mostrarToast(
                "Existen habitaciones disponibles con un número inferior de capacidad del solicitado.",
                "info"
              );
            } else {
              mostrarToast("No hay habitaciones disponibles.", "warn");
            }
          }
        }
        console.log(response);
      } else {
        mostrarToast("Fechas invalidas.", "warn");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const mostrarToast = (
    detalle: string,
    tipo: "success" | "info" | "warn" | "error"
  ) => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const footer = (
    <div className="flex justify-end">
      <Button
        label="Next"
        icon="pi pi-arrow-right"
        className="bg-black border-black"
        onClick={() => {
          if (dates === null || dates === undefined) {
            mostrarToast("Ingrese las fechas para su reservación.", "warn");
            return;
          }
          if (dates[0] === null || dates[1] === null) {
            mostrarToast(
              "Complete el rango de fechas para su reservación.",
              "warn"
            );
            return;
          }
          if (
            dayjs(dates[0]).format("YYYY-MM-DD") ==
            dayjs(dates[1]).format("YYYY-MM-DD")
          ) {
            mostrarToast("Selecciona un rango válido.", "warn");
            return;
          }
          setHabitaciones([]);
          setOtrasHabitaciones([]);
          stepperRef.current.nextCallback();
        }}
      />
    </div>
  );

  useEffect(() => {
    const fetchClaseHabitaciones = async () => {
      try {
        const data: ClaseHabitacion[] =
          await ClaseHabitacionService.getClasesReservacion();

        // Mapea los objetos para el Dropdown
        if (data.length > 0) {
          const dropdownOptions = data.map((clase) => ({
            label: clase.nombre,
            value: clase,
          }));

          setClaseHabitaciones(dropdownOptions);
          setSelectedCategory(dropdownOptions[0].value);
        }
      } catch (error) {
        console.error("Error fetching clase habitaciones:", error);
        mostrarToast("Error al cargar clases de habitación.", "error");
      }
    };

    fetchClaseHabitaciones();
  }, []);
  useEffect(() => {
    let total :number = 0;
    if (dates &&
      dates !== null &&
      dates[0] !== null &&
      dates[1] !== null &&
      selectedHabitacion){
        total=(dayjs(dates[1]).diff(dayjs(dates[0]), "days"))
        if (total===0) total=1;
    }else{
      total=0;
    }
    setTotalNoches(total);
  }, [selectedHabitacion, dates]);
  const handleClienteChange = (field: keyof Cliente, value: string) => {
    setCliente((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const validarDocumento = () => {
    let valido = false;
    const tipoDocumento = cliente.tipoDocumento;
    const numeroDocumento = cliente.numeroDocumento;

    // Validación de campo requerido
    if (numeroDocumento === "") {
      setErrorMessageClient("El número de documento es requerido.");
      return false; // Salimos si el campo está vacío
    }
    const nitPattern = /^(CF|\d{6,}|[0-9K]+)$/; // Expresión regular para NIT
    const dpiPattern = /^\d{13}$/; // Expresión regular para DPI (13 dígitos)
    const idPattern =
      /^(?=[^A-Z]*[A-Z][^A-Z]*[A-Z][^A-Z]*[A-Z][^A-Z]*$)[0-9A-Z]{15}$/; // Expresión regular para ID (15 caracteres, 3 letras)
    switch (tipoDocumento) {
      case "NIT":
        if (!nitPattern.test(numeroDocumento)) {
          setErrorMessageClient("El número de documento NIT es inválido.");
          return false;
        }
        valido = true;
        break;

      case "DPI":
        if (!dpiPattern.test(numeroDocumento)) {
          setErrorMessageClient(
            "El número de documento DPI debe tener 13 dígitos."
          );
          return false;
        }
        valido = true;
        break;

      case "ID":
        if (!idPattern.test(numeroDocumento)) {
          setErrorMessageClient(
            "El número de documento ID debe tener 15 caracteres y puede incluir hasta 3 letras."
          );
          return false;
        }
        valido = true;
        break;

      default:
        setErrorMessageClient("Tipo de documento no soportado.");
        return false;
    }

    // Si todo es válido
    setErrorMessageClient(""); // Limpiar mensajes de error si todo es correcto
    return valido;
  };

  const validaDatosHuesped = () => {
    if (cliente.nombre === "" || cliente.nombre.length < 3) {
      setErrorMessageClient(
        "El nombre es requerido y debe tener al menos 3 caracteres."
      );
      return false;
    }

    if (!validarDocumento()) {
      return false;
    }

    if (cliente.telefono === "" || cliente.telefono.length < 8) {
      setErrorMessageClient(
        "El teléfono es requerido y debe tener al menos 8 caracteres."
      );
      return false;
    }

    if (cliente.direccion === "" || cliente.direccion.length < 4) {
      setErrorMessageClient("La dirección es requerida, detalle la ubicación.");
      return false;
    }

    if (cliente.email === "" || !cliente.email.includes("@")) {
      setErrorMessageClient("El correo electrónico es requerido.");
      return false;
    }
    if (cliente.nacionalidad === "" || cliente.nacionalidad.length < 2) {
      setErrorMessageClient("La nacionalidad es requerida.");
      return false;
    }

    // Si todas las validaciones son correctas
    setErrorMessageClient(""); // Limpiar mensaje de error
    return true;
  };

  const handleRegistrarReserva = async () => {
    try {
      if (
        !selectedHabitacion ||
        !cliente ||
        dates?.length !== 2 ||
        !validaDatosHuesped()
      ) {
        mostrarToast(
          "Debes seleccionar una habitación y completar tus datos.",
          "warn"
        );
        return;
      }
      console.log(selectedHabitacion);
      const clienteResponse = await createCliente(cliente);

      if (clienteResponse) {
        const fechaInicio = dayjs(dates[0]).format(`YYYY-MM-DD ${horaCheckIn}`);
        const fechaFin = dayjs(dates[1]).format(`YYYY-MM-DD ${horaCheckOut}`);
        const nuevaReservacion = {
          id: 0,
          habitacion: selectedHabitacion,
          cliente: clienteResponse,
          clienteId: clienteResponse.id,
          usuario: {} as Usuario,
          total: selectedHabitacion.precio,
          estado: "pendiente",
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          fechaRegistro: new Date(),
          numeroAdultos: personCount,
          numeroNinos: 0,
          observaciones: "",
          anulado: false,
        };

        const reservacionResponse = await createReservacion(nuevaReservacion);

        if (reservacionResponse) {
          const pago = await createRegistroPago({
            checkoutId: "-",
            descripcion:
              "Hospedaje de habitación " +
              selectedHabitacion.nombre +
              ", cliente: " +
              cliente.nombre +
              " , documento: " +
              cliente.numeroDocumento,
            reservacionId: reservacionResponse.id,
            fechaRegistro: new Date(),
            fechaPagado: null,
            estado: "Pendiente",
          });
          if (pago) {
            const enlacePago = await registrarEnlacePago(
              selectedHabitacion,
              cliente,
              pago.idHash,
              (totalNoches * selectedHabitacion.precio)
            );
            window.location.href = enlacePago.checkout_url;
          }
        } else {
          mostrarToast("Error al registrar la reservación", "error");
        }
      }
    } catch (error) {
      mostrarToast("Error al generar enlace de pago.", "error");
      console.error(error);
    }
  };
  const panel1Header = (
    <div className="flex gap-2 items-center">
      <h2>Habitaciones disponibles</h2>
      <Chip label={habitaciones.length.toString()} />
    </div>
  );
  const panel2Header = (
    <div className="flex gap-2 items-center">
      <h2>Otras habitaciones disponibles</h2>
      <Chip label={otrasHabitaciones.length.toString()} />
    </div>
  );
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  return (
    <div className="flex justify-center items-center h-screen w-screen px-4 py-4">
      <Toast ref={toast} />
      <Stepper
        ref={stepperRef}
        linear
        className="flex-auto"
        style={{ width: "100%", height: "100%" }}
      >
        <StepperPanel header="Fechas a Reservar">
          <div className="flex flex-col flex-auto h-full justify-center items-center">
            <Card title="Fechas" footer={footer} className="w-96">
              <label className="block mb-2 font-medium">Fechas</label>
              <Calendar
                dateFormat="dd/mm/yy"
                value={dates}
                minDate={new Date()}
                maxDate={maxDate}
                onChange={(e) => {
                  console.log(e.value);
                  setDates(e.value);
                }}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                className="w-full"
              />
              <label className="block mt-4 mb-2 font-medium">
                Número de personas
              </label>
              <div className="flex w-full items-center justify-between border-2 border-gray-300 rounded p-1">
                <button
                  onClick={() => setPersonCount(Math.max(1, personCount - 1))}
                  className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
                >
                  -
                </button>
                <span className="text-lg w-full text-center">
                  {personCount}
                </span>
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
            {/* Fechas seleccionadas y personas */}
            <div className="w-full p-6 flex flex-col gap-4">
              {/* Fechas seleccionadas y personas */}
              <div className="w-full p-4 mx-auto border rounded bg-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="w-full sm:w-auto">
                  <p className="text-lg font-medium">Fechas seleccionadas:</p>
                  <p>
                    {dates
                      ? `${dates[0]?.toLocaleDateString()} → ${dates[1]?.toLocaleDateString()}`
                      : "No dates selected"}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <p className="text-lg font-medium">Personas: {personCount}</p>
                  <p>Adultos {personCount}</p>
                </div>
              </div>

              {/* Dropdown de clases de habitación y botón Buscar */}
              <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
                <Dropdown
                  value={selectedCategory}
                  options={claseHabitaciones}
                  onChange={(e) => {
                    setSelectedCategory(e.value);
                    console.log(e.value);
                  }}
                  placeholder="Select a category"
                  className="w-full sm:w-1/2"
                />
                <Button
                  label="Buscar"
                  className="w-full sm:w-1/2 bg-black border-black text-white"
                  onClick={handleSearch}
                />
              </div>
            </div>

            {/* Listado de habitaciones */}
            <div className="w-full flex flex-col gap-8">
              <Panel header={panel1Header}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {habitaciones.length > 0 &&
                    habitaciones.map((habitacion) => (
                      <Card
                        key={habitacion.id}
                        className="shadow-lg max-w-[435px] w-full mx-auto"
                      >
                        <img
                          src="https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0"
                          alt={habitacion.nombre}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-bold">
                            {habitacion.nombre}
                          </h2>
                          <p>Nivel: {habitacion.nivel.nombre}</p>
                          <p>Máximo de personas: {habitacion.numeroPersonas}</p>
                          <p className="text-lg font-medium mt-2">
                            Desde Q. {habitacion.precio} por noche.
                          </p>
                          <Button
                            label="Seleccionar"
                            className="mt-4 w-full bg-gray-200 text-black border-gray-700"
                            onClick={() => {
                              setSelectedHabitacion(habitacion);
                              stepperRef.current.nextCallback();
                            }}
                          />
                        </div>
                      </Card>
                    ))}
                </div>
              </Panel>

              <Panel header={panel2Header} toggleable>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {otrasHabitaciones.length > 0 &&
                    otrasHabitaciones.map((habitacion) => (
                      <Card
                        key={habitacion.id}
                        className="shadow-lg max-w-[435px] w-full mx-auto"
                      >
                        <img
                          src="https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0"
                          alt={habitacion.nombre}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-bold">
                            {habitacion.nombre}
                          </h2>
                          <p>Nivel: {habitacion.nivel.nombre}</p>
                          <p>Máximo de personas: {habitacion.numeroPersonas}</p>
                          <p className="text-lg font-medium mt-2">
                            Desde Q. {habitacion.precio} por noche.
                          </p>
                          <Button
                            label="Seleccionar"
                            className="mt-4 w-full bg-gray-200 text-black border-gray-700"
                            onClick={() => {
                              setSelectedHabitacion(habitacion);
                              stepperRef.current.nextCallback();
                            }}
                          />
                        </div>
                      </Card>
                    ))}
                </div>
              </Panel>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex pt-4 justify-between">
            <Button
              label="Regresar"
              icon="pi pi-arrow-left"
              className="bg-black border-black"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              className="bg-black border-black"
              onClick={() => {
                if (!selectedHabitacion) {
                  mostrarToast("Debes seleccionar una habitación", "warn");
                  return;
                }
                stepperRef.current.nextCallback();
              }}
            />
          </div>
        </StepperPanel>

        <StepperPanel header="Resumen">
          <div className="flex flex-col flex-auto h-full">
            <h2 className="text-3xl font-bold my-2">Tu Resumen</h2>
            <Card title="Habitación Seleccionada" className="mb-4">
              {selectedHabitacion ? (
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      {selectedHabitacion.nombre}
                    </h2>
                    <p className="text-lg font-medium">Fechas seleccionadas:</p>
                    <p>
                      {dates
                        ? `${dates[0]?.toLocaleDateString()} → ${dates[1]?.toLocaleDateString()}`
                        : "No dates selected"}
                    </p>
                    <p>Desde Q. {selectedHabitacion.precio} por noche</p>
                    <p>Personas Máximas: {selectedHabitacion.numeroPersonas}</p>
                    <p>Nivel: {selectedHabitacion.nivel.nombre}</p>
                    <p>
                      Capacidad: {selectedHabitacion.numeroPersonas} personas
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p>Total a cancelar:</p>
                    <p>{totalNoches} noches → Q. {totalNoches * selectedHabitacion.precio}</p>

                  </div>
                  <div>
                    <img
                      src="https://imgs.search.brave.com/1v19-lKHrcxrgPF8qoRgm7zMT-av42YD8rwvI3wcPGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/OTA5ODM4NC9lcy9m/b3RvL2ludGVyaW9y/LW1vZGVybm8tZGVs/LWRvcm1pdG9yaW8t/Zm90by1kZS1zdG9j/ay5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9XzJUUDNEeVRN/Y2pkTXRoTXFESm0y/Z2ppdWNjRnFyVkxu/VEtuSG91N3l2dz0"
                      alt="Room"
                      className="w-48 h-24 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <p>No se ha seleccionado ninguna habitación</p>
              )}
            </Card>

            <Card
              title="Detalle huésped"
              className="text-left text-sm"
              subTitle="Ingrese la información solicitada"
            >
              <div className="card flex flex-col gap-3">
                <InputText
                  placeholder="Nombre"
                  value={cliente.nombre}
                  onChange={(e) =>
                    handleClienteChange("nombre", e.target.value)
                  }
                />

                <Dropdown
                  options={tiposDocumento}
                  value={cliente.tipoDocumento}
                  onChange={(e) =>
                    handleClienteChange("tipoDocumento", e.value)
                  }
                />

                <InputText
                  placeholder="Documento"
                  value={cliente.numeroDocumento}
                  onChange={(e) =>
                    handleClienteChange(
                      "numeroDocumento",
                      e.target.value.toUpperCase()
                    )
                  }
                />

                <InputText
                  placeholder="Teléfono"
                  value={cliente.telefono}
                  onChange={(e) =>
                    handleClienteChange("telefono", e.target.value)
                  }
                />

                <InputText
                  placeholder="Dirección"
                  value={cliente.direccion}
                  onChange={(e) =>
                    handleClienteChange("direccion", e.target.value)
                  }
                />
                <InputText
                  placeholder="Email"
                  value={cliente.email}
                  onChange={(e) =>
                    handleClienteChange("email", e.target.value)
                  }
                />
                <InputText
                  placeholder="Nacionalidad"
                  value={cliente.nacionalidad}
                  onChange={(e) =>
                    handleClienteChange("nacionalidad", e.target.value)
                  }
                />
                {errorMessageClient !== "" && (
                  <Message severity="warn" text={errorMessageClient} />
                )}
              </div>
            </Card>
          </div>

          <div className="flex pt-4 justify-between">
            <Button
              label="Regresar"
              icon="pi pi-arrow-left"
              className="bg-black border-black"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="PAGAR"
              icon="pi pi-credit-card"
              className="bg-black border-black"
              onClick={handleRegistrarReserva}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
}
