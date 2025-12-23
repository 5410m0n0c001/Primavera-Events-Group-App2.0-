import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Revenue Trends & Totals (Monthly for current year)
        const currentYear = new Date().getFullYear();

        // Fetch Payments
        const payments = await prisma.payment.findMany({
            where: {
                date: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            }
        });

        // Fetch Generic Incomes
        const incomes = await prisma.income.findMany({
            where: {
                date: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            }
        });

        const monthlyRevenue = new Array(12).fill(0);

        // Sum Payments
        payments.forEach(p => {
            const month = new Date(p.date).getMonth();
            monthlyRevenue[month] += parseFloat(p.amount.toString());
        });

        // Sum Incomes
        incomes.forEach(i => {
            const month = new Date(i.date).getMonth();
            monthlyRevenue[month] += parseFloat(i.amount.toString());
        });

        // 2. Event Distribution (by Type)
        const events = await prisma.event.findMany();
        const eventDistribution: Record<string, number> = {};
        events.forEach(e => {
            const type = e.type || 'Otros';
            eventDistribution[type] = (eventDistribution[type] || 0) + 1;
        });

        // 3. CRM Pipeline (Clients by Type)
        const clients = await prisma.client.groupBy({
            by: ['type'],
            _count: {
                _all: true
            }
        });
        const pipeline = clients.map(c => ({
            name: c.type,
            value: c._count._all
        }));

        // 4. Key Metrics
        // 4. Key Metrics & Extended BI Data

        // --- Finance ---
        const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
        const expenseRecords = await prisma.expense.findMany();
        const totalExpenses = expenseRecords.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const netProfit = totalRevenue - totalExpenses;

        // --- Operations (Projects) ---
        const activeProjects = await prisma.event.count({
            where: { status: { notIn: ['CANCELLED', 'COMPLETED'] } }
        });
        const completedProjects = await prisma.event.count({
            where: { status: 'COMPLETED' }
        });

        // --- CRM ---
        const pendingLeads = await prisma.client.count({ where: { type: 'LEAD' } });
        const totalClients = await prisma.client.count();

        // --- Quotes ---
        const totalQuotes = await prisma.quote.count();
        const acceptedQuotes = await prisma.quote.count({ where: { status: 'ACCEPTED' } });
        const quoteConversionRate = totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : '0';

        // --- Inventory ---
        const inventoryItems = await prisma.catalogItem.findMany();
        const totalStockValue = inventoryItems.reduce((acc, item) => acc + (Number(item.price) * item.stock), 0);
        const lowStockItems = inventoryItems.filter(i => i.stock <= 5).length;
        const damagedItems = inventoryItems.reduce((acc, item) => acc + item.stockDamaged, 0);

        // --- Venues ---
        const totalVenues = await prisma.venue.count();
        // Ideally we count events per venue, simpler metric for now:
        const mostBookedVenue = "N/A"; // Placeholder for complex aggregation

        // --- Suppliers ---
        const totalSuppliers = await prisma.supplier.count();

        // --- Catering ---
        const totalDishes = await prisma.dish.count();

        res.json({
            revenue: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                data: monthlyRevenue
            },
            eventStats: {
                labels: Object.keys(eventDistribution),
                data: Object.values(eventDistribution)
            },
            pipeline: pipeline,
            metrics: {
                totalRevenue,
                totalExpenses,
                netProfit,
                activeProjects,
                completedProjects,
                pendingLeads,
                totalClients,
                totalQuotes,
                acceptedQuotes,
                quoteConversionRate,
                totalStockValue,
                lowStockItems,
                damagedItems,
                totalVenues,
                totalSuppliers,
                totalDishes
            }
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch analytics',
            details: error.message,
            stack: error.stack
        });
    }
});

export default router;
