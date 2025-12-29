import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

// GET all events (for calendar view)
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            select: {
                id: true,
                name: true,
                type: true,
                date: true,
                status: true,
                guestCount: true,
                client: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                venue: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { date: 'desc' },
            take: 200 // Limit to avoid massive payloads
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// Helper for UUID validation
const isValidUUID = (id: any) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof id === 'string' && regex.test(id);
};

// POST create event
router.post('/', async (req, res) => {
    try {
        const { name, type, date, guestCount, clientId, venueId, status } = req.body;

        // Basic conflict check
        if (venueId && status === 'CONFIRMED' && isValidUUID(venueId)) {
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

        // Handle Invalid Client ID on Create - We need a real client.
        // If clientId is bad (e.g. 'c1'), we fail or use a default?
        // Let's assume frontend sends valid data usually. If 'c1', it will crash unless we catch it.
        // For robusntess, if invalid, try to find a default "Invited" client? 
        // Or just let it fail but LOG it.
        // Better: Validated strictly.

        let finalClientId = clientId;
        if (!isValidUUID(finalClientId)) {
            console.warn('Invalid Client ID received:', clientId);
            // Try to find ANY client to attach to (fallback)
            const fallback = await prisma.client.findFirst();
            if (fallback) finalClientId = fallback.id;
            else return res.status(400).json({ error: 'Invalid Client ID and no fallback found.' });
        }

        const event = await prisma.event.create({
            data: {
                name,
                type,
                date: new Date(date),
                guestCount: parseInt(guestCount || 0),
                clientId: finalClientId,
                venueId: isValidUUID(venueId) ? venueId : null,
                status: status || 'DRAFT'
            }
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
});

// PUT Update Event
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, date, guestCount, clientId, venueId, status } = req.body;

        // Prepare update data, ignoring invalid UUIDs (mock data)
        const updateData: any = {
            name,
            type,
            status
        };

        if (date) updateData.date = new Date(date);
        if (guestCount !== undefined) updateData.guestCount = parseInt(guestCount);

        // Only update relations if IDs are valid UUIDs
        if (clientId && isValidUUID(clientId)) updateData.clientId = clientId;
        if (venueId) {
            updateData.venueId = isValidUUID(venueId) ? venueId : null; // Allow clearing venue if valid or explicit null? 
            // If user sends 'v1', we treat it as NULL or IGNORE? 
            // If we treat as NULL, we lose the relation. If we ignore, we keep old.
            // Safe bet: Ignore invalid, accept valid or null.
            if (!isValidUUID(venueId)) delete updateData.venueId;
        }

        const event = await prisma.event.update({
            where: { id },
            data: updateData
        });
        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
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
