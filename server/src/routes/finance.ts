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

export default router;
