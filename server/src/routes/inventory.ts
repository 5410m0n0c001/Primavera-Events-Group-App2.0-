import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET Check Availability for a specific Date
router.get('/availability', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: 'Date is required' });

        const targetDate = new Date(date as string);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // 1. Find all CONFIRMED events for this date
        const conflictEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'CONFIRMED'
            },
            include: {
                quotes: {
                    where: { status: 'ACCEPTED' },
                    include: { items: true }
                }
            }
        });

        // 2. Calculate reserved quantities
        const reservedMap: Record<string, number> = {};
        conflictEvents.forEach(event => {
            // Take the accepted quote (assuming 1 per event for now)
            const acceptedQuote = event.quotes[0];
            if (acceptedQuote) {
                acceptedQuote.items.forEach(qItem => {
                    reservedMap[qItem.serviceItemId] = (reservedMap[qItem.serviceItemId] || 0) + qItem.quantity;
                });
            }
        });

        // 3. Fetch all catalog items with stock
        const allItems = await prisma.catalogItem.findMany({
            where: { stock: { gt: 0 } } // Only track items that are "inventory" (stock > 0)
        });

        // 4. Map availability
        const availability = allItems.map(item => {
            const reserved = reservedMap[item.id] || 0;
            let parsedOptions = {};
            try {
                parsedOptions = item.options ? JSON.parse(item.options) : {};
            } catch (e) {
                // ignore parse error
            }

            return {
                ...item,
                options: parsedOptions, // Return as object
                reserved,
                available: item.stock - reserved,
                status: (item.stock - reserved) <= 0 ? 'UNAVAILABLE' : 'AVAILABLE'
            };
        });

        res.json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error checking availability' });
    }
});

// POST Log Maintenance
router.post('/maintenance', async (req, res) => {
    try {
        const { itemId, type, quantity, cost, notes } = req.body;

        // 1. Create Log
        const log = await prisma.maintenanceLog.create({
            data: {
                itemId,
                type,
                quantity: parseInt(quantity),
                cost: parseFloat(cost),
                notes
            }
        });

        // 2. Update Stock logic
        // If "Loss" -> decrease stock. If "Replacement" -> increase stock.
        // If "Repair" -> maybe unavailable temporarily (not implemented yet, just logging)
        if (type === 'Loss') {
            await prisma.catalogItem.update({
                where: { id: itemId },
                data: { stock: { decrement: parseInt(quantity) } }
            });
        } else if (type === 'Replacement') {
            await prisma.catalogItem.update({
                where: { id: itemId },
                data: { stock: { increment: parseInt(quantity) } }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Error logging maintenance' });
    }
});

// GET Low Stock Alerts
router.get('/alerts', async (req, res) => {
    try {
        const threshold = 10; // Simple threshold
        const lowStockItems = await prisma.catalogItem.findMany({
            where: {
                stock: { lte: threshold, gt: 0 } // gt 0 to ignore services like "DJ" which might have 0 stock logic
            }
        });
        res.json(lowStockItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching alerts' });
    }
});

// POST Create Item
router.post('/', async (req, res) => {
    try {
        const { name, unit, stock, subCategoryId, price, options } = req.body;
        const item = await prisma.catalogItem.create({
            data: {
                name,
                unit,
                stock: Number(stock),
                subCategoryId,
                price: Number(price || 0),
                options: options ? JSON.stringify(options) : null
            }
        });
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// PUT Update Item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, unit, stock, price, options } = req.body;

        const item = await prisma.catalogItem.update({
            where: { id },
            data: {
                name,
                unit,
                stock: Number(stock),
                price: Number(price),
                options: options ? JSON.stringify(options) : undefined
            }
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE Remove Item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check availability logic could be added here (e.g. don't delete if booked)
        await prisma.catalogItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;
