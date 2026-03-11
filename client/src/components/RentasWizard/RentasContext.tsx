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
    totalPedido: number;
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

    const agregarAlCarrito = (item: InventoryItem, cantidad: number = 1) => {
        setCarrito(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            if (existing) {
                return prev.map(c =>
                    c.item.id === item.id
                        ? { ...c, cantidad: c.cantidad + cantidad, subtotal: (c.cantidad + cantidad) * item.price }
                        : c
                );
            }
            return [...prev, { item, cantidad, subtotal: item.price * cantidad }];
        });
    };

    const removerDelCarrito = (itemId: string) => {
        setCarrito(prev => prev.filter(c => c.item.id !== itemId));
    };

    const actualizarCantidad = (itemId: string, cantidad: number) => {
        setCarrito(prev => prev.map(c =>
            c.item.id === itemId
                ? { ...c, cantidad, subtotal: cantidad * c.item.price }
                : c
        ));
    };

    const limpiarWizard = () => {
        setStepActual(1);
        setClienteActual(defaultCliente);
        setCarrito([]);
        setPedidoCargadoId(null);
    };

    const totalPedido = carrito.reduce((sum, current) => sum + current.subtotal, 0);

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
