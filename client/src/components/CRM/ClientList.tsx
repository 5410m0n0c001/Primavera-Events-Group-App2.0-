import React, { useEffect, useState } from 'react';
import { ClientDetailsModal, type Client } from './ClientDetailsModal';
import { ClientEditModal } from './ClientEditModal';

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const isMounted = React.useRef(true);

    useEffect(() => {
        isMounted.current = true;
        fetchClients();
        return () => { isMounted.current = false; };
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            if (!res.ok) throw new Error('Error fetching clients');
            const data = await res.json();
            if (isMounted.current) {
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const handleViewDetails = (client: Client) => {
        setSelectedClient(client);
        setShowDetailsModal(true);
    };

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setShowEditModal(true);
    };

    const handleDelete = async (clientId: string) => {
        try {
            const res = await fetch(`/api/clients/${clientId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Error deleting client');
            setClients(clients.filter((c) => c.id !== clientId));
            // alert('Cliente eliminado');
        } catch (error) {
            alert('Error al eliminar cliente');
            console.error(error);
        }
    };

    const handleSaveClient = (savedClient: Client) => {
        const exists = clients.some(c => c.id === savedClient.id);
        if (exists) {
            setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
        } else {
            setClients([savedClient, ...clients]);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto animate-fade-in-up w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-primavera-gold font-bold">Gestión de Clientes</h2>
                <button
                    onClick={() => {
                        setSelectedClient(null);
                        setShowEditModal(true);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 border border-white/10 font-medium"
                >
                    + Nuevo Cliente
                </button>
            </div>

            <div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow border border-gray-200 dark:border-white/10 overflow-x-auto md:overflow-hidden h-auto min-h-0 w-full">
                <table className="w-full text-left min-w-[800px] md:min-w-0">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-semibold border-b dark:border-white/10">
                        <tr>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Estatus</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {loading ? <tr><td className="p-4 dark:text-gray-400">Cargando...</td></tr> : clients.map(client => (
                            <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium dark:text-white">{client.firstName} {client.lastName}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">{client.email}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">{client.phone || '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${client.type === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                                        client.type === 'PROSPECT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                        {client.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewDetails(client)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`¿Eliminar a ${client.firstName}?`)) {
                                                    handleDelete(client.id);
                                                }
                                            }}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && clients.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay clientes registrados aún.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ClientDetailsModal
                client={selectedClient}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ClientEditModal
                client={selectedClient}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedClient(null);
                }}
                onSave={handleSaveClient}
            />
        </div>
    );
};

export default ClientList;
