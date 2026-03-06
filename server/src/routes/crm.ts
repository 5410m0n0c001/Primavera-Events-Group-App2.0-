import { Router } from 'express';
import { crmService } from '../services/crmService';
import rateLimit from 'express-rate-limit';

const router = Router();

const publicLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

// ==== PUBLIC ENDPOINTS ====

// POST /api/crm/leads - Called by Sofia AI or public forms
router.post('/leads', publicLimiter, async (req, res) => {
    try {
        const data = req.body;

        // Basic validation: needs at least name, email, or phone
        if (!data.name && !data.email && !data.phone) {
            return res.status(400).json({ error: 'Name, email, or phone is required to create a lead.' });
        }

        const result = await crmService.createOrUpdateLead(data);
        res.status(201).json({ leadId: result.lead.id, isNew: result.isNew, message: result.message });
    } catch (error) {
        console.error('Error creating/updating lead:', error);
        res.status(500).json({ error: 'Failed to process lead' });
    }
});

// ==== ADMIN ENDPOINTS ==== 
// Note: Auth middleware is applied in index.ts for /api/crm/admin/*

// GET /api/crm/admin/leads
router.get('/admin/leads', async (req, res) => {
    try {
        const { status, eventType, startDate, endDate } = req.query;
        let dateRange;

        if (startDate && endDate) {
            dateRange = { start: new Date(startDate as string), end: new Date(endDate as string) };
        }

        const leads = await crmService.getAllLeads({
            status,
            eventType: eventType as string,
            dateRange
        });

        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// GET /api/crm/admin/summary
router.get('/admin/summary', async (req, res) => {
    try {
        const summary = await crmService.getLeadsSummary();
        res.json(summary);
    } catch (error) {
        console.error('Error fetching leads summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// GET /api/crm/admin/leads/:id
router.get('/admin/leads/:id', async (req, res) => {
    try {
        const lead = await crmService.getLead(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        console.error('Error fetching lead details:', error);
        res.status(500).json({ error: 'Failed to fetch lead' });
    }
});

// PUT /api/crm/admin/leads/:id
router.put('/admin/leads/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const updatedLead = await crmService.updateLeadStatus(req.params.id, status);
        res.json(updatedLead);
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

export default router;
