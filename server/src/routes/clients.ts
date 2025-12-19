import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all clients
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' },
            include: { events: false } // Optimize: don't include events list in main table
        });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Error fetching clients', details: String(error) });
    }
});

// GET client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: req.params.id },
            include: { events: true }
        });
        if (!client) return res.status(404).json({ error: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching client' });
    }
});

// POST create client
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, notes, company, type } = req.body;

        const client = await prisma.client.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                notes,
                company, // Assuming schema supports company? If not, schema update needed.
                type: type || 'LEAD'
            }
        });
        res.status(201).json(client);
    } catch (error: any) {
        console.error('Error creating client:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }
        res.status(500).json({ error: 'Error creating client', details: error.message });
    }
});

// PUT update client
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, notes, company, type } = req.body;
        const client = await prisma.client.update({
            where: { id: req.params.id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                notes,
                company,
                type
            }
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error updating client' });
    }
});

// DELETE client
router.delete('/:id', async (req, res) => {
    try {
        // Optional: Check dependencies (events)
        await prisma.client.delete({ where: { id: req.params.id } });
        res.json({ message: 'Client deleted' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Error deleting client' });
    }
});

export default router;
