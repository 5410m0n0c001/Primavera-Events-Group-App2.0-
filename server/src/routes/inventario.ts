import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { pedidosService } from '../services/pedidosService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/inventario/seed - Sembrar base base de datos en prod
router.post('/seed', async (req, res) => {
    try {
        const inventario = [
            // SILLAS (Nogal, Miel, Cross, Tiffany, etc)
            { nombre: "Silla cross back miel", categoria: "Sillas", precioRenta: 45 },
            { nombre: "Silla cross back nogal", categoria: "Sillas", precioRenta: 45 },
            { nombre: "Silla tiffany laqueada blanca", categoria: "Sillas", precioRenta: 35 },
            { nombre: "Silla tiffany dorada", categoria: "Sillas", precioRenta: 35 },
            { nombre: "Silla tiffany plateada", categoria: "Sillas", precioRenta: 35 },
            { nombre: "Silla versalles caoba", categoria: "Sillas", precioRenta: 40 },
            { nombre: "Silla diana madera", categoria: "Sillas", precioRenta: 45 },
            { nombre: "Silla praga", categoria: "Sillas", precioRenta: 50 },
            { nombre: "Silla acojinada cromada", categoria: "Sillas", precioRenta: 20 },
            { nombre: "Silla acojinada esmaltada", categoria: "Sillas", precioRenta: 18 },
            { nombre: "Silla de adulto plastico sin funda", categoria: "Sillas", precioRenta: 12 },
            { nombre: "Silla infantil plastica", categoria: "Sillas", precioRenta: 10 },
            { nombre: "Funda francesa blanca o negra (silla plastico)", categoria: "Blancos Plástico", precioRenta: 10 },
            { nombre: "Cinta tornasol o de color", categoria: "Blancos Plástico", precioRenta: 5 },
            // MESAS (Redondas, rectangulares, tablones, etc)
            { nombre: "Mesa redonda (10 personas)", categoria: "Mesas", precioRenta: 80 },
            { nombre: "Tablón", categoria: "Mesas", precioRenta: 70 },
            { nombre: "Mesa cuadrada de madera", categoria: "Mesas", precioRenta: 90 },
            { nombre: "Mesa rectangular tipo mármol", categoria: "Mesas", precioRenta: 120 },
            { nombre: "Mesa rectangular de madera color miel", categoria: "Mesas", precioRenta: 100 },
            { nombre: "Mesa rectangular de madera color nogal clásico", categoria: "Mesas", precioRenta: 100 },
            { nombre: "Mesa plegable cuadrada", categoria: "Mesas", precioRenta: 60 },
            { nombre: "Mesa infantil", categoria: "Mesas", precioRenta: 50 },
            { nombre: "Mesa madera blanca ceremonia", categoria: "Ceremonia", precioRenta: 90 },
            // PERIQUERAS Y SALAS LOUNGE
            { nombre: "Periquera alta madera", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "Periquera alta metal", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "Sala lounge madera", categoria: "Salas Lounge", precioRenta: 150 },
            { nombre: "Banca larga sintética plegable de exterior", categoria: "Salas Lounge", precioRenta: 60 },
            { nombre: "Mesa de centro", categoria: "Salas Lounge", precioRenta: 70 },
            { nombre: "Banca larga con respaldo", categoria: "Salas Lounge", precioRenta: 80 },
            { nombre: "Banca larga sin respaldo", categoria: "Salas Lounge", precioRenta: 60 },
            { nombre: "Banco log", categoria: "Salas Lounge", precioRenta: 40 },
            { nombre: "Banco indivi", categoria: "Salas Lounge", precioRenta: 35 },
            { nombre: "Banco periquero de madera respaldo caoba o nogal", categoria: "Salas Lounge", precioRenta: 45 },
            // ESTRUCTURAS DE MESAS Y DESCANSO
            { nombre: "Base de madera plegable para mesa", categoria: "Estructuras", precioRenta: 30 },
            { nombre: "Cubo metálico base", categoria: "Estructuras", precioRenta: 40 },
            { nombre: "Base metálica alta (centro de mesa)", categoria: "Estructuras", precioRenta: 50 },
            { nombre: "Descanso metálico", categoria: "Estructuras", precioRenta: 25 },
            { nombre: "Descanso de madera", categoria: "Estructuras", precioRenta: 35 },
            // CRISTALERIA COPA Y VASO
            { nombre: "Copa globo", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "Copa flauta", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "Copa vino tinto", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "Copa vino blanco", categoria: "Cristalería", precioRenta: 12 },
            { nombre: "Copa de color azul", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "Copa vino ámbar", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "Copa vino rosa", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "Copa vino verde", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "Copa vino uva", categoria: "Cristalería", precioRenta: 15 },
            { nombre: "Vaso high ball", categoria: "Cristalería", precioRenta: 8 },
            { nombre: "Vaso cacharrero", categoria: "Cristalería", precioRenta: 8 },
            { nombre: "Vaso old fashion", categoria: "Cristalería", precioRenta: 10 },
            { nombre: "Caballito tequilero", categoria: "Cristalería", precioRenta: 6 },
            // LOZA Y PLAQUÉ
            { nombre: "Platón blanco o de barro", categoria: "Loza", precioRenta: 20 },
            { nombre: "Platón para botana o centro", categoria: "Loza", precioRenta: 25 },
            { nombre: "Plato base de concha dorado", categoria: "Loza", precioRenta: 18 },
            { nombre: "Plato base talavera", categoria: "Loza", precioRenta: 18 },
            { nombre: "Plato base gótico negro", categoria: "Loza", precioRenta: 20 },
            { nombre: "Plato base de mimbre", categoria: "Loza", precioRenta: 15 },
            { nombre: "Plato base de acero inoxidable", categoria: "Loza", precioRenta: 22 },
            { nombre: "Plato trinche cuadrado", categoria: "Loza", precioRenta: 12 },
            { nombre: "Plato trinche redondo", categoria: "Loza", precioRenta: 10 },
            { nombre: "Plato sopero o medio", categoria: "Loza", precioRenta: 10 },
            { nombre: "Plato tazón consome", categoria: "Loza", precioRenta: 12 },
            { nombre: "Plato pastelero cuadrado", categoria: "Loza", precioRenta: 10 },
            { nombre: "Plato pastelero redondo", categoria: "Loza", precioRenta: 8 },
            { nombre: "Plato para taza", categoria: "Loza", precioRenta: 6 },
            { nombre: "Taza cafetera o para crema", categoria: "Loza", precioRenta: 8 },
            { nombre: "Azucareras chicas", categoria: "Loza", precioRenta: 12 },
            { nombre: "Ceniceros", categoria: "Loza", precioRenta: 10 },
            { nombre: "Salseras", categoria: "Loza", precioRenta: 8 },
            { nombre: "Saleros", categoria: "Loza", precioRenta: 5 },
            { nombre: "Panera de lujo canasta forrada", categoria: "Loza", precioRenta: 25 },
            // CUCHILES Y TENEDORERÍA
            { nombre: "Trinche para carne ensalada", categoria: "Cuchillería", precioRenta: 8 },
            { nombre: "Trinche de bambú para carne o ensalada", categoria: "Cuchillería", precioRenta: 12 },
            { nombre: "Trinche dorado acero para carne o ensalada", categoria: "Cuchillería", precioRenta: 15 },
            { nombre: "Cuchara sopera", categoria: "Cuchillería", precioRenta: 8 },
            { nombre: "Cuchara sopera dorada", categoria: "Cuchillería", precioRenta: 15 },
            { nombre: "Cuchara cafetera o pastelera", categoria: "Cuchillería", precioRenta: 6 },
            { nombre: "Cuchara cafetera o pastelera plata de ley", categoria: "Cuchillería", precioRenta: 12 },
            { nombre: "Cuchillo plano carnicero", categoria: "Cuchillería", precioRenta: 8 },
            { nombre: "Cuchillo de bambú carnicero", categoria: "Cuchillería", precioRenta: 12 },
            { nombre: "Cuchillo dorado de acero inox carnicero", categoria: "Cuchillería", precioRenta: 15 },
            { nombre: "Cuchillo para mantequilla y pan", categoria: "Cuchillería", precioRenta: 6 },
            // MANTELERÍA
            { nombre: "Mantel blanco redondo", categoria: "Mantelería", precioRenta: 40 },
            { nombre: "Cubre mantel de color o estampado organza u otro", categoria: "Mantelería", precioRenta: 25 },
            { nombre: "Faldón o bambalina de color", categoria: "Mantelería", precioRenta: 35 },
            { nombre: "Bambalina tergal blanco, tablón rectangular", categoria: "Mantelería", precioRenta: 30 },
            { nombre: "Bambalina plizada 1 metro mesa novios, principal, regalo cristal, oval", categoria: "Mantelería", precioRenta: 40 },
            { nombre: "Mantel camino rectangular o cuadrado", categoria: "Mantelería", precioRenta: 20 },
            { nombre: "Mantel de encaje redondo o rectangular o cuadrado estilo vintage", categoria: "Mantelería", precioRenta: 50 },
            { nombre: "Servilleta de tela varios colores o blanca", categoria: "Mantelería", precioRenta: 8 },
            // CAMINOS
            { nombre: "Camino azul rey", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino azul plumbago", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino azul marino", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino azul marino satín", categoria: "Mantelería: Caminos Color", precioRenta: 18 },
            { nombre: "Camino azul cielo", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino azul turquesa", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino verde jade", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino verde bandera", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino verde manzana", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino verde agua o menta", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino amarillo canario", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino rosa palo", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino rosa fucsia o mexicano", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino rojo tinto", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino rojo pasión", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino dorado u oro", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino beige/arena/hueso/camel", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino café con leche / chocolate", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino gris mate / plata", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino lila / morado / uva", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino negro", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            { nombre: "Camino naranja mate", categoria: "Mantelería: Caminos Color", precioRenta: 15 },
            // ADICIONALES (DECORACION LUMINOSA Y CEREMONIA)
            { nombre: "Sillón princesa", categoria: "Decoración", precioRenta: 350 },
            { nombre: "Cabildo madera ceremonia", categoria: "Decoración", precioRenta: 400 },
            { nombre: "Reclinatorio blanco ceremonial", categoria: "Decoración", precioRenta: 150 },
            { nombre: "Letras gigantes XV 1.10m", categoria: "Decoración Iluminada", precioRenta: 600 },
            { nombre: "Letras gigantes VX 1.80m", categoria: "Decoración Iluminada", precioRenta: 900 },
            { nombre: "Corazón gigante", categoria: "Decoración Iluminada", precioRenta: 700 },
            { nombre: "Portería perimetral de 3x3x2.5", categoria: "Estructuras Gigantes", precioRenta: 1500 },
            { nombre: "Poste extra portería", categoria: "Estructuras Gigantes", precioRenta: 200 },
            { nombre: "Sombrillas 3m", categoria: "Estructuras Gigantes", precioRenta: 300 },
            // SERVICIO DE BANQUETERÍA O RESTAURANT
            { nombre: "Pérgolas un toldo sin carpa con cortinas", categoria: "Estructuras Gigantes", precioRenta: 2500 },
            { nombre: "Hielera mediana", categoria: "Equipo y Accesorios", precioRenta: 100 },
            { nombre: "Hielera redonda blanca grande", categoria: "Equipo y Accesorios", precioRenta: 150 },
            { nombre: "Pinzas para hielo acero", categoria: "Equipo y Accesorios", precioRenta: 15 },
            { nombre: "Charola de servicio antideslizante", categoria: "Equipo y Accesorios", precioRenta: 30 },
            { nombre: "Jarra cristalina de mesa", categoria: "Equipo y Accesorios", precioRenta: 25 },
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
