import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { startOfDay, endOfDay, addHours, isBefore, isAfter, isEqual, startOfHour, formatISO } from 'date-fns';

export const calendarService = {

    /**
     * Comprueba las franjas horarias disponibles para una cita en un día determinado
     * @param dateString YYYY-MM-DD format
     */
    async checkAvailability(dateString: string, venueId?: string) {
        const queryDate = new Date(dateString);

        const businessHours = {
            start: parseInt(process.env.BUSINESS_HOURS_START || '10'),
            end: parseInt(process.env.BUSINESS_HOURS_END || '18')
        };

        // Ensure date to check is valid
        if (isNaN(queryDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Sunday availability constraints (optional - depending on business logic. 
        // For simplicity, allowed 10-18 every day, can filter weekends later if requested)

        const start = startOfDay(queryDate);
        const end = endOfDay(queryDate);

        // Fetch existing appointments for the given date
        const appointments = await prisma.appointment.findMany({
            where: {
                scheduledAt: {
                    gte: start,
                    lte: end
                },
                status: {
                    not: 'CANCELLED' // Ignore cancelled appointments
                }
            },
            select: {
                scheduledAt: true,
                duration: true
            }
        });

        const bookedTimes = appointments.map(app => app.scheduledAt.getTime());
        const slots = [];
        let isDateAvailable = false;

        // Generate hourly slots
        for (let hour = businessHours.start; hour < businessHours.end; hour++) {
            const slotTime = new Date(queryDate);
            slotTime.setHours(hour, 0, 0, 0);

            // Check if this time slot is in the past
            if (isBefore(slotTime, new Date())) {
                slots.push({ time: formatISO(slotTime), available: false, past: true });
                continue;
            }

            // Check if slot falls on any booked time
            const isBooked = bookedTimes.includes(slotTime.getTime());
            slots.push({ time: formatISO(slotTime), available: !isBooked });

            if (!isBooked) {
                isDateAvailable = true;
            }
        }

        return {
            available: isDateAvailable,
            slots,
            nextAvailable: this._findNextAvailableSlot(slots) // helper
        };
    },

    _findNextAvailableSlot(slots: { time: string, available: boolean, past?: boolean }[]) {
        const availableSlots = slots.filter(s => s.available && !s.past);
        return availableSlots.length > 0 ? availableSlots[0].time : null;
    },

    /**
     * Reserva una nueva cita validando primero la disponibilidad
     */
    async bookAppointment(leadId: string, scheduledAt: string, type: string, notes?: string) {

        const scheduledDate = new Date(scheduledAt);

        // Validate date
        if (isNaN(scheduledDate.getTime())) {
            throw new Error('Invalid scheduledAt date format.');
        }

        if (isBefore(scheduledDate, new Date())) {
            throw new Error('Cannot book an appointment in the past.');
        }

        // Check if there's already an appointment (strictly at the same hour start)
        const hourStart = startOfHour(scheduledDate);
        const nextHour = addHours(hourStart, 1);

        const conflict = await prisma.appointment.findFirst({
            where: {
                scheduledAt: {
                    gte: hourStart,
                    lt: nextHour
                },
                status: { not: 'CANCELLED' }
            }
        });

        if (conflict) {
            throw new Error('Conflict: El horario seleccionado ya no está disponible.');
        }

        // Validate lead exists
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) throw new Error('Lead not found. Cannot book appointment.');

        // Validate lead doesn't already have an active appointment to prevent duplicates
        const existingApp = await prisma.appointment.findFirst({
            where: { leadId: leadId, status: { not: 'CANCELLED' } }
        });

        if (existingApp) {
            throw new Error('This lead already has an active appointment.');
        }

        const appointment = await prisma.appointment.create({
            data: {
                leadId,
                scheduledAt: hourStart, // Enforce hourly 
                type: type || 'consulta',
                notes: notes,
                duration: parseInt(process.env.APPOINTMENT_DURATION || '60')
            }
        });

        // Update the lead status to directly reflect they've been engaged
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'CONTACTED' }
        });

        return {
            appointmentId: appointment.id,
            confirmed: true,
            scheduledAt: appointment.scheduledAt
        };
    },

    /**
     * Obtiene las citas del dia en curso (Para Panel de Administrador)
     */
    async getTodayAppointments() {
        const start = startOfDay(new Date());
        const end = endOfDay(new Date());

        return prisma.appointment.findMany({
            where: {
                scheduledAt: { gte: start, lte: end }
            },
            include: {
                lead: {
                    select: { name: true, phone: true, eventType: true }
                }
            },
            orderBy: { scheduledAt: 'asc' }
        });
    },

    /**
     * Obtiene resúmenes de citas en un rango (Admin)
     */
    async getAppointmentsByRange(start: Date, end: Date) {
        return prisma.appointment.findMany({
            where: {
                scheduledAt: { gte: start, lte: end }
            },
            include: { lead: true },
            orderBy: { scheduledAt: 'asc' }
        });
    }
};
