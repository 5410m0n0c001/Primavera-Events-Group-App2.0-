import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all events (for calendar view)
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                client: true, // Include client name
                venue: true   // Include venue name
            }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// POST create event
router.post('/', async (req, res) => {
    try {
        const { name, type, date, guestCount, clientId, venueId, status } = req.body;

        // Basic conflict check
        if (venueId && status === 'CONFIRMED') {
            const conflict = await prisma.event.findFirst({
                where: {
                    venueId,
                    date: {
                        gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                        lt: new Date(new Date(date).setHours(23, 59, 59, 999))
                    },
                    status: 'CONFIRMED'
                }
            });
            if (conflict) {
                return res.status(409).json({ error: 'Venue already booked for this date' });
            }
        }

        const event = await prisma.event.create({
            data: {
                name,
                type,
                date: new Date(date),
                guestCount: parseInt(guestCount || 0),
                clientId,
                venueId,
                status: status || 'DRAFT'
            }
        });
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating event' });
    }
});

// PUT Update Event
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, date, guestCount, clientId, venueId, status } = req.body;

        const event = await prisma.event.update({
            where: { id },
            data: {
                name,
                type,
                date: date ? new Date(date) : undefined,
                guestCount: guestCount ? parseInt(guestCount) : undefined,
                clientId,
                venueId,
                status
            }
        });
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating event' });
    }
});

// DELETE Remove Event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({ where: { id } });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting event' });
    }
});

export default router;
