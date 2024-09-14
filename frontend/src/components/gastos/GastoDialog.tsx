import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Gasto, MetodoPago, Proveedor, TipoGasto } from '../../types/types';
import { GastoService } from '../../services/GastoService';
import { ProveedorService } from '../../services/ProveedorService';
import { TipoGastoService } from '../../services/TipoGastoService';
import { useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import RegistroPago from '../opcionesPago/OpcionPago';
import {getOpcionPagoByDocumento } from '../../services/OpcionPagoService';

interface GastoDialogProps {
    visible: boolean;
    id?: number | null;
    editar: boolean;
    onHide: () => void;
    onSave: (gasto: Gasto, metodosPago: MetodoPago[]) => Promise<void>;
    mostrarToast: (detalle: string, tipo: "success" | "info" | "warn" | "error") => void;
}

const GastoDialog: React.FC<GastoDialogProps> = ({ visible, id, editar, onHide, onSave, mostrarToast }) => {
    const [gasto, setGasto] = useState<Gasto>({
        id: 0,
        userId: 0,
        descripcion: '',
        monto: 0,
        fecha: new Date(),
        proveedorId: 0,
        anulado: false,
        tipoGastoId: 0,
        proveedor: {} as Proveedor,
        tipoGasto: {} as TipoGasto
    });
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([
        { metodo: 'EFECTIVO', monto: 0 },
        { metodo: 'TARJETA', monto: 0 },
    ]);
    const stepperRef = useRef(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const proveedores = await ProveedorService.getAllProveedors(false);
                setProveedores(proveedores);
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        };

        const fetchTiposGasto = async () => {
            try {
                const tiposGasto = await TipoGastoService.getAllTipoGastos(false);
                setTiposGasto(tiposGasto);
            } catch (error) {
                console.error('Error fetching tipos de gasto:', error);
            }
        };

        fetchProveedores();
        fetchTiposGasto();
        setGasto({
            id: 0,
            userId: 0,
            descripcion: '',
            monto: 0,
            fecha: new Date(),
            proveedorId: 0,
            anulado: false,
            tipoGastoId: 0,
            proveedor: {} as Proveedor,
            tipoGasto: {} as TipoGasto
        })
    }, []);

    useEffect(() => {
        setGasto({
            id: 0,
            userId: 0,
            descripcion: '',
            monto: 0,
            fecha: new Date(),
            proveedorId: 0,
            anulado: false,
            tipoGastoId: 0,
            proveedor: {} as Proveedor,
            tipoGasto: {} as TipoGasto
        })
        setMetodosPago([
            { metodo: 'EFECTIVO', monto: 0 },
            { metodo: 'TARJETA', monto: 0 },
        ])
    }, [visible]);

    useEffect(() => {
        if (editar && id) {
            const fetchGasto = async () => {
                try {
                    const gasto = await GastoService.getGastoById(id);
                    setGasto(gasto);
                } catch (error) {
                    console.error('Error fetching gasto:', error);
                }
            };

            const fetchMetodosPago = async () => {
                try {
                    const response = await getOpcionPagoByDocumento(id, 'FG');
                    console.log(response);
                    if (response) {
                        const metodos: MetodoPago[] = response.map((metodo: any) => ({
                            idApertura: metodo.idApertura,
                            metodo: metodo.metodo === 'EFECTIVO' ? 'EFECTIVO' : 'TARJETA',
                            monto: metodo.monto,
                          }));
                          console.log("metodos del registro a editar",metodos);
                          setMetodosPago(metodos);
                    }
                } catch (error) {
                    console.error('Error fetching metodos de pago:', error);
                }
            };

            fetchGasto();
            fetchMetodosPago();
        }
    }, [editar, id]);
    const handleSave = () => {
        onSave(gasto, metodosPago);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGasto({ ...gasto, [name]: value });
    };

    const validarGasto = () => {
        if (!gasto.descripcion || !gasto.monto || !gasto.proveedorId || !gasto.tipoGastoId || gasto.monto <= 0) {
            mostrarToast('Por favor, complete todos los campos.', 'warn');
            return false;
        }
        return true;
    }
    const handleGasto = () => {
        if (validarGasto()) {
            stepperRef.current.nextCallback()
        }
    };

    // const dialogFooter = (
    //     <div>
    //         <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
    //         <Button label="Guardar" icon="pi pi-check" onClick={handleSave} autoFocus />
    //     </div>
    // );

    return (
        <Dialog
            visible={visible}
            style={{ width: '570px' }}
            header={editar ? 'Editar Gasto' : 'Nuevo Gasto'}
            modal
            className="p-fluid"

            onHide={onHide}
        >
            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear>
                <StepperPanel header={editar ? 'Editar Gasto' : 'Registro de Gasto'}>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText
                                id="descripcion"
                                name="descripcion"
                                value={gasto.descripcion}
                                onChange={handleInputChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="monto">Monto</label>
                            <InputNumber
                                id="monto"
                                name="monto"
                                value={gasto.monto}
                                onValueChange={(e) => setGasto({ ...gasto, monto: e.value || 0 })}
                                required
                                mode="currency"
                                currency="GTQ"
                                disabled={editar}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="fecha">Fecha</label>
                            <Calendar

                                id="fecha"
                                value={new Date(gasto.fecha)}
                                onChange={(e) => setGasto({ ...gasto, fecha: e.value || new Date() })}
                                dateFormat="dd/mm/yy"
                                showIcon
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="tipogasto">Tipo Gasto</label>
                            <Dropdown
                                id="tipogasto"
                                value={gasto.tipoGasto}
                                options={tiposGasto}
                                onChange={(e) => setGasto({ ...gasto, tipoGasto: e.value, tipoGastoId: e.value.id })}
                                optionLabel="tipo"
                                placeholder="Selecciona un tipo de gasto"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="proveedor">Proveedor</label>
                            <Dropdown
                                id="proveedor"
                                value={gasto.proveedor}
                                options={proveedores}
                                onChange={(e) => setGasto({ ...gasto, proveedor: e.value, proveedorId: e.value.id })}
                                optionLabel="nombre"
                                placeholder="Selecciona un proveedor"
                            />
                        </div>
                    </div>
                    <div className="flex pt-4 justify-content-end">
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={handleGasto} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Método de pago">
                    <div className="p-fluid">
                        <RegistroPago editar={editar} monto={gasto.monto} tipoDocumento="FG" opcionesPago={metodosPago} setOpcionesPago={setMetodosPago} onSave={handleSave}
                            mostrarToast={mostrarToast} />
                    </div>
                    <div className="flex pt-4 justify-content-start">
                        <Button label="Regresar" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
            </Stepper>
        </Dialog>
    );
};

export default GastoDialog;
