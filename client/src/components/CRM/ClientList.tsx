import React, { useEffect, useState } from 'react';

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    type: string;
}

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newClient, setNewClient] = useState({ firstName: '', lastName: '', email: '', phone: '', type: 'LEAD' });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            if (!res.ok) throw new Error('Error fetching clients');
            const data = await res.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });
            if (!res.ok) throw new Error('Error creating client');

            setShowForm(false);
            setNewClient({ firstName: '', lastName: '', email: '', phone: '', type: 'LEAD' });
            fetchClients();
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Error al guardar el cliente');
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto animate-fade-in-up w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-primavera-gold font-bold">Gestión de Clientes</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primavera-green text-white px-4 py-2 rounded shadow hover:bg-green-600 border border-white/10"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Cliente'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Registrar Cliente</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Nombre"
                            className="p-2 border rounded apple-input"
                            value={newClient.firstName}
                            onChange={e => setNewClient({ ...newClient, firstName: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Apellido"
                            className="p-2 border rounded apple-input"
                            value={newClient.lastName}
                            onChange={e => setNewClient({ ...newClient, lastName: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Email"
                            className="p-2 border rounded apple-input"
                            value={newClient.email}
                            onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Teléfono"
                            className="p-2 border rounded apple-input"
                            value={newClient.phone}
                            onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                        />
                        <select
                            className="p-2 border rounded apple-input"
                            value={newClient.type}
                            onChange={e => setNewClient({ ...newClient, type: e.target.value })}
                        >
                            <option value="LEAD">Lead (Interesado)</option>
                            <option value="PROSPECT">Prospecto (Cotizando)</option>
                            <option value="ACTIVE">Cliente Activo</option>
                        </select>
                        <button type="submit" className="bg-primavera-gold text-white p-2 rounded col-span-2 shadow-lg">Guardar</button>
                    </form>
                </div>
            )}

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
                                    <button className="text-primavera-gold hover:text-yellow-600 dark:hover:text-yellow-300 font-medium">Ver Detalles</button>
                                </td>
                            </tr>
                        ))}
                        {!loading && clients.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay clientes registrados aún.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;
