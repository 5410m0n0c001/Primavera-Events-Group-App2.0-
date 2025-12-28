import { Router, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { CalculatorEngine } from '../services/CalculatorEngine';

const router = Router();

// Validation Endpoint
router.post('/validate', async (req: Request, res: Response) => {
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

// PDF Generation Endpoint
router.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        const { eventName, guestCount, date, items, totals } = req.body;

        const doc = new PDFDocument();

        // Stream the PDF to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto-${eventName || 'evento'}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Primavera Events Group', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Cotización de Evento', { align: 'center' });
        doc.moveDown();

        // Event Details
        doc.fontSize(12).text(`Evento: ${eventName}`);
        doc.text(`Fecha: ${date || 'Por definir'}`);
        doc.text(`Invitados: ${guestCount}`);
        doc.moveDown();

        // Items Table
        doc.font('Helvetica-Bold').text('Detalle de Servicios:', { underline: true });
        doc.moveDown(0.5);

        items.forEach((item: any) => {
            const price = Number(item.price || item.unitPrice || 0);
            const total = Number(item.total || (price * item.quantity));
            doc.font('Helvetica').text(`- ${item.name} (${item.quantity} ${item.unit}) - $${total.toLocaleString('es-MX')}`);
        });

        doc.moveDown();

        // Totals
        const finalTotal = totals?.total || items.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);

        doc.font('Helvetica-Bold').fontSize(14).text(`TOTAL: $${finalTotal.toLocaleString('es-MX')}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error('PDF Generation error:', error);
        res.status(500).json({ error: 'Error generating PDF' });
    }
});

// POST / - Create or Update Quote
router.post('/', async (req: Request, res: Response) => {
    console.log('[QUOTES] Saving quote...', JSON.stringify(req.body, null, 2));
    try {
        const {
            eventName,
            guestCount,
            date,
            items,
            totals,
            status = 'DRAFT',
            discount,
            downPaymentPercentage,
            paymentLimitDate,
            clientId
        } = req.body;

        // Validation
        if (!eventName) return res.status(400).json({ error: 'Event name is required' });

        const result = await prisma.$transaction(async (tx) => {

            // 1. Find or Create Client
            let targetClientId = clientId;
            if (!targetClientId) {
                // Try finding by name/email heuristic or creating a lead
                const distinctEmail = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}@temp.com`;
                const newClient = await tx.client.create({
                    data: {
                        firstName: eventName.split(' ')[0] || 'Cliente',
                        lastName: eventName.split(' ').slice(1).join(' ') || 'Nuevo',
                        email: distinctEmail,
                        type: 'LEAD',
                        company: 'Event Lead',
                        notes: `Creado desde Cotizador para evento: ${eventName}`
                    }
                });
                targetClientId = newClient.id;
            }

            // 2. Create Event
            // Note: Schema requires 'clientId'.
            const eventData = {
                name: eventName,
                type: 'Social', // Default
                date: new Date(date),
                guestCount: Number(guestCount) || 0,
                clientId: targetClientId,
                status: status === 'ACCEPTED' ? 'CONFIRMED' : 'DRAFT',
                userId: null // Optional
            };

            const newEvent = await tx.event.create({ data: eventData });
            console.log('[QUOTES] Event created:', newEvent.id);

            // 3. Create Quote
            const quote = await tx.quote.create({
                data: {
                    eventId: newEvent.id,
                    subtotal: totals?.subtotal || 0,
                    tax: totals?.tax || 0,
                    total: totals?.total || 0,
                    status,
                    version: 1,
                    margin: 0
                }
            });

            // 4. Handle Quote Items
            if (items && Array.isArray(items)) {
                // Ensure a "Custom Item" exists for manual entries
                let customItem = await tx.catalogItem.findFirst({ where: { name: 'Item Personalizado' } });

                if (!customItem) {
                    // Create a generic fallback category if needed
                    let customCat = await tx.catalogSubCategory.findFirst({ where: { name: 'General' } });
                    if (!customCat) {
                        // Need a category first
                        const rootCat = await tx.catalogCategory.create({ data: { name: 'Varios' } });
                        customCat = await tx.catalogSubCategory.create({
                            data: { name: 'General', categoryId: rootCat.id }
                        });
                    }

                    customItem = await tx.catalogItem.create({
                        data: {
                            name: 'Item Personalizado',
                            price: 0,
                            unit: 'servicio',
                            subCategoryId: customCat.id
                        }
                    });
                }

                for (const item of items) {
                    let serviceItemId = item.item?.id; // Try to get ID from payload

                    // If manual or invalid, use generic custom item
                    // Manual items usually have IDs like 'manual_...' or 'qi_...'
                    const isManual = !serviceItemId || !serviceItemId.includes('-') || serviceItemId.startsWith('cat_') === false;
                    // Actually, if it's from our DB it's UUID. If it's manual it might be anything.
                    // Safer check: If it exists in DB use it, else use customItem.

                    // For performance, we assume if it looks like UUID it is one, else Custom.
                    // But to be super safe inside transaction:
                    if (serviceItemId) {
                        const exists = await tx.catalogItem.findUnique({ where: { id: serviceItemId } });
                        if (!exists) serviceItemId = customItem.id;
                    } else {
                        serviceItemId = customItem.id;
                    }

                    await tx.quoteItem.create({
                        data: {
                            quoteId: quote.id,
                            serviceItemId,
                            quantity: Number(item.quantity) || 1,
                            unitPrice: Number(item.unitPrice) || Number(item.item?.price) || 0,
                            cost: 0,
                            notes: item.item?.name || 'Item manual' // Store original name here
                        }
                    });
                }
            }

            // 5. If Status is ACCEPTED, we should ideally register payment placeholders? 
            // Skipping for MVP stability.

            return { quote, event: newEvent };
        });

        console.log('[QUOTES] Success:', result.quote.id);
        res.json(result);

    } catch (error: any) {
        console.error('❌ [QUOTES] Error saving quote:', error); // Log full error
        res.status(500).json({ error: 'Failed to save quote', details: error.message || String(error) });
    }
});

export default router;
