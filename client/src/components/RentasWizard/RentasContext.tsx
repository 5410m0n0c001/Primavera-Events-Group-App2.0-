import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem } from '../../types/InventoryTypes';

export interface ClienteData {
    nombre: string;
    direccionEntrega: string;
    fechaEntrega: string;
    horaEntrega: string;
    fechaRecoleccion: string;
    horaRecoleccion: string;
    requiereFactura: boolean;
    notas: string;
}

export interface CartItem {
    item: InventoryItem;
    cantidad: number;
    subtotal: number;
}

interface RentasContextType {
    stepActual: number;
    setStepActual: (step: number) => void;
    clienteActual: ClienteData;
    setClienteActual: (cliente: ClienteData) => void;
    carrito: CartItem[];
    agregarAlCarrito: (item: InventoryItem, cantidad?: number) => void;
    removerDelCarrito: (itemId: string) => void;
    actualizarCantidad: (itemId: string, cantidad: number) => void;

    // Cálculos
    descuento: number;
    setDescuento: (val: number) => void;
    costoFlete: number;
    setCostoFlete: (val: number) => void;
    totalPedido: {
        subtotal: number;
        descuento: number;
        flete: number;
        baseImponible: number;
        iva: number;
        total: number;
    };

    // Para el paso 4
    pedidoCargadoId: string | null;
    setPedidoCargadoId: (id: string | null) => void;
    limpiarWizard: () => void;
}

const defaultCliente: ClienteData = {
    nombre: '',
    direccionEntrega: '',
    fechaEntrega: '',
    horaEntrega: '',
    fechaRecoleccion: '',
    horaRecoleccion: '',
    requiereFactura: false,
    notas: ''
};

const RentasContext = createContext<RentasContextType | undefined>(undefined);

export const RentasProvider = ({ children }: { children: ReactNode }) => {
    const [stepActual, setStepActual] = useState(1);
    const [clienteActual, setClienteActual] = useState<ClienteData>(defaultCliente);
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [pedidoCargadoId, setPedidoCargadoId] = useState<string | null>(null);
    const [descuento, setDescuento] = useState<number>(0);
    const [costoFlete, setCostoFlete] = useState<number>(0);

    const agregarAlCarrito = (item: InventoryItem, cantidad: number = 1) => {
        setCarrito(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            const stockDisponible = item.available ?? Number.MAX_SAFE_INTEGER;

            if (existing) {
                const nuevaCantidad = Math.min(existing.cantidad + cantidad, stockDisponible);
                return prev.map(c =>
                    c.item.id === item.id
                        ? { ...c, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.price }
                        : c
                );
            }
            const inicialCantidad = Math.min(cantidad, stockDisponible);
            return [...prev, { item, cantidad: inicialCantidad, subtotal: item.price * inicialCantidad }];
        });
    };

    const removerDelCarrito = (itemId: string) => {
        setCarrito(prev => prev.filter(c => c.item.id !== itemId));
    };

    const actualizarCantidad = (itemId: string, cantidad: number) => {
        setCarrito(prev => prev.map(c => {
            if (c.item.id === itemId) {
                const stockDisponible = c.item.available ?? Number.MAX_SAFE_INTEGER;
                const cantidadFinal = Math.min(Math.max(1, cantidad), stockDisponible);
                return { ...c, cantidad: cantidadFinal, subtotal: cantidadFinal * c.item.price };
            }
            return c;
        }));
    };

    const limpiarWizard = () => {
        setStepActual(1);
        setClienteActual(defaultCliente);
        setCarrito([]);
        setPedidoCargadoId(null);
        setDescuento(0);
        setCostoFlete(0);
    };

    const calcularTotales = () => {
        const subtotal = carrito.reduce((sum, current) => sum + current.subtotal, 0);
        const baseImponible = Math.max(0, subtotal + costoFlete - descuento);
        const iva = clienteActual.requiereFactura ? baseImponible * 0.16 : 0;
        const total = baseImponible + iva;

        return {
            subtotal,
            descuento,
            flete: costoFlete,
            baseImponible,
            iva,
            total
        };
    };

    const totalPedido = calcularTotales();

    return (
        <RentasContext.Provider value={{
            stepActual,
            setStepActual,
            clienteActual,
            setClienteActual,
            carrito,
            agregarAlCarrito,
            removerDelCarrito,
            actualizarCantidad,
            descuento,
            setDescuento,
            costoFlete,
            setCostoFlete,
            totalPedido,
            pedidoCargadoId,
            setPedidoCargadoId,
            limpiarWizard
        }}>
            {children}
        </RentasContext.Provider>
    );
};

export const useRentasWizard = () => {
    const context = useContext(RentasContext);
    if (context === undefined) {
        throw new Error('useRentasWizard must be used within a RentasProvider');
    }
    return context;
};
