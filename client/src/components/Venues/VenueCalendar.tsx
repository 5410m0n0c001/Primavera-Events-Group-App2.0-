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
}

const VenueCalendar: React.FC<VenueCalendarProps> = ({ venueId, venueName, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [venueId]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Note: In a real app we would fetch range-based events. 
            // Here we rely on the backend returning all or filtered future events in the venue object or separate endpoint.
            // For MVP we just fetch the venue details which includes events.
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

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">&lt;</button>
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">&gt;</button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return (
            <div className="grid grid-cols-7 mb-2 text-center text-sm font-semibold text-gray-600">
                {days.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        // Iterate days
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 gap-1">
                {allDays.map((date, i) => {
                    const isCurrentMonth = isSameMonth(date, monthStart);
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), date));

                    return (
                        <div
                            key={i}
                            className={`
                                h-24 border rounded p-1 relative 
                                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                hover:border-purple-300 transition
                            `}
                        >
                            <span className="text-sm font-medium">{format(date, 'd')}</span>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                                {dayEvents.map((evt, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-xs p-1 rounded truncate ${evt.status === 'CONFIRMED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        title={evt.status}
                                    >
                                        {evt.status === 'CONFIRMED' ? 'Reservado' : 'Apartado'}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl m-4 p-6 h-[80vh] flex flex-col">
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
                    <button className="text-purple-600 hover:text-purple-800 font-medium">
                        + Nueva Reserva Manual
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VenueCalendar;
