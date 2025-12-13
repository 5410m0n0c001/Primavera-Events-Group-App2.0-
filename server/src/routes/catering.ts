import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// --- INGREDIENTS ---
router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
        res.json(ingredients);
    } catch (e) { res.status(500).json({ error: 'Error fetching ingredients' }); }
});

router.post('/ingredients', async (req, res) => {
    try {
        const { name, unit, costPerUnit, stock } = req.body;
        const ingredient = await prisma.ingredient.create({
            data: { name, unit, costPerUnit: parseFloat(costPerUnit), stock: parseFloat(stock) }
        });
        res.json(ingredient);
    } catch (e) { res.status(500).json({ error: 'Error creating ingredient' }); }
});

// --- DISHES (RECIPES) ---
router.get('/dishes', async (req, res) => {
    try {
        const dishes = await prisma.dish.findMany({
            include: { recipeItems: { include: { ingredient: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(dishes);
    } catch (e) { res.status(500).json({ error: 'Error fetching dishes' }); }
});

router.post('/dishes', async (req, res) => {
    try {
        const { name, description, price, recipeItems } = req.body;

        // Calculate Cost based on ingredients
        let calculatedCost = 0;
        if (recipeItems && recipeItems.length > 0) {
            // This is a simplified calculation. Real-world might need DB lookup for latest costs if not passed.
            // Assuming frontend passes ingredients with current costs or we fetch them.
            // For now, let's trust the logic will fetch costs or we do it here.
            // Better practice: Fetch ingredients to get current costPerUnit
            const ingIds = recipeItems.map((r: any) => r.ingredientId);
            const ingredients = await prisma.ingredient.findMany({ where: { id: { in: ingIds } } });

            recipeItems.forEach((r: any) => {
                const ing = ingredients.find(i => i.id === r.ingredientId);
                if (ing) {
                    calculatedCost += parseFloat(ing.costPerUnit.toString()) * r.quantity;
                }
            });
        }

        const dish = await prisma.dish.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                cost: calculatedCost,
                recipeItems: {
                    create: recipeItems.map((r: any) => ({
                        ingredientId: r.ingredientId,
                        quantity: parseFloat(r.quantity)
                    }))
                }
            }
        });
        res.json(dish);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error creating dish' });
    }
});

// --- MENUS ---
router.get('/menus', async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            include: { dishes: true }
        });
        res.json(menus);
    } catch (e) { res.status(500).json({ error: 'Error fetching menus' }); }
});

router.post('/menus', async (req, res) => {
    try {
        const { name, description, dishIds } = req.body;
        const menu = await prisma.menu.create({
            data: {
                name,
                description,
                dishes: {
                    connect: dishIds.map((id: string) => ({ id }))
                }
            }
        });
        res.json(menu);
    } catch (e) { res.status(500).json({ error: 'Error creating menu' }); }
});

export default router;
