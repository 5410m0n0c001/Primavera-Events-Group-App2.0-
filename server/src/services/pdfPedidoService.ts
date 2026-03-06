import PDFDocument from 'pdfkit';
import { Pedido, PedidoItem } from '@prisma/client';
import fs from 'fs';
import path from 'path';

interface PedidoWithRelations extends Pedido {
    items: PedidoItem[];
    lead?: any;
}

export const generatePedidoPDF = async (pedido: PedidoWithRelations): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Colors
            const primColor = '#D4AF37'; // Gold
            const textColor = '#333333';
            const grayColor = '#666666';

            // --- HEADER ---
            doc.fontSize(24).font('Helvetica-Bold').fillColor(primColor)
                .text('Primavera Events Group', { align: 'right' });

            doc.fontSize(10).font('Helvetica').fillColor(grayColor)
                .text('Renta de Mobiliario y Equipo', { align: 'right' });

            doc.moveDown(2);

            // --- ORDER INFO ---
            doc.fontSize(16).font('Helvetica-Bold').fillColor(textColor)
                .text(`Pedido de Renta: ${pedido.numeroPedido}`);

            doc.fontSize(10).font('Helvetica').fillColor(grayColor)
                .text(`Fecha de Emisión: ${new Date(pedido.createdAt).toLocaleDateString()}`)
                .text(`Status: ${pedido.status}`);

            doc.moveDown(1);

            // --- CLIENT INFO ---
            const startX = 50;
            let currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').fillColor(primColor).text('Datos del Cliente', startX, currentY);
            currentY += 15;
            doc.fontSize(10).font('Helvetica').fillColor(textColor)
                .text(`Nombre: ${pedido.clienteNombre}`, startX, currentY)
                .text(`Teléfono: ${pedido.clienteTelefono}`, startX, currentY + 15)
                .text(`Email: ${pedido.clienteEmail || 'N/A'}`, startX, currentY + 30);

            // --- LOGISTICS ---
            const col2X = 300;
            currentY -= 15; // Reset to top

            doc.fontSize(12).font('Helvetica-Bold').fillColor(primColor).text('Logística', col2X, currentY);
            currentY += 15;
            doc.fontSize(10).font('Helvetica').fillColor(textColor)
                .text(`Entrega: ${new Date(pedido.fechaEntrega).toLocaleDateString()} a las ${pedido.horaEntrega}`, col2X, currentY)
                .text(`Dirección: ${pedido.direccionEntrega}`, col2X, currentY + 15, { width: 250 })
                .text(`Recolección: ${new Date(pedido.fechaRecoleccion).toLocaleDateString()} a las ${pedido.horaRecoleccion}`, col2X, currentY + 45);

            doc.moveDown(5);

            // --- ITEMS TABLE ---
            const tableTop = doc.y;
            const itemX = 50;
            const qtyX = 350;
            const priceX = 400;
            const totalX = 480;

            doc.font('Helvetica-Bold').fontSize(10).fillColor(grayColor);
            doc.text('Concepto / Artículo', itemX, tableTop);
            doc.text('Cant.', qtyX, tableTop);
            doc.text('Precio U.', priceX, tableTop);
            doc.text('Importe', totalX, tableTop);

            doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            let y = tableTop + 25;
            doc.font('Helvetica').fillColor(textColor);

            pedido.items.forEach(item => {
                doc.text(item.descripcion, itemX, y);
                doc.text(item.cantidad.toString(), qtyX, y);
                doc.text(`$${item.precioUnitario.toFixed(2)}`, priceX, y);
                doc.text(`$${item.subtotal.toFixed(2)}`, totalX, y);
                y += 20;
            });

            doc.moveTo(itemX, y).lineTo(550, y).stroke();
            y += 15;

            // --- TOTALS ---
            doc.font('Helvetica-Bold');
            doc.text('Subtotal:', priceX - 20, y);
            doc.text(`$${Number(pedido.subtotal).toFixed(2)}`, totalX, y);
            y += 15;

            if (Number(pedido.descuento) > 0) {
                doc.fillColor('red');
                doc.text('Descuento:', priceX - 20, y);
                doc.text(`-$${Number(pedido.descuento).toFixed(2)}`, totalX, y);
                doc.fillColor(textColor);
                y += 15;
            }

            if (Number(pedido.costoFlete) > 0) {
                doc.text('Flete:', priceX - 20, y);
                doc.text(`$${Number(pedido.costoFlete).toFixed(2)}`, totalX, y);
                y += 15;
            }

            if (Number(pedido.iva) > 0) {
                doc.text('IVA (16%):', priceX - 20, y);
                doc.text(`$${Number(pedido.iva).toFixed(2)}`, totalX, y);
                y += 15;
            }

            doc.fontSize(12).fillColor(primColor);
            doc.text('TOTAL:', priceX - 20, y);
            doc.text(`$${Number(pedido.total).toFixed(2)}`, totalX, y);

            doc.moveDown(3);

            // --- FOOTER AND TERMS ---
            if (pedido.notas) {
                doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor).text('Observaciones:');
                doc.font('Helvetica').text(pedido.notas);
                doc.moveDown(2);
            }

            const pageHeight = doc.page.height;
            doc.fontSize(8).font('Helvetica-Oblique').fillColor(grayColor)
                .text('Términos y Condiciones: 1. El mobiliario se entrega en planta baja. Maniobras extra causan cargo. 2. Cualquier daño o pérdida será cobrado a precio de reposición.', 50, pageHeight - 80, { width: 500, align: 'center' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};
