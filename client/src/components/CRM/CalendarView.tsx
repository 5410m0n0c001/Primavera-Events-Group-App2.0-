import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
    id: string;
    name: string;
    date: string;
    type: string;
    status: string;
    client?: { firstName: string; lastName: string };
}

import CalendarEventForm from './CalendarEventForm';

const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        fetch('http://localhost:3000/api/calendar')
            .then(res => res.json())
            .then(data => setEvents(data));
    };

    const handleDayClick = (day: Date) => {
        setSelectedEvent(null);
        setSelectedDate(day);
        setShowForm(true);
    };

    const handleEventClick = (e: React.MouseEvent, event: Event) => {
        e.stopPropagation(); // Prevent triggering day click
        setSelectedEvent(event);
        setSelectedDate(null);
        setShowForm(true);
    };

    const handleSave = async (eventData: any) => {
        const method = selectedEvent ? 'PUT' : 'POST';
        const url = selectedEvent
            ? `http://localhost:3000/api/calendar/${selectedEvent.id}`
            : 'http://localhost:3000/api/calendar';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (res.ok) {
                setShowForm(false);
                fetchEvents();
            } else {
                const error = await res.json();
                alert(error.error || 'Error al guardar');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este evento permanentemente?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/calendar/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setShowForm(false);
                fetchEvents();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-primavera-gold font-bold capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                <div className="space-x-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="px-3 py-1 border rounded hover:bg-gray-100">{'<'}</button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 border rounded hover:bg-gray-100">Hoy</button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="px-3 py-1 border rounded hover:bg-gray-100">{'>'}</button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 shadow rounded-lg overflow-hidden">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-xs font-semibold uppercase text-gray-500">
                        {day}
                    </div>
                ))}

                {Array.from({ length: days[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
                ))}

                {days.map(day => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => handleDayClick(day)}
                            className={`bg-white min-h-[120px] p-2 hover:bg-gray-50 transition cursor-pointer ${isToday(day) ? 'bg-blue-50' : ''}`}
                        >
                            <div className={`text-right text-sm font-medium mb-1 ${isToday(day) ? 'text-primavera-gold' : 'text-gray-700'}`}>
                                {format(day, 'd')}
                            </div>
                            <div className="space-y-1">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => handleEventClick(e, event)}
                                        className={`text-xs p-1 rounded truncate border-l-2 pl-2 hover:brightness-95 cursor-pointer ${event.status === 'CONFIRMED' ? 'bg-green-100 border-green-500 text-green-800' :
                                            event.status === 'COMPLETED' ? 'bg-gray-100 border-gray-500 text-gray-800' :
                                                'bg-yellow-100 border-yellow-500 text-yellow-800'
                                            }`}
                                    >
                                        <div className="font-bold">{event.type}</div>
                                        <div className="opacity-75">{event.client?.firstName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <CalendarEventForm
                    event={selectedEvent}
                    selectedDate={selectedDate || new Date()}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default CalendarView;
