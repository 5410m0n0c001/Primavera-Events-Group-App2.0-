import React, { useEffect, useState } from 'react';

interface Supplier {
    id: string;
    name: string;
    category: string;
    contactName: string;
    email: string;
    phone: string;
    rating: number;
}

const SupplierList: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState('Florería');
    const [newContact, setNewContact] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    category: newCategory,
                    contactName: newContact,
                    email: newEmail
                })
            });
            setShowModal(false);
            setNewName('');
            setNewContact('');
            setNewEmail('');
            loadSuppliers();
        } catch (error) {
            alert('Error creating supplier');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Directorio de Proveedores</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primavera-gold text-white px-4 py-2 rounded shadow hover:brightness-110 font-bold"
                >
                    + Nuevo Proveedor
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">Registrar Proveedor</h2>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Nombre de la Empresa"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                required
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                            >
                                <option>Florería</option>
                                <option>Música</option>
                                <option>Fotografía</option>
                                <option>Decoración</option>
                                <option>Banquetes</option>
                                <option>Otro</option>
                            </select>
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Nombre de Contacto"
                                value={newContact}
                                onChange={e => setNewContact(e.target.value)}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Email"
                                type="email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                            />
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                                <button type="submit" className="bg-primavera-gold text-white px-4 py-1 rounded font-bold">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? <p>Cargando...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map(provider => (
                        <div key={provider.id} className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{provider.name}</h3>
                                    <span className="text-xs uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        {provider.category}
                                    </span>
                                </div>
                                <div className="text-yellow-400 font-bold text-sm">★ {provider.rating.toFixed(1)}</div>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold">Contacto:</span> {provider.contactName || '-'}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold">Email:</span> {provider.email || '-'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupplierList;
