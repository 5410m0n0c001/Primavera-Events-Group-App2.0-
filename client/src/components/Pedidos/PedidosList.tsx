import React, { useEffect, useState } from 'react';

interface PedidosListProps {
    onCreateNew: () => void;
    onEdit: (id: string) => void;
}

export default function PedidosList({ onCreateNew, onEdit }: PedidosListProps) {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const res = await fetch('/api/pedidos');
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setPedidos(data);
        } catch (error) {
            console.error('Error fetching pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'BORRADOR': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            case 'CONFIRMADO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'EN_PREPARACION': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'ENTREGADO': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
            case 'RECOLECTADO': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            case 'COMPLETADO': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'CANCELADO': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDownloadPDF = (id: string, numeroPedido: string) => {
        window.open(`/api/pedidos/${id}/pdf`, '_blank');
    };

    const handleSharePDF = async (id: string, numeroPedido: string) => {
        const url = `${window.location.origin}/api/pedidos/${id}/pdf`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Pedido de Renta ${numeroPedido}`,
                    text: `Te comparto el pedido de renta ${numeroPedido} de Primavera Events Group:`,
                    url: url
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            handleDownloadPDF(id, numeroPedido);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Pedidos de Renta</h2>
                <button
                    onClick={onCreateNew}
                    className="px-4 py-2 bg-primavera-gold text-white font-medium rounded-xl hover:bg-yellow-600 transition shadow hover:shadow-md"
                >
                    + Nuevo Pedido
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f5f5f7] dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm font-semibold">
                        <tr>
                            <th className="p-4 rounded-tl-xl">N° Pedido</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Fecha Entrega</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 rounded-tr-xl">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Cargando pedidos...</td></tr>
                        ) : pedidos.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No hay pedidos registrados</td></tr>
                        ) : (
                            pedidos.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium dark:text-white">{p.numeroPedido}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{p.clienteNombre}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(p.fechaEntrega).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-green-600 dark:text-green-400">
                                        ${p.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(p.id)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors">Ver/Editar</button>
                                            <button
                                                onClick={() => handleDownloadPDF(p.id, p.numeroPedido)}
                                                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg text-sm transition-colors"
                                                title="Descargar PDF"
                                            >
                                                📄
                                            </button>
                                            <button
                                                onClick={() => handleSharePDF(p.id, p.numeroPedido)}
                                                className="text-green-500 hover:bg-green-100 dark:hover:bg-green-800/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
                                                title="Compartir"
                                            >
                                                ↗
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
