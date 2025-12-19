import React, { useState, useEffect } from 'react';
import { Client } from './ClientDetailsModal';

interface ClientEditModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Client) => void;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
    client,
    isOpen,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<Partial<Client>>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
        type: 'LEAD',
    });

    useEffect(() => {
        if (client) {
            setFormData(client);
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                company: '',
                address: '',
                notes: '',
                type: 'LEAD',
            });
        }
    }, [client, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id
                ? `/api/clients/${formData.id}`
                : '/api/clients';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar');
            }

            onSave(data);
            onClose();
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-white/10 animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-xl font-serif font-bold dark:text-white">
                        {formData.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 dark:text-white">Nombre *</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                                className="w-full border rounded px-3 py-2 apple-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 dark:text-white">Apellido</label>
                            <input
                                type="text"
                                value={formData.lastName || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, lastName: e.target.value })
                                }
                                className="w-full border rounded px-3 py-2 apple-input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 apple-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 apple-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Empresa</label>
                        <input
                            type="text"
                            value={formData.company || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, company: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 apple-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Dirección</label>
                        <input
                            type="text"
                            value={formData.address || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 apple-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Tipo</label>
                        <select
                            className="w-full border rounded px-3 py-2 apple-input"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="LEAD">Lead (Interesado)</option>
                            <option value="PROSPECT">Prospecto (Cotizando)</option>
                            <option value="ACTIVE">Cliente Activo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 dark:text-white">Notas</label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 apple-input"
                            rows={3}
                        />
                    </div>

                    <div className="pt-2 flex gap-3 justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primavera-gold text-white rounded-lg hover:bg-yellow-600 font-medium shadow-lg transition-colors"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
