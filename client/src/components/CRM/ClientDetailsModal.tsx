import React from 'react';

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string; // Added address
    notes?: string;   // Added notes
    company?: string; // Added company
    type: string;
    createdAt?: string;
}

interface ClientDetailsModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (client: Client) => void;
    onDelete: (clientId: string) => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
    client,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}) => {
    const [pedidos, setPedidos] = React.useState<any[]>([]);
    const [loadingPedidos, setLoadingPedidos] = React.useState(false);

    React.useEffect(() => {
        if (isOpen && client) {
            setLoadingPedidos(true);
            fetch(`/api/pedidos?leadId=${client.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setPedidos(data);
                })
                .catch(err => console.error("Error fetching pedidos:", err))
                .finally(() => setLoadingPedidos(false));
        }
    }, [isOpen, client]);

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-white/10 animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-xl font-serif font-bold dark:text-white">
                        {client.firstName} {client.lastName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <p className="dark:text-gray-200">{client.email}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                        <p className="dark:text-gray-200">{client.phone || 'N/A'}</p>
                    </div>
                    {client.company && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Empresa</label>
                            <p className="dark:text-gray-200">{client.company}</p>
                        </div>
                    )}
                    {client.address && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Dirección</label>
                            <p className="dark:text-gray-200">{client.address}</p>
                        </div>
                    )}
                    {client.notes && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Notas</label>
                            <p className="dark:text-gray-200 text-sm whitespace-pre-wrap">{client.notes}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${client.type === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            client.type === 'PROSPECT' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {client.type}
                        </span>
                    </div>
                </div>

                {/* Historial de Pedidos de Renta */}
                <div className="p-6 pt-0 border-t border-gray-100 dark:border-white/5 mt-4">
                    <h3 className="text-sm font-bold text-primavera-gold uppercase mt-4 mb-2">🚚 Pedidos de Renta Asociados</h3>
                    {loadingPedidos ? (
                        <p className="text-xs text-gray-400">Cargando...</p>
                    ) : pedidos.length === 0 ? (
                        <p className="text-xs text-gray-400">Este cliente no tiene pedidos de renta grabados.</p>
                    ) : (
                        <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {pedidos.map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-black/40 p-2 rounded">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{p.numeroPedido}</p>
                                        <p className="text-xs text-gray-500">{new Date(p.fechaEntrega).toLocaleDateString()} - <span className="font-medium">{p.status}</span></p>
                                    </div>
                                    <span className="font-bold text-green-600 dark:text-green-400">${p.total?.toFixed(2) || '0.00'}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-6 pt-0 flex gap-3 justify-end border-t border-gray-100 dark:border-white/5 mt-4 pt-4">
                    <button
                        onClick={() => {
                            onEdit(client);
                            onClose();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        onClick={() => {
                            if (window.confirm(`¿Eliminar a ${client.firstName}?`)) {
                                onDelete(client.id);
                                onClose();
                            }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                    >
                        🗑️ Eliminar
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
