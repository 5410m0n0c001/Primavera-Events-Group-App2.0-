import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

// POST /api/venues/seed - Restore default venues
router.post('/seed', async (req, res) => {
    try {
        const MOCK_VENUES = [
            { name: 'Centro de Convenciones Presidente', capacity: 500, priceRent: 30000, link: '', description: 'Banquete Masivo (Arriba de 250+ Invitados). Exclusividad en Banquetería Primavera.', features: [{ name: 'A/C', type: 'amenity' }, { name: 'Área Kids', type: 'amenity' }, { name: 'Capitán VIP', type: 'amenity' }] },
            { name: 'Jardín Salón Yolomecatl', capacity: 400, priceRent: 25000, link: '', description: 'Acatlipa, Temixco. Eventos masivos y destino Yolomecatl.', features: [{ name: 'Pantalla Gigante', type: 'amenity' }, { name: 'Jardín', type: 'amenity' }, { name: 'Capilla', type: 'amenity' }] },
            { name: 'Villa San Gaspar', capacity: 200, priceRent: 18000, link: '', description: 'Jiutepec. Boda íntima "Esencia Floral" o estilo XV.', features: [{ name: 'Cascada', type: 'amenity' }, { name: 'Área Consagrada', type: 'amenity' }, { name: 'Valet', type: 'amenity' }] },
            { name: 'Jardín Salón Los Caballos', capacity: 300, priceRent: 15000, link: '', description: 'Ocotepec. Especialidad XV años y paquete "Imperial Ecuestre".', features: [{ name: 'Personalizado', type: 'amenity' }, { name: 'DJ Residente', type: 'amenity' }] },
            { name: 'Rancho Los Potrillos', capacity: 500, priceRent: 25000, link: '', description: 'Cuernavaca. Paquete "Linaje Pura Sangre", bodas charras.', features: [{ name: 'Toro Mecánico', type: 'amenity' }, { name: 'Banda Sinfónica', type: 'amenity' }, { name: 'Ruedo', type: 'amenity' }] },
            { name: 'Quinta Zarabanda', capacity: 250, priceRent: 22000, link: '', description: 'Jiutepec. Paquete "Armonía Zarabanda". Cuenta con suite y hospedaje.', features: [{ name: 'Hospedaje VIP', type: 'amenity' }, { name: 'Alberca', type: 'amenity' }, { name: 'Climatizada', type: 'amenity' }] },
            { name: 'Jardín Tsu Nuum', capacity: 250, priceRent: 25000, link: '', description: 'Xochitepec. Bodas de lujo "Vuelo Esmeralda", hotel 60px.', features: [{ name: 'Hotel 60px', type: 'amenity' }, { name: 'Boutique', type: 'amenity' }, { name: 'Robot LED', type: 'amenity' }] },
            { name: 'Finca Los Isabeles', capacity: 250, priceRent: 15000, link: '', description: 'Bodas estilo naturaleza "Nature\'s Majesty". Hospedaje 14px.', features: [{ name: 'Hospedaje 14px', type: 'amenity' }, { name: 'Mesa Tipo Mármol', type: 'amenity' }] }
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
                        link: venue.link,
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
            select: {
                id: true,
                name: true,
                description: true,
                address: true,
                link: true,
                capacity: true,
                priceRent: true,
                features: {
                    select: {
                        name: true,
                        type: true
                    }
                },
                images: {
                    take: 1, // Only need one image for list view
                    select: {
                        url: true,
                        caption: true
                    }
                }
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
    const { name, description, address, link, capacity, priceRent, pricePerHour, features } = req.body;

    // Sanitize features to remove any existing old IDs from client
    const safeFeatures = Array.isArray(features)
        ? features.map((f: any) => ({ name: f.name, type: f.type, value: f.value }))
        : [];

    try {
        const venue = await prisma.venue.create({
            data: {
                name,
                description,
                address,
                link,
                capacity: Number(capacity),
                priceRent: priceRent ? Number(priceRent) : null,
                pricePerHour: pricePerHour ? Number(pricePerHour) : null,
                features: safeFeatures.length > 0 ? {
                    create: safeFeatures
                } : undefined
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
    const { name, description, address, link, capacity, priceRent, pricePerHour, features } = req.body;

    // Sanitize features to remove old IDs from the client object before recreating them
    const safeFeatures = Array.isArray(features)
        ? features.map((f: any) => ({ name: f.name, type: f.type, value: f.value }))
        : [];

    try {
        if (safeFeatures || features) {
            await prisma.venueFeature.deleteMany({ where: { venueId: id } });
        }

        const venue = await prisma.venue.update({
            where: { id },
            data: {
                name,
                description,
                address,
                link,
                capacity: Number(capacity),
                priceRent: priceRent ? Number(priceRent) : null,
                pricePerHour: pricePerHour ? Number(pricePerHour) : null,
                features: safeFeatures.length > 0 ? {
                    create: safeFeatures
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
