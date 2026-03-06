import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { pedidosService } from '../services/pedidosService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/inventario/seed - Sembrar base base de datos en prod
router.post('/seed', async (req, res) => {
    try {
        const inventario = [
            // MESAS
            { nombre: "Mesa redonda", categoria: "Mesas", precioRenta: 80 },
            { nombre: "Mesa tablón", categoria: "Mesas", precioRenta: 70 },
            { nombre: "Mesa cuadrada de madera", categoria: "Mesas", precioRenta: 90 },
            { nombre: "Mesa rectangular tipo mármol", categoria: "Mesas", precioRenta: 120 },
            { nombre: "Mesa rectangular madera miel", categoria: "Mesas", precioRenta: 100 },
            { nombre: "Mesa rectangular madera nogal clásico", categoria: "Mesas", precioRenta: 100 },
            { nombre: "Mesa plegable cuadrada", categoria: "Mesas", precioRenta: 60 },
            { nombre: "Mesa infantil", categoria: "Mesas", precioRenta: 50 },
            { nombre: "Mesa madera blanca ceremonia", categoria: "Mesas", precioRenta: 90 },
            { nombre: "Periquera alta madera", categoria: "Mesas", precioRenta: 80 },
            { nombre: "Periquera alta metal", categoria: "Mesas", precioRenta: 80 },
            { nombre: "Mesa de centro", categoria: "Mesas", precioRenta: 70 },
            { nombre: "Sala lounge madera", categoria: "Mesas", precioRenta: 150 },
            // SILLAS Y BANCAS
            { nombre: "Silla Tiffany blanca", categoria: "Sillas", precioRenta: 25 },
            { nombre: "Silla Tiffany chocolate", categoria: "Sillas", precioRenta: 25 },
            { nombre: "Silla Tiffany blanca infantil", categoria: "Sillas", precioRenta: 20 },
            { nombre: "Silla Cross Back nogal", categoria: "Sillas", precioRenta: 35 },
            { nombre: "Silla Cross Back miel", categoria: "Sillas", precioRenta: 35 },
            { nombre: "Silla metálica Boss", categoria: "Sillas", precioRenta: 30 },
            { nombre: "Silla metálica Lotus", categoria: "Sillas", precioRenta: 30 },
            { nombre: "Banco log", categoria: "Sillas", precioRenta: 40 },
            // DECORACION Y CEREMONIA
            { nombre: "Letra gigante XV 1.10m", categoria: "Decoración", precioRenta: 300 },
            { nombre: "Letra gigante XV 1.80m", categoria: "Decoración", precioRenta: 450 },
            { nombre: "Corazón gigante", categoria: "Decoración", precioRenta: 350 },
            { nombre: "Cruz madera ceremonia", categoria: "Ceremonia", precioRenta: 150 },
            // MANTELERÍA
            { nombre: "Mantel blanco redondo", categoria: "Mantelería", precioRenta: 30 },
            { nombre: "Camino palo de rosa", categoria: "Mantelería", precioRenta: 15 },
        ];

        let createdCount = 0;
        let updatedCount = 0;

        for (const item of inventario) {
            const existingItem = await prisma.inventarioItem.findFirst({
                where: { nombre: item.nombre }
            });

            if (existingItem) {
                await prisma.inventarioItem.update({
                    where: { id: existingItem.id },
                    data: {
                        precioRenta: item.precioRenta,
                        categoria: item.categoria,
                        stockTotal: existingItem.stockTotal === 0 ? 50 : existingItem.stockTotal,
                        stockDisponible: existingItem.stockDisponible === 0 ? 50 : existingItem.stockDisponible,
                        unidad: "pieza"
                    }
                });
                updatedCount++;
            } else {
                await prisma.inventarioItem.create({
                    data: {
                        nombre: item.nombre,
                        categoria: item.categoria,
                        precioRenta: item.precioRenta,
                        stockTotal: 100,
                        stockDisponible: 100,
                        unidad: "pieza",
                        activo: true
                    }
                });
                createdCount++;
            }
        }
        res.json({ message: 'Inventario seeded successfully', created: createdCount, updated: updatedCount });
    } catch (error) {
        console.error('Error seeding inventario:', error);
        res.status(500).json({ error: 'Error seeding inventario' });
    }
});

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
