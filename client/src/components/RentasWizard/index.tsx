import React, { useState, useEffect } from 'react';
import { RentasProvider, useRentasWizard } from './RentasContext';
import RentasWizard from './RentasWizard';
import ListaPedidos from './ListaPedidos';

const RentasApp: React.FC = () => {
    const [view, setView] = useState<'wizard' | 'list'>('wizard');
    const { setStepActual, setClienteActual, agregarAlCarrito, limpiarWizard, setPedidoCargadoId } = useRentasWizard();

    useEffect(() => {
        const handleLoadPedido = async (e: Event) => {
            const customEvent = e as CustomEvent;
            const pedidoId = customEvent.detail;

            try {
                // Fetch pedido completo con items
                const res = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}`);
                if (!res.ok) throw new Error('Error al cargar pedido');
                const pedido = await res.json();

                limpiarWizard();
                setPedidoCargadoId(pedido.id);
                setClienteActual({
                    nombre: pedido.clienteNombre || '',
                    direccionEntrega: pedido.direccionEntrega || '',
                    fechaEntrega: pedido.fechaEntrega ? pedido.fechaEntrega.split('T')[0] : '',
                    horaEntrega: pedido.horaEntrega || '',
                    fechaRecoleccion: pedido.fechaRecoleccion ? pedido.fechaRecoleccion.split('T')[0] : '',
                    horaRecoleccion: pedido.horaRecoleccion || '',
                    requiereFactura: pedido.requiereFactura || false,
                    notas: pedido.notas || ''
                });

                // Llenar carrito simulando items
                pedido.items.forEach((item: any) => {
                    const mockInvItem = {
                        id: item.inventarioId,
                        name: item.descripcion,
                        price: Number(item.precioUnitario),
                        unit: 'pz',
                        subCategoryId: 'N/A'
                    };
                    agregarAlCarrito(mockInvItem as any, Number(item.cantidad));
                });

                // Cambiar vista al paso de devolución
                setView('wizard');
                setStepActual(4);
            } catch (error) {
                console.error(error);
                alert('No se pudo cargar el pedido detallado.');
            }
        };

        window.addEventListener('loadPedidoParaDevolucion', handleLoadPedido);
        return () => window.removeEventListener('loadPedidoParaDevolucion', handleLoadPedido);
    }, [limpiarWizard, setPedidoCargadoId, setClienteActual, agregarAlCarrito, setStepActual]);

    return (
        <div className="flex flex-col h-full bg-gray-50 min-h-screen">
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm relative z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setView('wizard')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'wizard' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Nueva Renta
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Historial de Pedidos
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full">
                {view === 'wizard' ? (
                    <RentasWizard />
                ) : (
                    <ListaPedidos onCargarPedidoParaDevolucion={(pedidoId) => {
                        // Aquí podríamos disparar un evento global o usar el contexto
                        // Pero como ListaPedidos no está dentro del Wizard per se
                        // Lo mejor es emitir el ID, cambiar a wizard, e interceptarlo allí
                        // Para simplificar, pasamos el ID por window o un state superior
                        const event = new CustomEvent('loadPedidoParaDevolucion', { detail: pedidoId });
                        window.dispatchEvent(event);
                        setView('wizard');
                    }} />
                )}
            </div>
        </div>
    );
};

const RentasWizardWrapper: React.FC = () => {
    return (
        <RentasProvider>
            <RentasApp />
        </RentasProvider>
    );
};

export default RentasWizardWrapper;
