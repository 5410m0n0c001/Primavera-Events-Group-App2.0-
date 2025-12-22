import React, { useState, useEffect } from 'react';
import type { Venue } from '../../types/VenueTypes';
import VenueForm from './VenueForm';
import VenueCalendar from './VenueCalendar';

const VenuesManager: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

    // Fallback Data in case backend is offline/empty
    const MOCK_VENUES: Venue[] = [
        { id: 'v1', name: 'Salón Los Caballos', capacity: 300, priceRent: 15000, description: 'Amplio salón estilo hacienda con jardines.', features: [{ name: 'Jardín', type: 'amenity' }, { name: 'Pista de Baile', type: 'amenity' }], images: [], status: 'active', packages: [] },
        { id: 'v2', name: 'Jardín La Flor', capacity: 200, priceRent: 12000, description: 'Hermoso jardín ideal para bodas al aire libre.', features: [{ name: 'Carpa', type: 'amenity' }, { name: 'Iluminación', type: 'amenity' }], images: [], status: 'active', packages: [] },
        { id: 'v3', name: 'Salón Los Potrillos', capacity: 150, priceRent: 10000, description: 'Espacio íntimo para eventos familiares.', features: [{ name: 'Cocina', type: 'amenity' }, { name: 'Barra', type: 'amenity' }], images: [], status: 'active', packages: [] },
        { id: 'v4', name: 'Salón Jardín Yolomécatl', capacity: 400, priceRent: 25000, description: 'Gran capacidad y elegancia para eventos masivos.', features: [{ name: 'Escenario', type: 'amenity' }, { name: 'Estacionamiento', type: 'amenity' }], images: [], status: 'active', packages: [] },
        { id: 'v5', name: 'Salón Presidente', capacity: 500, priceRent: 30000, description: 'El venue más exclusivo y grande.', features: [{ name: 'A/C', type: 'amenity' }, { name: 'Suite', type: 'amenity' }], images: [], status: 'active', packages: [] },
    ];

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await fetch('/api/venues');
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setVenues(data);
                } else {
                    console.warn('Backend returned empty list, using mocks.');
                    setVenues(MOCK_VENUES);
                }
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            console.error('Error fetching venues, using mock data:', error);
            setVenues(MOCK_VENUES);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingVenue(null);
        setShowForm(true);
    };

    const handleEdit = (venue: Venue) => {
        setEditingVenue(venue);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta locación?')) return;
        try {
            const response = await fetch(`/api/venues/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setVenues(prev => prev.filter(v => v.id !== id));
            }
        } catch (error) {
            console.error('Error deleting venue:', error);
        }
    };

    const handleSave = async (venueData: Partial<Venue>) => {
        try {
            const method = editingVenue ? 'PUT' : 'POST';
            const url = editingVenue
                ? `/api/venues/${editingVenue.id}`
                : '/api/venues';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venueData)
            });

            if (response.ok) {
                setShowForm(false);
                fetchVenues();
            } else {
                alert('Error al guardar locación');
            }
        } catch (error) {
            console.error('Error saving venue:', error);
            alert('Error al guardar locación');
        }
    };

    const handleRestoreDefaults = async () => {
        if (!confirm('¿Restaurar las 5 locaciones por defecto? Esto agregará los salones base si no existen.')) return;
        setLoading(true);
        try {
            const response = await fetch('/api/venues/seed', { method: 'POST' });
            if (response.ok) {
                await fetchVenues();
                alert('Locaciones restauradas correctamente.');
            } else {
                alert('Error al restaurar locaciones.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al restaurar locaciones.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center dark:text-gray-400">Cargando locaciones...</div>;

    return (
        <div className="p-6 bg-gray-50 dark:bg-black min-h-screen relative animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Locaciones y Salones</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gestiona tus espacios y consulta disponibilidad</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRestoreDefaults}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        title="Cargar locaciones de ejemplo"
                    >
                        ↻ Restaurar
                    </button>
                    <button
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-lg"
                        onClick={handleCreate}
                    >
                        <span>+</span> Nueva Locación
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map(venue => (
                    <div key={venue.id} className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col border border-transparent dark:border-white/10">
                        <div className="h-48 bg-gray-200 dark:bg-white/5 relative group">
                            {/* Placeholder or Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-white/5">
                                {venue.images?.[0] ? (
                                    <img src={venue.images[0].url} alt={venue.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-300 dark:text-gray-600">🏢</span>
                                )}
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow text-gray-800 dark:text-white">
                                {venue.capacity} pax
                            </div>
                        </div>

                        <div className="p-5 flex-grow">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{venue.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">{venue.description}</p>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm border-b dark:border-white/10 pb-2">
                                    <span className="text-gray-500 dark:text-gray-400">Renta Base</span>
                                    <span className="font-semibold text-green-700 dark:text-green-400">
                                        ${venue.priceRent?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {venue.features.slice(0, 3).map((f, i) => (
                                        <span key={i} className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md border border-purple-100 dark:border-purple-500/30">
                                            {f.name}
                                        </span>
                                    ))}
                                    {venue.features.length > 3 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-500 px-1 py-1">+{venue.features.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t dark:border-white/10 flex gap-2">
                            <button
                                onClick={() => handleEdit(venue)}
                                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-white dark:hover:bg-white/10 hover:border-purple-300 hover:text-purple-600 transition text-sm font-medium"
                            >
                                Editar
                            </button>
                            <button
                                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                                onClick={() => { setSelectedVenue(venue); setShowCalendar(true); }}
                            >
                                Calendario
                            </button>
                            <button
                                onClick={() => handleDelete(venue.id)}
                                className="px-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <VenueForm
                    venue={editingVenue}
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {showCalendar && selectedVenue && (
                <VenueCalendar
                    venueId={selectedVenue.id}
                    venueName={selectedVenue.name}
                    onClose={() => setShowCalendar(false)}
                />
            )}
        </div>
    );
};

export default VenuesManager;
