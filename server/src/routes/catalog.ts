import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET full catalog
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.catalogCategory.findMany({
            include: {
                subCategories: {
                    include: {
                        items: true
                    }
                }
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
});

// PUT update stock (Inventory)
router.put('/items/:id', async (req, res) => {
    try {
        const { stock, price } = req.body;
        const item = await prisma.catalogItem.update({
            where: { id: req.params.id },
            data: {
                stock: stock !== undefined ? parseInt(stock) : undefined,
                price: price !== undefined ? parseFloat(price) : undefined
            }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error updating item' });
    }
});

export default router;
