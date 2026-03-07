import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

// POST /api/venues/seed - Restore default venues
router.post('/seed', async (req, res) => {
    try {
        const MOCK_VENUES = [
            { name: 'C.C Presidente (Convenciones)', capacity: 800, priceRent: 0, link: '', description: 'Banquete Masivo Presidente. (Paquetes: Gobernador, Presidente, Linaje Pura Sangre). Cuenta con aire acondicionado, exclusividad y capitán VIP.', features: [{ name: 'A/C', type: 'Amenity', value: 'Incluido' }, { name: 'Área Kids', type: 'Amenity', value: 'Sí' }, { name: 'Capitán VIP', type: 'Service', value: 'Incluido' }] },
            { name: 'Jardín Salón Yolomecatl', capacity: 400, priceRent: 0, link: '', description: 'Acatlipa, Temixco. (Paquete Destino Yolomecatl). Ideal para grandes celebraciones con jardín y capilla.', features: [{ name: 'Pantalla Gigante', type: 'Amenity', value: 'Incluido' }, { name: 'Jardín', type: 'Amenity', value: 'Extenso' }, { name: 'Capilla', type: 'Amenity', value: 'Consagrada' }] },
            { name: 'Priv. Las Fuentes San Gaspar', capacity: 200, priceRent: 0, link: '', description: 'Jiutepec. (Paquete Esencia Floral). Boda íntima o XV años. Cascada y servicio de valet parking.', features: [{ name: 'Cascada', type: 'Amenity', value: 'Iluminada' }, { name: 'Área Consagrada', type: 'Amenity', value: 'Sí' }, { name: 'Valet', type: 'Service', value: 'Opcional' }] },
            { name: 'Jardín Salón Los Caballos', capacity: 300, priceRent: 0, link: '', description: 'Ocotepec. (Paquete Imperial Ecuestre). Especialidad en XV años.', features: [{ name: 'Personalizado', type: 'Service', value: 'Sí' }, { name: 'DJ Residente', type: 'Service', value: 'Top' }] },
            { name: 'Rancho Los Potrillos', capacity: 500, priceRent: 0, link: '', description: 'Cuernavaca. (Paquete Linaje Pura Sangre). Bodas charras, toro mecánico y ruedo.', features: [{ name: 'Toro Mecánico', type: 'Furniture', value: 'Disponible' }, { name: 'Banda Sinfónica', type: 'Service', value: 'Opcional' }, { name: 'Ruedo', type: 'Amenity', value: 'Equipado' }] },
            { name: 'Quinta Zarabanda', capacity: 250, priceRent: 0, link: '', description: 'Jiutepec. (Paquete Armonía Zarabanda). Hospedaje VIP, Alberca.', features: [{ name: 'Hospedaje VIP', type: 'Amenity', value: 'Sí' }, { name: 'Alberca', type: 'Amenity', value: 'Climatizada' }] },
            { name: 'Jardín Tsu Nuum', capacity: 250, priceRent: 0, link: '', description: 'Xochitepec. (Paquete Vuelo Esmeralda). Hotel para 60px, Boutique.', features: [{ name: 'Hotel 60px', type: 'Amenity', value: 'Boutique' }, { name: 'Robot LED', type: 'Service', value: 'Opcional' }] },
            { name: 'Finca Los Isabeles', capacity: 250, priceRent: 0, link: '', description: 'Bodas estilo naturaleza (Paquete Nature\'s Majesty). Hospedaje para 14px.', features: [{ name: 'Hospedaje 14px', type: 'Amenity', value: 'Cabañas' }, { name: 'Mesa Tipo Mármol', type: 'Furniture', value: 'Premium' }] }
        ];

        // Wipe old mock venues aggressively using raw names to kill duplicates like "Convenciones Presidente"
        const oldNames = ['Convenciones Presidente', 'C.C Presidente', 'Jardín Salón Yolomecatl', 'Priv. Las Fuentes San Gaspar', 'Jardín Salón Los Caballos', 'Rancho Los Potrillos', 'Quinta Zarabanda', 'Jardín Tsu Nuum', 'Finca Los Isabeles'];

        // Find existing to delete to avoid constraints if no events attached
        for (const name of oldNames) {
            const matches = await prisma.venue.findMany({ where: { OR: [{ name: { contains: name } }] } });
            for (const match of matches) {
                const count = await prisma.event.count({ where: { venueId: match.id } });
                if (count === 0) {
                    await prisma.venueFeature.deleteMany({ where: { venueId: match.id } });
                    await prisma.venue.delete({ where: { id: match.id } });
                }
            }
        }

        // Fresh insert
        for (const venue of MOCK_VENUES) {
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
        res.json({ message: 'Venues seeded safely. Duplicates without events removed.' });
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
        // Desvincular eventos para evitar fallo de clave foránea
        await prisma.event.updateMany({
            where: { venueId: id },
            data: { venueId: null }
        });

        await prisma.venue.delete({ where: { id } });
        res.json({ message: 'Venue deleted' });
    } catch (error) {
        console.error('API venues DELETE error:', error);
        res.status(500).json({ error: 'Failed to delete venue' });
    }
});

export default router;
