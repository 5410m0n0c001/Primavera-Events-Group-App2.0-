import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET all staff
router.get('/', async (req, res) => {
    try {
        const staff = await prisma.staff.findMany();
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching staff' });
    }
});

// POST create staff
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, role, dailyRate, phone, email } = req.body;
        const staff = await prisma.staff.create({
            data: {
                firstName,
                lastName,
                role,
                dailyRate: dailyRate ? parseFloat(dailyRate) : undefined,
                phone,
                email
            }
        });
        res.status(201).json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Error creating staff member' });
    }
});

export default router;
