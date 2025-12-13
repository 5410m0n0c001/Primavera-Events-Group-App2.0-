import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all clients
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching clients' });
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
        const { firstName, lastName, email, phone, address, notes, type } = req.body;
        const client = await prisma.client.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                notes,
                type: type || 'LEAD'
            }
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error creating client' });
    }
});

// PUT update client
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, notes, type } = req.body;
        const client = await prisma.client.update({
            where: { id: req.params.id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                notes,
                type
            }
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error updating client' });
    }
});

export default router;
