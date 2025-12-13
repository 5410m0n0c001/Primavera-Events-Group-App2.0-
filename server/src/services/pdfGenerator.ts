import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface QuoteData {
    eventName: string;
    guestCount: number;
    date?: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        unit: string;
    }[];
}

export const generateQuotePDF = (data: QuoteData, res: Response) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream directly to response
    doc.pipe(res);

    // --- Header ---
    doc.fontSize(25).text('PRIMAVERA EVENTS GROUP', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Expertos en Bodas y Eventos Exclusivos', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // --- Event Details ---
    doc.moveDown();
    doc.fontSize(14).text('Detalles de la Cotización');
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Evento: ${data.eventName}`);
    doc.text(`Invitados: ${data.guestCount}`);
    doc.text(`Fecha: ${data.date || 'Por definir'}`);
    doc.moveDown();

    // --- Table Header ---
    const tableTop = 250;
    const itemX = 50;
    const priceX = 400;
    const totalX = 480;

    doc.font('Helvetica-Bold');
    doc.text('Servicio / Item', itemX, tableTop);
    doc.text('Precio Unit.', priceX, tableTop);
    doc.text('Total', totalX, tableTop);
    doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // --- Table Content ---
    doc.font('Helvetica');
    let y = tableTop + 25;
    let subtotal = 0;

    data.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemName = `${item.name} (x${item.quantity})`;

        // Check page break
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(itemName, itemX, y, { width: 300 });
        doc.text(`$${item.price.toFixed(2)}`, priceX, y);
        doc.text(`$${itemTotal.toFixed(2)}`, totalX, y);

        y += 20;
    });

    doc.moveTo(itemX, y).lineTo(550, y).stroke();
    y += 10;

    // --- Totals ---
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    doc.font('Helvetica-Bold');
    doc.text('Subtotal:', priceX, y);
    doc.text(`$${subtotal.toFixed(2)}`, totalX, y);
    y += 15;
    doc.text('IVA (16%):', priceX, y);
    doc.text(`$${tax.toFixed(2)}`, totalX, y);
    y += 15;
    doc.fontSize(14).text('TOTAL:', priceX, y);
    doc.text(`$${total.toFixed(2)}`, totalX, y);

    // --- Footer ---
    doc.fontSize(10).text('Gracias por su preferencia.', 50, 700, { align: 'center', width: 500 });

    doc.end();
};
