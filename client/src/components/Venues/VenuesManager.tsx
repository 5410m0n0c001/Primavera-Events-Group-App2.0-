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

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/venues');
            if (response.ok) {
                const data = await response.json();
                setVenues(data);
            }
        } catch (error) {
            console.error('Error fetching venues:', error);
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
            const response = await fetch(`http://localhost:3000/api/venues/${id}`, { method: 'DELETE' });
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
                ? `http://localhost:3000/api/venues/${editingVenue.id}`
                : 'http://localhost:3000/api/venues';

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

    if (loading) return <div className="p-8 text-center">Cargando locaciones...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Locaciones y Salones</h1>
                    <p className="text-gray-500">Gestiona tus espacios y consulta disponibilidad</p>
                </div>
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-lg"
                    onClick={handleCreate}
                >
                    <span>+</span> Nueva Locación
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map(venue => (
                    <div key={venue.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
                        <div className="h-48 bg-gray-200 relative group">
                            {/* Placeholder or Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                {venue.images?.[0] ? (
                                    <img src={venue.images[0].url} alt={venue.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-300">🏢</span>
                                )}
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow text-gray-800">
                                {venue.capacity} pax
                            </div>
                        </div>

                        <div className="p-5 flex-grow">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{venue.name}</h2>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{venue.description}</p>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm border-b pb-2">
                                    <span className="text-gray-500">Renta Base</span>
                                    <span className="font-semibold text-green-700">
                                        ${venue.priceRent?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {venue.features.slice(0, 3).map((f, i) => (
                                        <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100">
                                            {f.name}
                                        </span>
                                    ))}
                                    {venue.features.length > 3 && (
                                        <span className="text-xs text-gray-500 px-1 py-1">+{venue.features.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex gap-2">
                            <button
                                onClick={() => handleEdit(venue)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-white hover:border-purple-300 hover:text-purple-600 transition text-sm font-medium"
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
                                className="px-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
