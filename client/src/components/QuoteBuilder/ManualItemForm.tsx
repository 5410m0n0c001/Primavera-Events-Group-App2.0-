import React, { useState } from 'react';

interface ManualItemFormProps {
    categories: string[];
    onSave: (item: any) => void;
    onClose: () => void;
}

const ManualItemForm: React.FC<ManualItemFormProps> = ({ categories, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        unit: 'pza',
        category: '', // Startup empty or first? Let's use empty
        description: ''
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    React.useEffect(() => {
        if (categories.length > 0) {
            setFormData(prev => ({ ...prev, category: categories[0] }));
        }
    }, [categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: `manual_${Date.now()}`,
            ...formData,
            category: isCustomCategory ? customCategory : formData.category
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Agregar Elemento Manual</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Elemento</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded px-3 py-2"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio Unitario</label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Unidad</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={isCustomCategory ? 'custom' : formData.category}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    setIsCustomCategory(true);
                                } else {
                                    setIsCustomCategory(false);
                                    setFormData({ ...formData, category: e.target.value });
                                }
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="custom">+ Nueva Categoría</option>
                        </select>
                        {isCustomCategory && (
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Escribe el nombre de la nueva categoría"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            rows={2}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primavera-gold text-white font-bold rounded hover:brightness-110">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualItemForm;
