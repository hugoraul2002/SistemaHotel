import { useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

export default function Reserva() {
    const stepperRef = useRef(null);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const [personCount, setPersonCount] = useState(1); // Contador de personas

    const footer = (
        <div className="flex justify-end ">
            <Button label="Next" icon="pi pi-arrow-right" className="bg-black border  border-black"  onClick={() => stepperRef.current.nextCallback()} />
        </div>
    );

    return (
        <div className="flex justify-center items-center h-screen w-screen px-4 py-4">
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
                                    className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l "
                                >
                                    -
                                </button>
                                <span className="text-lg w-ful text-center">{personCount}</span>
                                <button 
                                    onClick={() => setPersonCount(personCount + 1)} 
                                    className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r "
                                >
                                    +
                                </button>
                            </div>
                        </Card>        
                        </div>
                </StepperPanel>
                <StepperPanel header="Header II">

                </StepperPanel>
                <StepperPanel header="Header III">
                    <div className="flex flex-col flex-auto h-full">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">Content III</div>
                    </div>
                    <div className="flex pt-4 justify-start">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
