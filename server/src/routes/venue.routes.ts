import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

// POST /api/venues/seed - Restore default venues
router.post('/seed', async (req, res) => {
    try {
        const MOCK_VENUES = [
            { name: 'Finca los Isabeles', capacity: 250, priceRent: 15000, link: '', description: 'Mesa redonda, silla rústica, cristalería y montaje Elite. Hospedaje y alberca (costo extra).', features: [{ name: 'Jardín', type: 'amenity' }, { name: 'Alberca', type: 'amenity' }, { name: 'Suite Nupcial', type: 'amenity' }] },
            { name: 'Jardín Nautilus', capacity: 400, priceRent: 15000, link: '', description: 'Paquete de graduaciones o bodas grandes al aire libre.', features: [{ name: 'Jardín', type: 'amenity' }] },
            { name: 'Centro de Convenciones Presidente', capacity: 500, priceRent: 30000, link: '', description: 'Av. Defensa Nacional 8, Col. Chamilpa. Exclusivo, amplio, techado.', features: [{ name: 'A/C', type: 'amenity' }, { name: 'Estacionamiento 35 vehículos', type: 'amenity' }, { name: 'Área Kids', type: 'amenity' }] },
            { name: 'Villa San Gaspar', capacity: 200, priceRent: 18000, link: '', description: 'Priv. Las Fuentes s/n, Jiutepec. Cascada iluminada y área consagrada.', features: [{ name: 'Cascada', type: 'amenity' }, { name: 'Área Consagrada', type: 'amenity' }, { name: 'Estacionamiento 60 autos', type: 'amenity' }] },
            { name: 'Jardín San Rafael', capacity: 800, priceRent: 20000, link: '', description: 'Ideal para eventos masivos y graduaciones Elite.', features: [{ name: 'Jardín Amplio', type: 'amenity' }] },
            { name: 'Jardín Paraíso del Lago', capacity: 300, priceRent: 15000, link: '', description: 'Jardín con lago decorativo, ideal para bodas.', features: [{ name: 'Lago', type: 'amenity' }] },
            { name: 'Jardín Salón Yolomecatl', capacity: 400, priceRent: 25000, link: '', description: 'Calle Palma 6, Acatlipa, Temixco. Gran capacidad y elegancia.', features: [{ name: 'Escenario', type: 'amenity' }, { name: 'Capilla Consagrada', type: 'amenity' }] },
            { name: 'Quinta Zarabanda', capacity: 250, priceRent: 22000, link: '', description: 'Av. Lauro Ortega Martínez 4, Las Ánimas. Hospedaje y suite nupcial.', features: [{ name: 'Hospedaje 14 pax', type: 'amenity' }, { name: 'Estacionamiento + Valet', type: 'amenity' }, { name: 'Alberca', type: 'amenity' }] },
            { name: 'Jardín Tsu Nuum', capacity: 250, priceRent: 25000, link: '', description: 'Carretera a Aeropuerto KM 0.5, Xochitepec. Bodas de lujo "Vuelo Esmeralda".', features: [{ name: 'Hotel 60 pax', type: 'amenity' }, { name: 'Suite Privada', type: 'amenity' }, { name: 'Área Consagrada', type: 'amenity' }] },
            { name: 'Jardín Salón Los Caballos', capacity: 300, priceRent: 15000, link: '', description: 'Calle Zaragoza 1107, Ocotepec. Iluminación arquitectónica.', features: [{ name: 'Pantalla Gigante', type: 'amenity' }, { name: 'Jardín', type: 'amenity' }] },
            { name: 'Rancho Los Potrillos', capacity: 500, priceRent: 25000, link: '', description: 'Amplio rancho en Cuernavaca. Ideal paquete Linaje Pura Sangre.', features: [{ name: 'Jardín', type: 'amenity' }, { name: 'Salón', type: 'amenity' }] },
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
