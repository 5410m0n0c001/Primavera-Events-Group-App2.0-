import React, { useState, useEffect } from 'react';

interface CalendarEventFormProps {
    event?: any;
    selectedDate?: Date;
    onSave: (event: any) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

const CalendarEventForm: React.FC<CalendarEventFormProps> = ({ event, selectedDate, onSave, onDelete, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Boda',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        guestCount: 0,
        status: 'DRAFT',
        clientId: '',
        venueId: ''
    });

    const [clients, setClients] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Clients and Venues for dropdowns
        fetch('/api/clients').then(res => res.json()).then(setClients);
        fetch('/api/venues').then(res => res.json()).then(setVenues);

        if (event) {
            setFormData({
                name: event.name,
                type: event.type,
                date: event.date.split('T')[0],
                guestCount: event.guestCount,
                status: event.status,
                clientId: event.clientId || '',
                venueId: event.venueId || ''
            });
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {event ? 'Editar Evento' : 'Nuevo Evento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Boda">Boda</option>
                                <option value="XV Años">XV Años</option>
                                <option value="Bautizo">Bautizo</option>
                                <option value="Empresarial">Empresarial</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                required
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Invitados</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={formData.guestCount}
                                onChange={e => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="DRAFT">Borrador (Cotizando)</option>
                                <option value="CONFIRMED">Confirmado</option>
                                <option value="COMPLETED">Completado</option>
                                <option value="CANCELLED">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cliente</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            value={formData.clientId}
                            onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                        >
                            <option value="">-- Seleccionar Cliente --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Locación (Venue)</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            value={formData.venueId}
                            onChange={e => setFormData({ ...formData, venueId: e.target.value })}
                        >
                            <option value="">-- Seleccionar Locación --</option>
                            {venues.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t mt-4">
                        {event && (
                            <button
                                type="button"
                                onClick={() => onDelete(event.id)}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                Eliminar
                            </button>
                        )}
                        <span className="flex-1"></span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primavera-gold text-white font-bold rounded-lg hover:brightness-110 transition shadow-lg"
                        >
                            Guardar Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalendarEventForm;
