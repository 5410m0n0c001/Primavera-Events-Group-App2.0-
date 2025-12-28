import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
import { prisma } from '../prisma';

// GET - Listar ingresos (Generic + Linked)
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, search } = req.query;

        const where: any = {};

        // Date Filter
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            };
        }

        // Search Filter
        if (search) {
            where.OR = [
                { source: { contains: search as string } },
                { notes: { contains: search as string } },
                { event: { client: { name: { contains: search as string } } } }
            ];
        }

        const incomes = await prisma.income.findMany({
            where,
            include: { event: true },
            orderBy: { date: 'desc' }
        });
        res.json(incomes);
    } catch (error) {
        console.error('[income] Error:', error);
        res.status(500).json({ error: 'Failed to fetch incomes' });
    }
});

// POST - Crear ingreso
router.post('/', async (req, res) => {
    try {
        const { amount, source, eventId, notes, date } = req.body;

        if (!amount || !source) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const income = await prisma.income.create({
            data: {
                amount: parseFloat(amount),
                source,
                eventId: eventId || null,
                notes,
                date: date ? new Date(date) : undefined
            },
            include: { event: true }
        });

        res.json(income);
    } catch (error) {
        console.error('[income] Error:', error);
        res.status(400).json({ error: 'Failed to create income' });
    }
});

// GET - Ingresos por evento
router.get('/event/:eventId', async (req, res) => {
    try {
        const incomes = await prisma.income.findMany({
            where: { eventId: req.params.eventId },
            orderBy: { date: 'desc' }
        });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incomes' });
    }
});

export default router;
