import { Router } from 'express';
import { pedidosService } from '../services/pedidosService';
import { generatePedidoPDF } from '../services/pdfPedidoService';

const router = Router();

// POST /api/pedidos - crear pedido
router.post('/', async (req, res) => {
    try {
        const pedido = await pedidosService.createPedido(req.body);
        res.status(201).json(pedido);
    } catch (error: any) {
        console.error('Error creating pedido:', error);
        res.status(400).json({ error: error.message || 'Error creating pedido' });
    }
});

// GET /api/pedidos - listar con filtros
router.get('/', async (req, res) => {
    try {
        const filters = req.query; // basic parsing, can be enhanced

        let prismaFilters: any = {};
        if (filters.status) prismaFilters.status = filters.status;
        if (filters.leadId) prismaFilters.leadId = filters.leadId;
        if (filters.cliente) {
            prismaFilters.clienteNombre = { contains: filters.cliente as string, mode: 'insensitive' };
        }

        const pedidos = await pedidosService.getAllPedidos(prismaFilters);
        res.json(pedidos);
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        res.status(500).json({ error: 'Error fetching pedidos' });
    }
});

// GET /api/pedidos/summary
router.get('/summary', async (req, res) => {
    try {
        const summary = await pedidosService.getPedidosSummary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching summary' });
    }
});

// GET /api/pedidos/:id - detalle completo
router.get('/:id', async (req, res) => {
    try {
        const pedido = await pedidosService.getPedido(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido not found' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pedido detail' });
    }
});

// PUT /api/pedidos/:id - actualizar
router.put('/:id', async (req, res) => {
    try {
        const pedido = await pedidosService.updatePedido(req.params.id, req.body);
        res.json(pedido);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error updating pedido' });
    }
});

// PATCH /api/pedidos/:id/status - cambiar estado
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const pedido = await pedidosService.updatePedidoStatus(req.params.id, status);
        res.json(pedido);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error updating status' });
    }
});

// DELETE /api/pedidos/:id - cancelar (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const pedido = await pedidosService.updatePedidoStatus(req.params.id, 'CANCELADO' as any);
        res.json({ message: 'Pedido cancelado', pedido });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error cancelling pedido' });
    }
});

// GET /api/pedidos/:id/pdf - generar y descargar PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const pedido = await pedidosService.getPedido(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido not found' });

        const pdfBuffer = await generatePedidoPDF(pedido as any);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${pedido.numeroPedido}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Error generating PDF' });
    }
});

// POST /api/pedidos/:id/share - generar link compartible
router.post('/:id/share', async (req, res) => {
    res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
