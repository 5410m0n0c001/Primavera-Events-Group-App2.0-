import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});

// POST create supplier
router.post('/', async (req, res) => {
    try {
        const { name, category, contactName, email, phone, terms } = req.body;
        const supplier = await prisma.supplier.create({
            data: {
                name,
                category,
                contactName,
                email,
                phone,
                terms
            }
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});

// PUT update rating
router.put('/:id/rating', async (req, res) => {
    try {
        const { rating } = req.body;
        const supplier = await prisma.supplier.update({
            where: { id: req.params.id },
            data: { rating: parseFloat(rating) }
        });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rating' });
    }
});

export default router;
