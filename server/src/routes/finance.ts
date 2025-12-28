import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
import { prisma } from '../prisma';

// GET Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const payments = await prisma.payment.findMany();
        const expenses = await prisma.expense.findMany();
        const incomes = await prisma.income.findMany();

        const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const totalOtherIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);

        const totalIncome = totalPayments + totalOtherIncome;

        const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
        const netProfit = totalIncome - totalExpenses;

        const pendingIncome = payments.filter(p => p.status === 'Pendiente').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const pendingExpenses = expenses.filter(e => e.status === 'Pendiente').reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

        res.json({
            totalIncome,
            totalExpenses,
            netProfit,
            pendingIncome,
            pendingExpenses
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// --- PAYMENTS (Income) ---

// GET all payments
router.get('/payments', async (req, res) => {
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
                { reference: { contains: search as string } }, // SQLite is case-insensitive by default roughly, Postgres uses mode: 'insensitive'
                { method: { contains: search as string } },
                { event: { client: { name: { contains: search as string } } } }
            ];
        }

        const payments = await prisma.payment.findMany({
            where,
            include: { event: { include: { client: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// POST create payment
router.post('/payments', async (req, res) => {
    try {
        const { eventId, amount, method, status, reference } = req.body;
        const payment = await prisma.payment.create({
            data: {
                eventId,
                amount: parseFloat(amount),
                method,
                status,
                reference
            }
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// --- EXPENSES (Costs) ---

// GET all expenses
router.get('/expenses', async (req, res) => {
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
                { description: { contains: search as string } },
                { category: { contains: search as string } },
                { supplier: { name: { contains: search as string } } }
            ];
        }

        const expenses = await prisma.expense.findMany({
            where,
            include: { supplier: true },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// POST create expense
router.post('/expenses', async (req, res) => {
    try {
        const { supplierId, description, amount, category, status } = req.body;
        const expense = await prisma.expense.create({
            data: {
                supplierId: supplierId || undefined, // Allow null
                description,
                amount: parseFloat(amount),
                category,
                status
            }
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// DELETE payment
router.delete('/payments/:id', async (req, res) => {
    try {
        await prisma.payment.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete payment' });
    }
});

// DELETE expense
router.delete('/expenses/:id', async (req, res) => {
    try {
        await prisma.expense.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// GET Projections (Quotes Analysis)
router.get('/projections', async (req, res) => {
    try {
        const quotes = await prisma.quote.findMany({
            select: { total: true, status: true }
        });

        const projection = {
            potential: quotes.filter(q => q.status === 'SENT' || q.status === 'DRAFT').reduce((sum, q) => sum + Number(q.total), 0),
            confirmed: quotes.filter(q => q.status === 'ACCEPTED').reduce((sum, q) => sum + Number(q.total), 0),
            lost: quotes.filter(q => q.status === 'REJECTED').reduce((sum, q) => sum + Number(q.total), 0)
        };

        res.json(projection);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projections' });
    }
});

export default router;
