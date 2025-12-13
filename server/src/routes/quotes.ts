import { Router } from 'express';
import { CalculatorEngine } from '../services/CalculatorEngine';

const router = Router();

// Validation Endpoint
router.post('/validate', async (req, res) => {
    try {
        const { items, guestCount } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items array' });
        }

        // 1. Re-calculate each item's total based on authoritative logic
        // In a real app, we would fetch the price from DB here to ensure it hasn't changed.
        // For MVP, we trust the 'price' in the payload or use a mock lookup.
        const validatedItems = items.map((item: any) => {
            const unitPrice = Number(item.price || item.unitPrice || 0); // In real DB, fetch by item.id
            const quantity = Number(item.quantity || 0);

            // Recalculate using engine
            const total = CalculatorEngine.calculateTotal(quantity, unitPrice);

            return {
                ...item,
                unitPrice, // Confirm price source of truth
                total,
                status: 'VALID' // Could be 'ADJUSTED' if we found a price diff
            };
        });

        // 2. Calculate Final Totals
        const totals = CalculatorEngine.calculateQuoteTotals(validatedItems);

        res.json({
            valid: true,
            items: validatedItems,
            totals
        });

    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Internal validation failed' });
    }
});

// PDF Generation Endpoint (Moved/Standardized here)
router.post('/generate-pdf', async (req, res) => {
    // ... Existing PDF logic can be migrated here later
    // For now, keeping the implementation simple to just support the current flow
    res.status(501).json({ message: 'PDF Generation is handled in a separate service for now.' });
});

export default router;
