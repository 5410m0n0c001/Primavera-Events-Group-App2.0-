import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { pedidosService } from '../services/pedidosService';

const router = Router();
const prisma = new PrismaClient();

// GET /api/inventario - catálogo completo
router.get('/', async (req, res) => {
    try {
        const items = await prisma.inventarioItem.findMany({
            where: { activo: true },
            orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }]
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching inventario:', error);
        res.status(500).json({ error: 'Error fetching inventario' });
    }
});

// GET /api/inventario/:id/disponibilidad - stock disponible en fecha
router.get('/:id/disponibilidad', async (req, res) => {
    try {
        const { date, cantidad, omitirPedidoId } = req.query;
        if (!date) return res.status(400).json({ error: 'Date is required' });

        const qty = cantidad ? parseInt(cantidad as string, 10) : 1;
        const targetDate = new Date(date as string);

        const isAvailable = await pedidosService.checkDisponibilidad(
            req.params.id,
            targetDate,
            qty,
            omitirPedidoId as string
        );

        res.json({ id: req.params.id, date, requested: qty, available: isAvailable });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Error checking availability' });
    }
});

// PUT /api/inventario/:id - actualizar precio/stock (admin)
router.put('/:id', async (req, res) => {
    try {
        const { precioRenta, stockTotal, nombre, activo } = req.body;

        const data: any = {};
        if (precioRenta !== undefined) data.precioRenta = Number(precioRenta);
        if (stockTotal !== undefined) {
            data.stockTotal = Number(stockTotal);
            // Si cambian el total, asumimos que el disponible también cambia en la misma cantidad
            // (Para un control perfecto habría que cruzar con ocupados, esto es modo simple)
            const itemOriginal = await prisma.inventarioItem.findUnique({ where: { id: req.params.id } });
            if (itemOriginal) {
                const diff = Number(stockTotal) - itemOriginal.stockTotal;
                data.stockDisponible = itemOriginal.stockDisponible + diff;
            }
        }
        if (nombre !== undefined) data.nombre = nombre;
        if (activo !== undefined) data.activo = Boolean(activo);

        const updated = await prisma.inventarioItem.update({
            where: { id: req.params.id },
            data
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating inventario:', error);
        res.status(500).json({ error: 'Error updating item' });
    }
});

export default router;
