import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import RegistroPago from '../opcionesPago/OpcionPago';
import consultaNit from '../../services/FacturacionFelService';
import { ClienteFactura } from '../../types/types';
interface FacturaDialogProps {
    visible: boolean;
    cliente: ClienteFactura;
    total: number;
    opcionesPago: any;
    setOpcionesPago: React.Dispatch<React.SetStateAction<any>>;
    onHide: () => void;
    onSave: (cliente: ClienteFactura, opcionesPago: any) => void;
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
                if (response.success && nit.toUpperCase()!== 'CF') {
                    setNombre(response.data.nombre);
                    setErrorNit('');
                } else {
                    setNombre(cliente.nombre);
                    setDireccion(cliente.direccion);
                    if (response.error) setErrorNit(response.error);
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
        const clienteData: ClienteFactura = { nit, nombre, direccion };
        onSave(clienteData, opcionesPago);
    };

    useEffect(() => {
        if (visible) {
            setNit(cliente.nit);
            setNombre(cliente.nombre);            
            setDireccion(cliente.direccion);
        }
    }, [visible]);

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
                    <RegistroPago mostrarToast={mostrarToast} tipoDocumento="FH" monto={total} opcionesPago={opcionesPago} setOpcionesPago={setOpcionesPago}  editar={false} onSave={handleSave} />

                    <div className="flex justify-content-start pt-3">
                        <Button label="Regresar" icon="pi pi-arrow-left" onClick={() =>  stepperRef.current.prevCallback()} />
                    </div>
                    {/* <div className="flex justify-content-end pt-3">
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
                    </div> */}
                </StepperPanel>
            </Stepper>
        </Dialog>
    );
};

export default FormRegistraFactura;
