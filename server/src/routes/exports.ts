import express, { Request, Response } from 'express';
// import { generateEventCSV } from '../services/exportService'; // Ensure this matches file structure
// Need to verify generateEventCSV is exported correctly. Yes it is.
import { generateEventCSV } from '../services/exportService';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/:eventId/export/csv', async (req: any, res: Response) => {
    try {
        const { eventId } = req.params;

        console.log(`[exports] CSV request: ${eventId}`);

        // Validar evento existe
        const eventExists = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!eventExists) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Generar CSV
        const startTime = Date.now();
        const csv = await generateEventCSV(eventId);
        const duration = Date.now() - startTime;

        console.log(`[exports] CSV ready (${duration}ms)`);

        res.setHeader('Content-Type', 'text/csv;charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            `attachment;filename="event_${eventId}.csv"`
        );
        res.setHeader('Cache-Control', 'no-cache');

        res.send(csv);
    } catch (error) {
        console.error('[exports] Error:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
});

export default router;
