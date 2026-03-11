import React, { useEffect, useState } from 'react';


interface Pedido {
    id: string;
    numeroPedido: string;
    clienteNombre: string;
    fechaEntrega: string;
    fechaRecoleccion: string;
    total: number;
    status: string;
}

interface ListaPedidosProps {
    onCargarPedidoParaDevolucion: (pedidoId: string) => void;
}

const ListaPedidos: React.FC<ListaPedidosProps> = ({ onCargarPedidoParaDevolucion }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/pedidos');
                if (response.ok) {
                    const data = await response.json();
                    setPedidos(data);
                }
            } catch (error) {
                console.error('Error fetching pedidos', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'BORRADOR': return 'bg-gray-100 text-gray-800';
            case 'CONFIRMADO': return 'bg-blue-100 text-blue-800';
            case 'EN_PREPARACION': return 'bg-yellow-100 text-yellow-800';
            case 'ENTREGADO': return 'bg-purple-100 text-purple-800';
            case 'COMPLETADO': return 'bg-green-100 text-green-800';
            case 'CANCELADO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pedidos</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrega</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recolección</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{pedido.numeroPedido}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pedido.clienteNombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(pedido.fechaRecoleccion).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pedido.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pedido.status)}`}>
                                        {pedido.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => window.print()}
                                        className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors mr-2 inline-flex items-center"
                                        title="Imprimir Pedido"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimir
                                    </button>

                                    {/* Si el pedido está entregado o confirmado y se puede devolver */}
                                    {(pedido.status === 'ENTREGADO' || pedido.status === 'CONFIRMADO') && (
                                        <button
                                            onClick={() => onCargarPedidoParaDevolucion(pedido.id)}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                                        >
                                            Procesar Devolución
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {pedidos.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No hay pedidos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaPedidos;
