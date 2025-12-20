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

// POST Create Category
router.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const category = await prisma.catalogCategory.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// POST Create SubCategory
router.post('/subcategories', async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name || !categoryId) return res.status(400).json({ error: 'Name and CategoryId are required' });

        const subCategory = await prisma.catalogSubCategory.create({
            data: { name, categoryId }
        });
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
});

export default router;
