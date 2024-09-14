import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import RegistroPago from '../opcionesPago/OpcionPago';
import consultaNit from '../../services/FacturacionFelService';
interface Cliente {
    nit: string;
    nombre: string;
    direccion: string;
}

interface FacturaDialogProps {
    visible: boolean;
    cliente: Cliente;
    total: number;
    opcionesPago: any;
    setOpcionesPago: React.Dispatch<React.SetStateAction<any>>;
    onHide: () => void;
    onSave: (cliente: Cliente, opcionesPago: any) => void;
    mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
}

const FormRegistraFactura: React.FC<FacturaDialogProps> = ({ visible, cliente, total, opcionesPago, setOpcionesPago, onHide, onSave, mostrarToast }) => {
    const [nit, setNit] = useState(cliente.nit);
    const [nombre, setNombre] = useState(cliente.nombre);
    const [direccion, setDireccion] = useState(cliente.direccion);
    const [errorNit, setErrorNit] = useState<string>('');
    const stepperRef = useRef<any>(null);
    const getApiResponseNit  = async () :Promise<boolean> => {
        try {
            const response = await consultaNit.consultaNit(nit);
            console.log('NIT RESPONSE', response);
            if (response) {
                if (response.success) {
                    setNombre(response.data.nombre);
                    setErrorNit('');
                } else {
                    setNombre('');
                    setDireccion('');
                    setErrorNit(response.error);
                }
                return response.success;
            }
            return false;
        } catch (error) {
            console.log('Error:', error);
            console.error('Error fetching NIT:', error);
            return false;
        }
    };
    const consultarNit = async () => {
        try {
            // Replace with actual API call
            const response = await consultaNit.consultaNit(nit);
            console.log('NIT RESPONSE', response);
            if (response) {
                if (response.success) {
                    setNombre(response.data.nombre);
                    setDireccion(response.data.direccion);
                    setErrorNit('');
                } else {
                    setNombre('');
                    setDireccion('');
                    setErrorNit(response.error);
                }
            } else {
                // Show notification that NIT does not exist
                console.error('NIT not found');
            }
        } catch (error) {
            console.log('Error:', error);
            console.error('Error fetching NIT:', error);
        }
    };

    const handleNext = () => {
        getApiResponseNit().then((valida) => {
            if (!valida) return;
            if (nit && nombre && errorNit === '') {
                stepperRef.current.nextCallback();
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleSave = () => {
        const clienteData: Cliente = { nit, nombre, direccion };
        onSave(clienteData, opcionesPago);
    };

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Registro de Factura" modal onHide={onHide}>
            <Stepper ref={stepperRef} linear>
                <StepperPanel header="Datos del Cliente">
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="nit">NIT</label>
                            <div className="p-inputgroup">
                                <InputText id="nit" value={nit} onChange={(e) => setNit(e.target.value)} />
                                <Button icon="pi pi-search" className="p-button-primary" onClick={consultarNit} />
                            </div>
                            <span className='p-error text-sm'>{errorNit !== '' ? errorNit : ''}</span>
                        </div>

                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={nombre} disabled />
                        </div>

                        <div className="field">
                            <label htmlFor="direccion">Dirección</label>
                            <InputText id="direccion" value={direccion} disabled />
                        </div>
                    </div>

                    <div className="flex justify-content-end pt-3">
                        <Button label="Siguiente" disabled={!nit || !nombre || errorNit !== ''} icon="pi pi-arrow-right" onClick={handleNext} />
                    </div>
                </StepperPanel>

                <StepperPanel header="Métodos de Pago">
                    <RegistroPago mostrarToast={mostrarToast} tipoDocumento="V" monto={total} opcionesPago={opcionesPago} setOpcionesPago={setOpcionesPago}  editar={false} onSave={() => onSave(cliente, opcionesPago)} />

                    <div className="flex justify-content-start pt-3">
                        <Button label="Regresar" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                    <div className="flex justify-content-end pt-3">
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
                    </div>
                </StepperPanel>
            </Stepper>
        </Dialog>
    );
};

export default FormRegistraFactura;
