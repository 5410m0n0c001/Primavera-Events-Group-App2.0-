import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/venues/seed - Restore default venues
router.post('/seed', async (req, res) => {
    try {
        const MOCK_VENUES = [
            { name: 'Salón Los Caballos', capacity: 300, priceRent: 15000, description: 'Amplio salón estilo hacienda con jardines.', features: [{ name: 'Jardín', type: 'amenity' }, { name: 'Pista de Baile', type: 'amenity' }] },
            { name: 'Jardín La Flor', capacity: 200, priceRent: 12000, description: 'Hermoso jardín ideal para bodas al aire libre.', features: [{ name: 'Carpa', type: 'amenity' }, { name: 'Iluminación', type: 'amenity' }] },
            { name: 'Salón Los Potrillos', capacity: 150, priceRent: 10000, description: 'Espacio íntimo para eventos familiares.', features: [{ name: 'Cocina', type: 'amenity' }, { name: 'Barra', type: 'amenity' }] },
            { name: 'Salón Jardín Yolomécatl', capacity: 400, priceRent: 25000, description: 'Gran capacidad y elegancia para eventos masivos.', features: [{ name: 'Escenario', type: 'amenity' }, { name: 'Estacionamiento', type: 'amenity' }] },
            { name: 'Salón Presidente', capacity: 500, priceRent: 30000, description: 'El venue más exclusivo y grande.', features: [{ name: 'A/C', type: 'amenity' }, { name: 'Suite', type: 'amenity' }] },
        ];

        for (const venue of MOCK_VENUES) {
            // Check if exists
            const exists = await prisma.venue.findFirst({ where: { name: venue.name } });
            if (!exists) {
                await prisma.venue.create({
                    data: {
                        name: venue.name,
                        description: venue.description,
                        capacity: venue.capacity,
                        priceRent: venue.priceRent,
                        features: {
                            create: venue.features.map(f => ({ name: f.name, type: f.type }))
                        }
                    }
                });
            }
        }
        res.json({ message: 'Venues seeded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to seed venues' });
    }
});

// GET /api/venues - List all venues
router.get('/', async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            orderBy: { name: 'asc' },
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
