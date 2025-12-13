import PDFDocument from 'pdfkit';

// ... existing code ...

const router = Router();

// ... existing /validate route ...

// PDF Generation Endpoint
router.post('/generate-pdf', async (req, res) => {
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

export default router;
