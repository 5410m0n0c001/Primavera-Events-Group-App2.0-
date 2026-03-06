import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { pedidosService } from '../services/pedidosService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/inventario/seed - Sembrar base base de datos en prod
router.post('/seed', async (req, res) => {
    try {
        const inventario = [
            // ESTRUCTURAS DE MESAS Y DESCANSO
            { nombre: "base de madera plegable para mesa", categoria: "Estructuras", precioRenta: 30 },
            { nombre: "cubo metálico base", categoria: "Estructuras", precioRenta: 40 },
            { nombre: "base metálica alta (centro de mesa)", categoria: "Estructuras", precioRenta: 50 },
            { nombre: "descanso metálico", categoria: "Estructuras", precioRenta: 25 },
            { nombre: "descansó de madera", categoria: "Estructuras", precioRenta: 35 },

            // MESAS
            { nombre: "mesa redonda", categoria: "Mesas", precioRenta: 80 },
            { nombre: "tablon", categoria: "Mesas", precioRenta: 70 },
            { nombre: "Mesa cuadrada de madera", categoria: "Mesas", precioRenta: 90 },
            { nombre: "Mesa rectangular tipo marmol", categoria: "Mesas", precioRenta: 120 },
            { nombre: "mesa rectangular de madera color miel", categoria: "Mesas", precioRenta: 100 },
            { nombre: "mesa rectangular de madera color nogal clasico", categoria: "Mesas", precioRenta: 100 },
            { nombre: "mesa plegable cuadrada", categoria: "Mesas", precioRenta: 60 },
            { nombre: "mesa infantil", categoria: "Mesas", precioRenta: 50 },
            { nombre: "mesa madera blanca ceremonia", categoria: "Ceremonia", precioRenta: 90 },
            { nombre: "mesa de centro", categoria: "Salas Lounge", precioRenta: 70 },

            // PERIQUERAS Y SALAS LOUNGE
            { nombre: "periquera alta madera", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "Periquera alta metal", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "Sala lounge madera", categoria: "Salas Lounge", precioRenta: 150 },
            { nombre: "banca larga sin respaldo", categoria: "Salas Lounge", precioRenta: 60 },
            { nombre: "banca larga con respaldo", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "banco individual con respaldo", categoria: "Salas Lounge", precioRenta: 45 },

            // SILLAS
            { nombre: "silla diana negra", categoria: "Sillas", precioRenta: 45 },
            { nombre: "Silla diana blanca", categoria: "Sillas", precioRenta: 45 },
            { nombre: "silla diana madera", categoria: "Sillas", precioRenta: 45 },
            { nombre: "silla versalles dorada", categoria: "Sillas", precioRenta: 40 },
            { nombre: "silla versalles plata", categoria: "Sillas", precioRenta: 40 },
            { nombre: "silla versalles blanca", categoria: "Sillas", precioRenta: 40 },
            { nombre: "silla versalles caoba", categoria: "Sillas", precioRenta: 40 },
            { nombre: "silla versalles transparente", categoria: "Sillas", precioRenta: 45 },
            { nombre: "silla romana", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla chavari Blanca", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla chavari dorada", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla tiffany laqueada blanca", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla tiffany dorada", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla tiffany chocolate", categoria: "Sillas", precioRenta: 35 },
            { nombre: "silla avant gaard blanca", categoria: "Sillas", precioRenta: 30 },
            { nombre: "silla Versalle baby", categoria: "Sillas Infantiles", precioRenta: 20 },
            { nombre: "silla tiffany baby", categoria: "Sillas Infantiles", precioRenta: 20 },
            { nombre: "silla cross back", categoria: "Sillas", precioRenta: 45 },
            { nombre: "silla cross back negra", categoria: "Sillas", precioRenta: 45 },
            { nombre: "silla Avant garde baby", categoria: "Sillas Infantiles", precioRenta: 20 },
            { nombre: "silla praga", categoria: "Sillas", precioRenta: 50 },
            { nombre: "silla medallon", categoria: "Sillas", precioRenta: 50 },

            // LOZA
            { nombre: "plato base concha dorado", categoria: "Loza", precioRenta: 18 },
            { nombre: "plato base talavera", categoria: "Loza", precioRenta: 18 },
            { nombre: "plato base cristal con OrIlla dorada", categoria: "Loza", precioRenta: 20 },
            { nombre: "plato base gotico rojo", categoria: "Loza", precioRenta: 20 },
            { nombre: "plato base ratan", categoria: "Loza", precioRenta: 15 },
            { nombre: "plato base gotico negro", categoria: "Loza", precioRenta: 20 },
            { nombre: "plato trinche blanco", categoria: "Loza", precioRenta: 10 },
            { nombre: "plato trinche cuadrado", categoria: "Loza", precioRenta: 12 },
            { nombre: "plato trinche tinto", categoria: "Loza", precioRenta: 12 },
            { nombre: "plato trinche color pastel", categoria: "Loza", precioRenta: 12 },
            { nombre: "plato trinche negro mate", categoria: "Loza", precioRenta: 12 },
            { nombre: "plato pozolero /sopera", categoria: "Loza", precioRenta: 10 },
            { nombre: "plato postre cuadradoblanco", categoria: "Loza", precioRenta: 8 },
            { nombre: "plato postro redondoblanco", categoria: "Loza", precioRenta: 8 },
            { nombre: "tazon para crema", categoria: "Loza", precioRenta: 8 },
            { nombre: "taza para cafe", categoria: "Loza", precioRenta: 8 },
            { nombre: "platones al centro", categoria: "Loza", precioRenta: 25 },

            // CUCHILLERIA
            { nombre: "cubierto dorado", categoria: "Cuchillería", precioRenta: 15 },
            { nombre: "cubierto silver", categoria: "Cuchillería", precioRenta: 10 },
            { nombre: "pinzas /cucharon", categoria: "Cuchillería", precioRenta: 10 },

            // CRISTALERIA
            { nombre: "vaso jaibolero/ agua", categoria: "Cristalería", precioRenta: 8 },
            { nombre: "copa flauta", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "copa globo", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "copa vino tinto", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "copa vino color ambar", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "copa vino color uva", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "copa vino tinto color azul", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "copa martinera", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "copa coñaquera", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "copa margarita", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "caballitos", categoria: "Cristalería", precioRenta: 6 },
            { nombre: "jarra cristalina", categoria: "Cristalería", precioRenta: 25 },

            // EQUIPO y ACCESORIOS
            { nombre: "hielera de mesa", categoria: "Equipo", precioRenta: 100 },
            { nombre: "hielera de pizo", categoria: "Equipo", precioRenta: 120 },
            { nombre: "hielera grande (cielo)", categoria: "Equipo", precioRenta: 150 },
            { nombre: "samover chico", categoria: "Equipo", precioRenta: 80 },
            { nombre: "samover mediano", categoria: "Equipo", precioRenta: 100 },
            { nombre: "samover grande", categoria: "Equipo", precioRenta: 150 },
            { nombre: "saleros / ceniceros", categoria: "Accesorios", precioRenta: 5 },
            { nombre: "charola mesero antideslizante redonda", categoria: "Accesorios", precioRenta: 30 },
            { nombre: "tortillero de peltre", categoria: "Accesorios", precioRenta: 15 },
            { nombre: "tortillero de palma", categoria: "Accesorios", precioRenta: 10 },
            { nombre: "panera de teka", categoria: "Accesorios", precioRenta: 25 },
            { nombre: "tabla pastel", categoria: "Accesorios", precioRenta: 50 },
            { nombre: "tabla de Quesos", categoria: "Accesorios", precioRenta: 40 },

            // MANTELERIA
            { nombre: "mantel blanco redondo", categoria: "Mantelería", precioRenta: 40 },
            { nombre: "tablero de madera y mantel rojo", categoria: "Mantelería", precioRenta: 60 },
            { nombre: "mantel vintage encaje", categoria: "Mantelería", precioRenta: 50 },
            { nombre: "faldón / bamabalina", categoria: "Mantelería", precioRenta: 35 },
            { nombre: "funda francesa", categoria: "Mantelería", precioRenta: 15 },
            { nombre: "cubre organza", categoria: "Mantelería", precioRenta: 25 },
            { nombre: "banda / moño", categoria: "Mantelería", precioRenta: 10 },
            { nombre: "servilleta tela", categoria: "Mantelería", precioRenta: 8 },
            { nombre: "servilleta de lino", categoria: "Mantelería", precioRenta: 12 },
            { nombre: "camino de color ( preguntar disponibilidad de color)", categoria: "Mantelería", precioRenta: 15 },

            // ESTRUCTURAS GIGANTES Y CARPAS
            { nombre: "sombrilla 3 metros", categoria: "Carpas", precioRenta: 300 },
            { nombre: "domo de 10x10 a 6 metros de atura", categoria: "Carpas", precioRenta: 4500 },
            { nombre: "Pista cristal (iluminada) (1.20x1.20)", categoria: "Pistas", precioRenta: 250 },
            { nombre: "pista pintada a Mano (1.20 x 1.20)", categoria: "Pistas", precioRenta: 200 },
            { nombre: "pista iluminada led pixel (1.20 x1.220)", categoria: "Pistas", precioRenta: 300 },
            { nombre: "Tarima basica de 10 / 15 y 30 cms alto (1.20*1.20)", categoria: "Pistas", precioRenta: 150 },
            { nombre: "Charolados (negro O Blanco) (1.20x1.20)", categoria: "Pistas", precioRenta: 180 },
            { nombre: "tapete pasto sintentico ( 2 x 10 metros)", categoria: "Decoración", precioRenta: 400 },
            { nombre: "Letras gigantes 1.20 metros Iluminadas", categoria: "Decoración", precioRenta: 600 },
            { nombre: "Letras gigantes 1.80 metros iluinadas", categoria: "Decoración", precioRenta: 900 },
            { nombre: "cabildo de ceremonia de madera", categoria: "Decoración", precioRenta: 400 },
            { nombre: "corazon gigante Iluminado (back fotos)", categoria: "Decoración", precioRenta: 700 },
            { nombre: "porterias 3x3 perimetrales (1 tramo )", categoria: "Estructuras Gigantes", precioRenta: 1500 },
            { nombre: "sillas principe O princesa (sillón) (por unidad o pieza)", categoria: "Decoración", precioRenta: 350 },
        ];

        let createdCount = 0;
        let updatedCount = 0;
        let deletedCount = 0;
        let deactivatedCount = 0;

        // Limpiar catálogo antiguo no coincidente
        const newNames = inventario.map(i => i.nombre);
        const oldItems = await prisma.inventarioItem.findMany({
            where: { nombre: { notIn: newNames } },
            include: { _count: { select: { pedidoItems: true } } }
        });

        for (const old of oldItems) {
            if (old._count.pedidoItems === 0) {
                await prisma.inventarioItem.delete({ where: { id: old.id } });
                deletedCount++;
            } else {
                await prisma.inventarioItem.update({ where: { id: old.id }, data: { activo: false } });
                deactivatedCount++;
            }
        }

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
        res.json({ message: 'Inventario seeded successfully', created: createdCount, updated: updatedCount, deleted: deletedCount, deactivated: deactivatedCount });
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
