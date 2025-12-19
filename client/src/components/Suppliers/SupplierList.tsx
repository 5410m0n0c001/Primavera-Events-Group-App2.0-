import React, { useEffect, useState } from 'react';

interface Supplier {
    id: string;
    name: string;
    category: string;
    contactName: string;
    email: string;
    phone: string;
    rating: number;
    terms?: string;
}

const SupplierList: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Florería',
        contactName: '',
        email: '',
        phone: '',
        terms: ''
    });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            category: 'Florería',
            contactName: '',
            email: '',
            phone: '',
            terms: ''
        });
        setShowModal(true);
    };

    const handleOpenEdit = (s: Supplier) => {
        setEditingId(s.id);
        setFormData({
            name: s.name,
            category: s.category,
            contactName: s.contactName || '',
            email: s.email || '',
            phone: s.phone || '',
            terms: s.terms || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${name}?`)) return;
        try {
            await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
            setSuppliers(suppliers.filter(s => s.id !== id));
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/suppliers/${editingId}` : '/api/suppliers';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Error saving supplier');

            setShowModal(false);
            loadSuppliers();
        } catch (error) {
            alert('Error al guardar proveedor');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Directorio de Proveedores</h1>
                <button
                    onClick={handleOpenCreate}
                    className="bg-primavera-gold text-white px-4 py-2 rounded shadow hover:brightness-110 font-bold transition-transform transform hover:scale-105"
                >
                    + Nuevo Proveedor
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-lg shadow-xl w-full max-w-md animate-fade-in border border-gray-100 dark:border-white/10">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            {editingId ? 'Editar Proveedor' : 'Registrar Proveedor'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Nombre Empresa</label>
                                <input
                                    className="w-full border p-2 rounded apple-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Categoría</label>
                                <select
                                    className="w-full border p-2 rounded apple-input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Florería</option>
                                    <option>Música</option>
                                    <option>Fotografía</option>
                                    <option>Decoración</option>
                                    <option>Banquetes</option>
                                    <option>Mobiliario</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Contacto</label>
                                    <input
                                        className="w-full border p-2 rounded apple-input"
                                        value={formData.contactName}
                                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Teléfono</label>
                                    <input
                                        className="w-full border p-2 rounded apple-input"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Email</label>
                                <input
                                    className="w-full border p-2 rounded apple-input"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primavera-gold text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-yellow-600 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? <p className="text-center py-10 text-gray-500">Cargando proveedores...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suppliers.map(provider => (
                        <div key={provider.id} className="bg-white dark:bg-[#1c1c1e] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-white/5 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primavera-gold transition-colors">{provider.name}</h3>
                                    <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 inline-block font-medium 
                                        ${provider.category === 'Florería' ? 'bg-pink-100 text-pink-800' :
                                            provider.category === 'Música' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {provider.category}
                                    </span>
                                </div>
                                <div className="text-yellow-400 font-bold text-sm">★ {provider.rating.toFixed(1)}</div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-4">👤</span> {provider.contactName || 'No registrado'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4">📧</span> {provider.email || 'No registrado'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4">📱</span> {provider.phone || 'No registrado'}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-3 border-t dark:border-white/10 mt-auto">
                                <button
                                    onClick={() => handleOpenEdit(provider)}
                                    className="flex-1 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded text-sm font-medium transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(provider.id, provider.name)}
                                    className="flex-1 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-medium transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    {suppliers.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">
                            No hay proveedores registrados.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupplierList;
