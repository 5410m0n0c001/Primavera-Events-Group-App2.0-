import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/venues - List all venues
router.get('/', async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            include: {
                features: true,
                images: true
            }
        });
        res.json(venues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
});

// GET /api/venues/:id - Get single venue
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                features: true,
                images: true,
                events: {
                    select: {
                        date: true,
                        status: true
                    },
                    where: {
                        date: {
                            gte: new Date() // Only future events
                        }
                    }
                }
            }
        });
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        res.json(venue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
});

// POST /api/venues - Create new venue
router.post('/', async (req, res) => {
    const { name, description, address, capacity, priceRent, pricePerHour, features } = req.body;
    try {
        const venue = await prisma.venue.create({
            data: {
                name,
                description,
                address,
                capacity: Number(capacity),
                priceRent: priceRent ? Number(priceRent) : null,
                pricePerHour: pricePerHour ? Number(pricePerHour) : null,
                features: {
                    create: features // Expecting array of { name, type, value }
                }
            }
        });
        res.status(201).json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create venue' });
    }
});

// PUT /api/venues/:id - Update venue
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, address, capacity, priceRent, pricePerHour, features } = req.body;

    // Note: Updating features is complex (delete/re-create or update). 
    // For simplicity MVP: Delete all features and re-create if provided.

    try {
        if (features) {
            await prisma.venueFeature.deleteMany({ where: { venueId: id } });
        }

        const venue = await prisma.venue.update({
            where: { id },
            data: {
                name,
                description,
                address,
                capacity: Number(capacity),
                priceRent: priceRent ? Number(priceRent) : null,
                pricePerHour: pricePerHour ? Number(pricePerHour) : null,
                features: features ? {
                    create: features
                } : undefined
            }
        });
        res.json(venue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update venue' });
    }
});

// DELETE /api/venues/:id - Delete venue
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.venue.delete({ where: { id } });
        res.json({ message: 'Venue deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete venue' });
    }
});

export default router;
