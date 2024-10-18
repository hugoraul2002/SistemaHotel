import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate, useParams } from "react-router-dom";
import {
  AuthModulo,
  ClienteFactura,
  DetalleHospedaje,
  DetalleHospedajeFactura,
  Hospedaje,
  MetodoPago,
  OpcionPago,
  Producto,
} from "../../types/types";
import { HospedajeService } from "../../services/HospedajeService";
import { formatDateTime } from "../../helpers/formatDate";
import {
  getDetallesByHospedaje,
  create,
  deleteDetalle,
} from "../../services/DetalleHospedajeService";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import BusquedaProducto from "./BusquedaProducto";
import FormRegistraFactura from "./FormRegistraFactura";
import { Toast } from "primereact/toast";
import facturarHospedaje from "../../services/FacturacionFelService";
import getPDF from "../../services/FacturacionFelService";
import { createOpcionPago } from "../../services/OpcionPagoService";
import { getTicketFactura } from "../../services/FacturaService";
import { Checkbox } from "primereact/checkbox";
import { authModulo } from "../../services/AuthService";
const RegistroSalida = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);
  const [detallesHospedaje, setDetallesHospedaje] = useState<
    DetalleHospedajeFactura[]
  >([]);
  const [servicioHospedaje, setServicioHospedaje] = useState<
    DetalleHospedajeFactura[]
  >([]);
  const [dialogVisible, setDialogVisible] = useState(false); // Estado para controlar el diálogo
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null); // Estado para el producto seleccionado
  const [formFacturarVisible, setFormFacturarVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [formatoTicket, setFormatoTicket] = useState(false);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([
    { metodo: "EFECTIVO", monto: 0 },
    { metodo: "TARJETA", monto: 0 },
  ]);
  const { idHabitacion } = useParams();
  const [userAuth, setUserAuth] = useState<AuthModulo | null>(null);

  const calcularTotales = () => {
    const detalles = [...detallesHospedaje, ...servicioHospedaje];

    const totalSubtotales = detalles.reduce(
      (total, item) => total + item.subtotal,
      0
    );
    const totalPagado = detalles
      .filter((item) => !item.pagado)
      .reduce((total, item) => total + item.subtotal, 0);
    return { totalSubtotales, totalPagado };
  };

  const { totalSubtotales, totalPagado } = calcularTotales();
  const mostrarToast = (
    detalle: string,
    tipo: "success" | "info" | "warn" | "error"
  ) => {
    toast.current?.show({ severity: tipo, detail: detalle, life: 3000 });
  };

  const handleProductSelect = (product: Producto) => {
    setSelectedProduct(product);
    setDescription(product.nombre);
    setPrice(product.precioVenta);
    setQuantity(1);
    setDiscount(0);
    setSubtotal(product.precioVenta);
    setDialogVisible(false);
  };

  useEffect(() => {
    const auth = async () => {
      try {
        const response: AuthModulo = await authModulo("CheckOut");

        if (!response.allowed) {
          navigate("/Inicio");
        }
        setUserAuth(response);
      } catch (error) {
        console.error("Error fetching auth:", error);
      }
    };

    auth();

    if (idHabitacion) {
      const fetchHabitacion = async () => {
        try {
          const response = await HospedajeService.getActivoByIdHabitacion(
            Number(idHabitacion)
          );
          if (response) {
            setHospedaje(response);
            const detalles = await getDetallesByHospedaje(response.id);
            if (detalles && detalles.length > 0) {
              // Asignar el primer elemento a servicioHospedaje
              setServicioHospedaje([detalles[0]]);
              // Asignar el resto de los elementos a detallesHospedaje
              setDetallesHospedaje(detalles.slice(1));
            }
          }
          console.log(response);
        } catch (error) {
          console.error("Error fetching habitacion:", error);
        }
      };

      fetchHabitacion();
    }
  }, [idHabitacion]);
  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setQuantity(value);
      calculateSubtotal(value, price, discount);
    } else {
      setQuantity(null);
      setSubtotal(null);
    }
  };

  const handlePriceChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setPrice(value);
      calculateSubtotal(quantity, value, discount);
    } else {
      setPrice(null);
      setSubtotal(null);
    }
  };

  const handleDiscountChange = (value: number | null) => {
    if (value !== null && value >= 0) {
      setDiscount(value);
      calculateSubtotal(quantity, price, value);
    } else {
      setDiscount(null);
      setSubtotal(null);
    }
  };

  const calculateSubtotal = (
    quantity: number | null,
    price: number | null,
    discount: number | null
  ) => {
    if (quantity !== null && price !== null && quantity > 0 && price > 0) {
      const subtotal = quantity * price - (discount || 0);
      if (discount !== null && discount > quantity * price) {
        setDiscount(quantity * price);
      }
      setSubtotal(subtotal);
    } else {
      setSubtotal(null);
    }
  };
  const handleAddProduct = async () => {
    if (!selectedProduct) {
      mostrarToast("Debe seleccionar un producto", "warn");
      return;
    }

    // Si el producto no es un servicio, validar existencia
    if (
      !selectedProduct.esServicio &&
      quantity! > selectedProduct.existencia!
    ) {
      mostrarToast("No hay suficiente existencia.", "warn");
      return;
    }

    const detalleHospedaje: DetalleHospedaje = {
      id: 0, // Esto lo asigna la base de datos automáticamente
      hospedajeId: hospedaje!.id,
      productoId: selectedProduct.id,
      cantidad: quantity!,
      costo: selectedProduct.costo,
      precioVenta: price!,
      descuento: discount || 0,
      pagado: false,
    };

    try {
      // Usar el servicio para crear el nuevo registro
      const observaciones =
        "Consumo en hospedaje #" +
        hospedaje!.id +
        ' habitación "' +
        hospedaje!.habitacion!.nombre +
        '", cliente ' +
        hospedaje!.cliente!.nombre;
      const response = await create(detalleHospedaje, observaciones);

      if (response) {
        const detalles = await getDetallesByHospedaje(hospedaje!.id);
        if (detalles && detalles.length > 0) {
          // Asignar el primer elemento a servicioHospedaje
          setServicioHospedaje([detalles[0]]);
          // Asignar el resto de los elementos a detallesHospedaje
          setDetallesHospedaje(detalles.slice(1));
        }
      }

      // Limpiar los campos
      handleCancel();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleDeleteDetalle = async (detalleId: number) => {
    try {
      const observaciones =
        "Eliminación de consumo en hospedaje #" +
        hospedaje!.id +
        ' habitación "' +
        hospedaje!.habitacion!.nombre +
        '", cliente ' +
        hospedaje!.cliente!.nombre;
      const response = await deleteDetalle(detalleId, observaciones);
      if (response) {
        const detalles = await getDetallesByHospedaje(hospedaje!.id);
        if (detalles && detalles.length > 0) {
          // Asignar el primer elemento a servicioHospedaje
          setServicioHospedaje([detalles[0]]);
          // Asignar el resto de los elementos a detallesHospedaje
          setDetallesHospedaje(detalles.slice(1));
        }
      }
    } catch (error) {
      console.error("Error al eliminar detalle:", error);
    }
  };

  const actionBodyTemplate = (rowData: DetalleHospedajeFactura) => {
    return (
      <Button
        size="small"
        icon="pi pi-trash"
        outlined
        rounded
        className="p-button-danger"
        disabled={rowData.pagado}
        onClick={() => handleDeleteDetalle(rowData.id)}
      />
    );
  };

  const renderRowNumber = (
    rowData: DetalleHospedajeFactura,
    { rowIndex }: { rowIndex: number }
  ) => {
    return rowIndex + 1; // Ajusta la numeración
  };

  // Clear all fields
  const handleCancel = () => {
    setDescription("");
    setQuantity(null);
    setPrice(null);
    setDiscount(null);
    setSubtotal(null);
    setSelectedProduct(null);
  };

  const centerContent = (
    <div className="flex flex-wrap">
      <div className="p-inputgroup">
        <Button
          id="buscarProducto"
          icon="pi pi-search"
          className="p-button-primary"
          onClick={() => setDialogVisible(true)}
        />
        <InputText
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-mr-2"
          size={30}
          disabled
        />
      </div>
      <InputNumber
        placeholder="Cantidad"
        value={quantity}
        onValueChange={(e) => handleQuantityChange(e.value ?? 1)}
        mode="decimal"
        min={1}
        size={1}
        className="p-mr-2"
      />
      <InputNumber
        placeholder="Precio"
        value={price}
        onValueChange={(e) => handlePriceChange(e.value ?? 1)}
        min={1}
        size={1}
        disabled
        className="p-mr-2"
      />
      <InputNumber
        placeholder="Descuento"
        value={discount}
        onValueChange={(e) => handleDiscountChange(e.value ?? 0)}
        min={0}
        size={1}
        className="p-mr-2"
      />
      <InputText
        placeholder="Subtotal"
        value={subtotal !== null ? subtotal.toFixed(2) : ""}
        readOnly
        size={2}
        disabled
        className="p-mr-2"
      />
    </div>
  );

  const endContent = (
    <React.Fragment>
      <Button
        id="insertaProducto"
        icon="pi pi-check"
        rounded
        className="p-button-primary mr-1"
        onClick={handleAddProduct}
      />
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-warning"
        onClick={handleCancel}
      />
    </React.Fragment>
  );
  const handleFacturar = async (cliente: ClienteFactura) => {
    const data = {
      hospedajeId: hospedaje!.id,
      nit: cliente.nit,
      nombre: cliente.nombre,
      direccion: cliente.direccion,
    };

    try {
      const response = await facturarHospedaje.facturarHospedaje(data);

      if (response) {
        console.log("response", response);
        toast.current?.show({
          severity: "success",
          summary: "Facturación",
          detail: "Hospedaje facturado exitosamente",
          life: 3000,
        });

        const idFactura = response.numFactura;

        // Registrar métodos de pago
        await Promise.all(
          metodosPago.map(async (mp) => {
            if (mp.monto > 0) {
              const opcionPago: OpcionPago = {
                id: 0,
                aperturaId: mp.idApertura,
                tipoDocumento: "FH",
                documentoId: idFactura,
                metodo:
                  mp.metodo === "EFECTIVO"
                    ? "EFE"
                    : mp.metodo === "TARJETA"
                    ? "TAR"
                    : "",
                monto: mp.monto,
                fecha: new Date(),
              };
              await createOpcionPago(opcionPago);
            }
          })
        );

        // Descargar el PDF de la factura
        if (formatoTicket) {
          await getTicketFactura(response.id, response.numFactura);
        } else {
          await getPDF.getPDF(idFactura);
        }
        // Cerrar el formulario y redirigir al checkout
        setFormFacturarVisible(false);
        setTimeout(() => {
          navigate("/checkout");
        }, 2000);
      }
    } catch (error) {
      console.error("Error al facturar hospedaje:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <Toast ref={toast} />
      {/* Sección Izquierda */}
      <Card className="w-full md:w-1/3 mb-4 md:mb-0">
        <Panel header="Habitación" className="text-md mb-3">
          <div className="flex justify-between">
            <p className="text-sm"> Nombre</p>
            <p className="text-sm"> {hospedaje?.habitacion?.nombre || ""}</p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Precio</p>
            <p className="text-sm">Q. {hospedaje?.habitacion?.precio || ""}</p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Tarifa</p>
            <p className="text-sm">{hospedaje?.habitacion?.tarifa} Horas</p>
          </div>
        </Panel>

        <Panel header="Información del Cliente" className="text-md mb-3">
          <div className="flex justify-between">
            <p className="text-sm"> Cliente</p>
            <p className="text-sm">
              {" "}
              {hospedaje?.cliente?.nombre || "No seleccionado"}
            </p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Tipo de Documento</p>
            <p className="text-sm">
              {" "}
              {hospedaje?.cliente?.tipoDocumento || ""}
            </p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Número de Documento</p>
            <p className="text-sm"> {hospedaje?.cliente?.numDocumento || ""}</p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Teléfono</p>
            <p className="text-sm"> {hospedaje?.cliente?.telefono || ""}</p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Dirección</p>
            <p className="text-sm">{hospedaje?.cliente?.direccion || ""}</p>
          </div>
        </Panel>

        <Panel header="Información del Hospedaje" className="text-md">
          <div className="flex justify-between">
            <p className="text-sm"> Fecha Inicio</p>
            <p className="text-sm">
              {" "}
              {hospedaje && formatDateTime(hospedaje!.fechaInicio)}
            </p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Fecha Fin</p>
            <p className="text-sm">
              {" "}
              {(hospedaje && formatDateTime(hospedaje!.fechaFin)) || ""}
            </p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Monto de Penalidad</p>
            <p className="text-sm"> Q. {hospedaje?.monto_penalidad || 0}</p>
          </div>
          <Divider className="my-1" />
          <div className="flex justify-between">
            <p className="text-sm"> Total</p>
            <p className="text-sm"> Q. {hospedaje?.total || 0}</p>
          </div>
        </Panel>
      </Card>

      {/* Sección Derecha */}
      <div className="w-full md:w-2/3">
        {/* Tabla de Hospedaje */}
        <Panel header="Detalles del Hospedaje" className="mb-3 text-sm">
          <DataTable
            value={servicioHospedaje}
            className="p-datatable-sm text-sm"
            emptyMessage="No hay registros de productos/servicios consumidos."
          >
            <Column field="descripcion" header="Descripción" />
            <Column field="cantidad" header="Cantidad" />
            <Column field="precio_venta" header="Precio Unitario" />
            <Column field="descuento" header="Descuento" />
            <Column field="subtotal" header="Subtotal" />
            {/* <Column field="pagado" header="Pagado" body={(rowData) => (rowData.pagado ? 'Sí' : 'No')} /> */}
          </DataTable>
        </Panel>
        
        {/* Tabla de Productos y Servicios */}
        <Panel header="Productos y Servicios Consumidos" className="text-sm">
          <div className="card">
            <Toolbar start={centerContent} end={endContent} />
          </div>
          <DataTable
            value={detallesHospedaje}
            className="p-datatable-sm text-sm"
            emptyMessage="No hay registros de productos/servicios consumidos."
          >
            <Column field="item" header="#" body={renderRowNumber} />
            <Column field="descripcion" header="Producto" />
            <Column field="cantidad" header="Cantidad" />
            <Column field="precio_venta" header="Precio Unitario" />
            <Column field="descuento" header="Descuento" />
            <Column field="subtotal" header="Subtotal" />
            <Column body={actionBodyTemplate} header="Acciones" />
            {/* <Column field="pagado" header="Pagado" body={(rowData) => (rowData.pagado ? 'Sí' : 'No')} /> */}
          </DataTable>
          <div className="flex justify-end mt-3">
            <div>
              <strong>Total:</strong> Q. {totalSubtotales}
            </div>
          </div>

          <div className="flex justify-end mt-1">
            <div>
              <strong>Total a Cancelar:</strong> Q. {totalPagado}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              label="Facturar"
              className="p-button-primary mr-2"
              onClick={() => setFormFacturarVisible(true)}
            />
            <Button
              label="Cancelar"
              className="p-button-secondary"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="card flex justify-content-center gap-1">
            <Checkbox
              onChange={(e) => setFormatoTicket(e.checked)}
              checked={formatoTicket}
            ></Checkbox>
            <label className="p-checkbox-label">Impresión en Ticket</label>
          </div>
        </Panel>
      </div>
      <Dialog
        maximizable
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Buscar Producto"
        style={{ width: "60vw" }}
      >
        <BusquedaProducto onProductSelect={handleProductSelect} />
      </Dialog>
      <FormRegistraFactura
        mostrarToast={mostrarToast}
        cliente={
          hospedaje
            ? {
                nit: hospedaje!.cliente?.numDocumento,
                nombre: hospedaje!.cliente?.nombre,
                direccion: hospedaje!.cliente?.direccion,
              }
            : { nit: "", nombre: "", direccion: "" }
        }
        total={totalPagado}
        onSave={handleFacturar}
        visible={formFacturarVisible}
        opcionesPago={metodosPago}
        setOpcionesPago={setMetodosPago}
        onHide={() => setFormFacturarVisible(false)}
      />
    </div>
  );
};

export default RegistroSalida;
