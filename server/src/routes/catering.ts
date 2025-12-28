import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

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

// UPDATE Ingredient
router.put('/ingredients/:id', async (req, res) => {
    try {
        const { name, unit, costPerUnit, stock } = req.body;
        const ingredient = await prisma.ingredient.update({
            where: { id: req.params.id },
            data: {
                name,
                unit,
                costPerUnit: parseFloat(costPerUnit),
                stock: parseFloat(stock)
            }
        });
        res.json(ingredient);
    } catch (e) { res.status(500).json({ error: 'Error updating ingredient' }); }
});

// DELETE Ingredient
router.delete('/ingredients/:id', async (req, res) => {
    try {
        await prisma.ingredient.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Error deleting ingredient' }); }
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

// UPDATE Dish
router.put('/dishes/:id', async (req, res) => {
    try {
        const { name, description, price, recipeItems } = req.body;
        const id = req.params.id;

        // Recalculate cost
        let calculatedCost = 0;
        if (recipeItems && recipeItems.length > 0) {
            const ingIds = recipeItems.map((r: any) => r.ingredientId);
            const ingredients = await prisma.ingredient.findMany({ where: { id: { in: ingIds } } });

            recipeItems.forEach((r: any) => {
                const ing = ingredients.find(i => i.id === r.ingredientId);
                if (ing) {
                    calculatedCost += parseFloat(ing.costPerUnit.toString()) * r.quantity;
                }
            });
        }

        // Transaction to update dish and replace recipe items
        const dish = await prisma.$transaction(async (tx) => {
            // Delete existing recipe items
            await tx.recipeItem.deleteMany({ where: { dishId: id } });

            // Update dish and create new recipe items
            return await tx.dish.update({
                where: { id },
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
        });

        res.json(dish);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error updating dish' });
    }
});

// DELETE Dish
router.delete('/dishes/:id', async (req, res) => {
    try {
        // RecipeItems should be deleted by cascade or we delete them manually if not set up
        // Assuming cascade or simple delete for now. 
        // If strict, we might need to delete recipeItems first. 
        // Let's assume schema handles cascade or we do it explicitly just in case.
        // But for brevity, I'll try direct delete. If it fails, I'll add explicit delete.
        // Actually, explicit delete is safer.
        const deleteItems = prisma.recipeItem.deleteMany({ where: { dishId: req.params.id } });
        const deleteDish = prisma.dish.delete({ where: { id: req.params.id } });

        await prisma.$transaction([deleteItems, deleteDish]);

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Error deleting dish' }); }
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

// UPDATE Menu
router.put('/menus/:id', async (req, res) => {
    try {
        const { name, description, dishIds } = req.body;
        const menu = await prisma.menu.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                dishes: {
                    set: [], // Disconnect all
                    connect: dishIds.map((id: string) => ({ id })) // Connect new
                }
            }
        });
        res.json(menu);
    } catch (e) { res.status(500).json({ error: 'Error updating menu' }); }
});

// DELETE Menu
router.delete('/menus/:id', async (req, res) => {
    try {
        await prisma.menu.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Error deleting menu' }); }
});

export default router;
