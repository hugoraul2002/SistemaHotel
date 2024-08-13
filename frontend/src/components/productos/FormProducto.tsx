import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProductoService } from '../../services/ProductoService';
import { Producto } from '../../types/types';
import { Checkbox } from 'primereact/checkbox';

interface ProductoDialogProps {
    editar: boolean;
    id: number | null;
    visible: boolean;
    onHide: () => void;
    onSave: (data: Producto) => Promise<void>;
}

const ProductoDialog: React.FC<ProductoDialogProps> = ({ editar, id, onHide, visible, onSave }) => {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState<number>(0);
    const [precioVenta, setPrecioVenta] = useState<number>(0);
    const [existencia, setExistencia] = useState<number>(0);
    const [esServicio, setEsServicio] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                if (editar && id) {
                    const producto = await ProductoService.getProductoById(id);
                    setCodigo(producto.codigo);
                    setNombre(producto.nombre);
                    setCosto(producto.costo);
                    setPrecioVenta(producto.precioVenta);
                    setExistencia(producto.existencia);
                    setEsServicio(producto.esServicio);
                } else {
                    resetFields();
                }
            } catch (error) {
                setErrors({ root: 'Error al cargar el producto.' });
                console.error('Error fetching producto:', error);
            }
        };

        if (visible) {
            fetchProducto();
        }
    }, [visible, editar, id]);

    const resetFields = () => {
        setCodigo('');
        setNombre('');
        setCosto(0);
        setPrecioVenta(0);
        setExistencia(0);
        setEsServicio(false);
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!codigo) newErrors.codigo = 'El código es requerido.';
        if (!nombre) newErrors.nombre = 'El nombre es requerido.';
        if (costo === 0) newErrors.costo = 'El costo es requerido.';
        if (precioVenta === 0) newErrors.precioVenta = 'El precio de venta es requerido.';
        if (existencia === 0) newErrors.existencia = 'La existencia es requerida.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const producto: Producto = {
                id: id || 0,
                codigo,
                nombre,
                costo: Number(costo),
                precioVenta: Number(precioVenta),
                existencia: Number(existencia),
                esServicio,
                fechaIngreso: new Date(),
                anulado: false
            };
            await onSave(producto);
            onHide();
        } catch (error) {
            setErrors({ root: 'Error al guardar el producto.' });
            console.error('Error saving producto:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFooter = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label={editar ? "Actualizar" : "Guardar"} icon="pi pi-check" onClick={onSubmit} disabled={isSubmitting} />
            </div>
        );
    };

    return (
        <Dialog visible={visible} style={{ width: '40vw' }} header={editar ? 'Editar Producto' : 'Nuevo Producto'} modal className="p-fluid"
            footer={renderFooter()} onHide={onHide}>
            <div className="field">
                <label htmlFor="codigo">Código</label>
                <InputText id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                {errors.codigo && <small className="p-error">{errors.codigo}</small>}
            </div>
            <div className="field">
                <label htmlFor="nombre">Nombre</label>
                <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                {errors.nombre && <small className="p-error">{errors.nombre}</small>}
            </div>
            <div className="field">
                <label htmlFor="costo">Costo</label>
                <InputText
                    type="number"
                    id="costo"
                    value={costo.toString()}
                    onChange={(e) => setCosto(e.target.value !== '' ? Number(e.target.value) : 0)}
                />
                {errors.costo && <small className="p-error">{errors.costo}</small>}
            </div>
            <div className="field">
                <label htmlFor="precioVenta">Precio Venta</label>
                <InputText
                    type="number"
                    id="precioVenta"
                    value={precioVenta.toString()}
                    onChange={(e) => setPrecioVenta(e.target.value !== '' ? Number(e.target.value) : 0)}
                />
                {errors.precioVenta && <small className="p-error">{errors.precioVenta}</small>}
            </div>
            <div className="field">
                <label htmlFor="existencia">Existencia</label>
                <InputText
                    type="number"
                    id="existencia"
                    value={existencia.toString()}
                    onChange={(e) => setExistencia(e.target.value !== '' ? Number(e.target.value) : 0)}
                />
                {errors.existencia && <small className="p-error">{errors.existencia}</small>}
            </div>
            <div className="field-checkbox mt-2 flex">
                <Checkbox inputId="esServicio" name="esServicio" checked={esServicio} onChange={(e) => setEsServicio(e.checked!)} />
                <label htmlFor="esServicio" className="p-checkbox-label ml-1">Es Servicio</label>
            </div>
            {errors.root && <small className="p-error">{errors.root}</small>}
        </Dialog>
    );
};

export default ProductoDialog;
