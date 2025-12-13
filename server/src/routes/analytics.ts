import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Revenue Trends (Monthly for current year)
        const currentYear = new Date().getFullYear();
        const payments = await prisma.payment.findMany({
            where: {
                date: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            }
        });

        const monthlyRevenue = new Array(12).fill(0);
        payments.forEach(p => {
            const month = new Date(p.date).getMonth();
            monthlyRevenue[month] += parseFloat(p.amount.toString());
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
        const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
        const activeProjects = await prisma.event.count({
            where: { status: { notIn: ['CANCELLED', 'COMPLETED'] } }
        });
        const pendingLeads = await prisma.client.count({ where: { type: 'LEAD' } });

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
                activeProjects,
                pendingLeads
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;
