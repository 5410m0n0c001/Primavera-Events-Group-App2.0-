import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// --- LAYOUTS ---

// GET Layout for an Event
router.get('/layout/:eventId', async (req, res) => {
    try {
        const layout = await prisma.layout.findUnique({
            where: { eventId: req.params.eventId }
        });
        res.json(layout || { data: null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch layout' });
    }
});

// SAVE Layout
router.post('/layout', async (req, res) => {
    try {
        const { eventId, name, data } = req.body;
        const layout = await prisma.layout.upsert({
            where: { eventId },
            update: { data },
            create: { eventId, name: name || 'Default Layout', data }
        });
        res.json(layout);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save layout' });
    }
});

// --- TIMELINES ---

// GET Timeline for an Event
router.get('/timeline/:eventId', async (req, res) => {
    try {
        const timeline = await prisma.timeline.findUnique({
            where: { eventId: req.params.eventId },
            include: { items: { orderBy: { order: 'asc' } } }
        });
        res.json(timeline || { items: [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
});

// SAVE Timeline Item
router.post('/timeline/item', async (req, res) => {
    try {
        const { eventId, time, description } = req.body;

        let timeline = await prisma.timeline.findUnique({ where: { eventId } });
        if (!timeline) {
            timeline = await prisma.timeline.create({ data: { eventId } });
        }

        const count = await prisma.timelineItem.count({ where: { timelineId: timeline.id } });

        const item = await prisma.timelineItem.create({
            data: {
                timelineId: timeline.id,
                time,
                description,
                order: count + 1
            }
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save timeline item' });
    }
});

// DELETE Timeline Item
router.delete('/timeline/item/:id', async (req, res) => {
    try {
        await prisma.timelineItem.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;
