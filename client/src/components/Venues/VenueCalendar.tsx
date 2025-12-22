import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface VenueCalendarProps {
    venueId: string;
    venueName: string;
    onClose: () => void;
}

interface CalendarEvent {
    date: string;
    status: string; // CONFIRMED, DRAFT
    name?: string;
}

const VenueCalendar: React.FC<VenueCalendarProps> = ({ venueId, venueName, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEventData, setNewEventData] = useState({
        name: '',
        type: 'Boda',
        guestCount: '',
        clientId: 'temp-client-id' // Simplified for MVP or require selection
    });

    useEffect(() => {
        fetchEvents();
    }, [venueId]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            if (!venueId) return;
            const response = await fetch(`/api/venues/${venueId}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events || []);
            }
        } catch (error) {
            console.error('Error fetching calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (date: Date) => {
        setSelectedDate(date);
        setNewEventData({ ...newEventData, name: '' });
        setShowModal(true);
    };

    const handleSaveEvent = async () => {
        if (!selectedDate || !newEventData.name) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        try {
            const response = await fetch('/api/calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venueId,
                    date: selectedDate.toISOString(),
                    name: newEventData.name,
                    type: newEventData.type,
                    guestCount: Number(newEventData.guestCount),
                    status: 'DRAFT',
                    clientId: 'default' // In real app, select client
                })
            });

            if (response.ok) {
                setShowModal(false);
                fetchEvents();
            } else {
                const err = await response.json();
                alert('Error: ' + err.error);
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error al guardar evento');
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">&lt;</button>
            <h2 className="text-xl font-bold text-gray-800 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">&gt;</button>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 mb-2 text-center text-sm font-semibold text-gray-600">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day}>{day}</div>)}
        </div>
    );

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 gap-1">
                {allDays.map((date, i) => {
                    const isCurrentMonth = isSameMonth(date, monthStart);
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), date));

                    return (
                        <div
                            key={i}
                            onClick={() => handleCellClick(date)}
                            className={`
                                h-24 border rounded p-1 relative cursor-pointer
                                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                hover:border-purple-300 hover:shadow-md transition
                            `}
                        >
                            <span className="text-sm font-medium">{format(date, 'd')}</span>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                                {dayEvents.map((evt, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-xs p-1 rounded truncate ${evt.status === 'CONFIRMED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        title={evt.name || evt.status}
                                    >
                                        {evt.name || (evt.status === 'CONFIRMED' ? 'Reservado' : 'Apartado')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Calendario: {venueName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div className="flex-grow overflow-auto">
                    {renderHeader()}
                    {renderDays()}
                    {loading ? <div className="text-center py-10">Cargando disponibilidad...</div> : renderCells()}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded-sm border border-red-200"></span> Reservado</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded-sm border border-yellow-200"></span> Apartado</span>
                    </div>
                    <p>Click en un día para reservar</p>
                </div>
            </div>

            {/* Event Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Nueva Reserva: {selectedDate && format(selectedDate, 'dd MMM yyyy', { locale: es })}</h3>
                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Nombre del Evento"
                                value={newEventData.name}
                                onChange={e => setNewEventData({ ...newEventData, name: e.target.value })}
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={newEventData.type}
                                onChange={e => setNewEventData({ ...newEventData, type: e.target.value })}
                            >
                                <option value="Boda">Boda</option>
                                <option value="XV Años">XV Años</option>
                                <option value="Corporativo">Corporativo</option>
                            </select>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                placeholder="Invitados aprox."
                                value={newEventData.guestCount}
                                onChange={e => setNewEventData({ ...newEventData, guestCount: e.target.value })}
                            />
                            <div className="flex gap-2 justify-end mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveEvent}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueCalendar;
