import React, { useState, useEffect } from 'react';
import type { Venue, VenueFeature } from '../../types/VenueTypes';

interface VenueFormProps {
    venue?: Venue | null;
    onSave: (venue: Partial<Venue>) => void;
    onCancel: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Venue>>({
        name: '',
        description: '',
        address: '',
        capacity: 0,
        priceRent: 0,
        pricePerHour: 0,
        features: [],
        images: []
    });

    useEffect(() => {
        if (venue) {
            setFormData(venue);
        }
    }, [venue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureAdd = () => {
        const newFeature: VenueFeature = { name: '', type: 'Service', value: '' };
        setFormData(prev => ({ ...prev, features: [...(prev.features || []), newFeature] }));
    };

    const handleFeatureChange = (index: number, field: keyof VenueFeature, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleFeatureRemove = (index: number) => {
        setFormData(prev => ({ ...prev, features: prev.features?.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {venue ? 'Editar Locación' : 'Nueva Locación'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacidad (Personas)</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio Renta Base</label>
                            <input
                                type="number"
                                name="priceRent"
                                value={formData.priceRent || 0}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio por Hora (Extra)</label>
                            <input
                                type="number"
                                name="pricePerHour"
                                value={formData.pricePerHour || 0}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    {/* Features Dynamic List */}
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-800">Características y Servicios</h3>
                            <button
                                type="button"
                                onClick={handleFeatureAdd}
                                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                            >
                                + Agregar Característica
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {formData.features?.map((feature, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Nombre (ej. WiFi)"
                                        value={feature.name}
                                        onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-md p-1 text-sm"
                                    />
                                    <select
                                        value={feature.type}
                                        onChange={(e) => handleFeatureChange(index, 'type', e.target.value)}
                                        className="border border-gray-300 rounded-md p-1 text-sm"
                                    >
                                        <option value="Service">Servicio</option>
                                        <option value="Restriction">Restricción</option>
                                        <option value="Furniture">Mobiliario</option>
                                        <option value="Amenity">Amenidad</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Valor (ej. Incluido)"
                                        value={feature.value || ''}
                                        onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-md p-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleFeatureRemove(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                        >
                            Guardar Locación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VenueForm;
