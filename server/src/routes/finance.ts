import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const payments = await prisma.payment.findMany();
        const expenses = await prisma.expense.findMany();

        const totalIncome = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
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
        const payments = await prisma.payment.findMany({
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
        const expenses = await prisma.expense.findMany({
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
