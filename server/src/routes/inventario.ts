import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { pedidosService } from '../services/pedidosService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/inventario/seed - Sembrar base base de datos en prod
router.post('/seed', async (req, res) => {
    try {
        const inventario = [
            { nombre: 'base de madera plegable para mesa', categoria: 'Estructuras', precioRenta: 30, unidad: 'pz' },
            { nombre: 'cubo metálico base', categoria: 'Estructuras', precioRenta: 40, unidad: 'pz' },
            { nombre: 'base metálica alta (centro de mesa)', categoria: 'Estructuras', precioRenta: 50, unidad: 'pz' },
            { nombre: 'descanso metálico', categoria: 'Estructuras', precioRenta: 25, unidad: 'pz' },
            { nombre: 'mesa redonda', categoria: 'Mobiliario', precioRenta: 80, unidad: 'pz' },
            { nombre: 'tablon', categoria: 'Mobiliario', precioRenta: 70, unidad: 'pz' },
            { nombre: 'Mesa cuadrada de madera', categoria: 'Mobiliario', precioRenta: 90, unidad: 'pz' },
            { nombre: 'Mesa rectangular tipo marmol', categoria: 'Mobiliario', precioRenta: 120, unidad: 'pz' },
            { nombre: 'mesa rectangular de madera color miel', categoria: 'Mobiliario', precioRenta: 100, unidad: 'pz' },
            { nombre: 'descansó de madera', categoria: 'Estructuras', precioRenta: 35, unidad: 'pz' },
            { nombre: 'mesa rectangular de madera color nogal clasico', categoria: 'Mobiliario', precioRenta: 100, unidad: 'pz' },
            { nombre: 'mesa plegable cuadrada', categoria: 'Mobiliario', precioRenta: 60, unidad: 'pz' },
            { nombre: 'mesa infantil', categoria: 'Mobiliario', precioRenta: 50, unidad: 'pz' },
            { nombre: 'mesa madera blanca ceremonia', categoria: 'Mobiliario', precioRenta: 90, unidad: 'pz' },
            { nombre: 'periquera alta madera', categoria: 'Mobiliario', precioRenta: 80, unidad: 'pz' },
            { nombre: 'Periquera alta metal', categoria: 'Mobiliario', precioRenta: 80, unidad: 'pz' },
            { nombre: 'Sala lounge madera', categoria: 'Mobiliario', precioRenta: 150, unidad: 'set' },
            { nombre: 'mesa de centro', categoria: 'Mobiliario', precioRenta: 70, unidad: 'pz' },
            { nombre: 'banca larga sin respaldo', categoria: 'Mobiliario', precioRenta: 60, unidad: 'pz' },
            { nombre: 'banca larga con respaldo', categoria: 'Mobiliario', precioRenta: 80, unidad: 'pz' },
            { nombre: 'banco individual puff', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'silla negra plegable', categoria: 'Mobiliario', precioRenta: 20, unidad: 'pz' },
            { nombre: 'silla Tiffany blanca', categoria: 'Mobiliario', precioRenta: 35, unidad: 'pz' },
            { nombre: 'silla tiffany chocolate', categoria: 'Mobiliario', precioRenta: 35, unidad: 'pz' },
            { nombre: 'silla tiffany blanca infantil', categoria: 'Mobiliario', precioRenta: 20, unidad: 'pz' },
            { nombre: 'silla cross back madera tono nogal', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'silla cross back madera tono miel', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'banco metálico alto', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'banco madera alto', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'silla metalica boss', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'silla metálica Lotus', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
            { nombre: 'Sillón principal gris Oxford', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
            { nombre: 'sillón principal palo de rosa (alita)', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
            { nombre: 'sillón principal beige', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
            { nombre: 'Sombrilla', categoria: 'Estructuras', precioRenta: 300, unidad: 'pz' },
            { nombre: 'pieza de templete de madera', categoria: 'Estructuras', precioRenta: 150, unidad: 'pz' },
            { nombre: 'caballete madera', categoria: 'Decoración', precioRenta: 100, unidad: 'pz' },
            { nombre: 'Atril de madera', categoria: 'Decoración', precioRenta: 100, unidad: 'pz' },
            { nombre: 'Reclinatorio', categoria: 'Decoración', precioRenta: 150, unidad: 'pz' },
            { nombre: 'Cuadro virgen maría', categoria: 'Decoración', precioRenta: 200, unidad: 'pz' },
            { nombre: 'Rueda madera para mesa de coctel', categoria: 'Mobiliario', precioRenta: 150, unidad: 'pz' },
            { nombre: 'unifila madera', categoria: 'Decoración', precioRenta: 50, unidad: 'pz' },
            { nombre: 'Rueda metálica con repisas de madera', categoria: 'Mobiliario', precioRenta: 200, unidad: 'pz' },
            { nombre: 'cojín para silla tiffany', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
            { nombre: 'cojín para silla lotus', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
            { nombre: 'cojín para silla boss', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Base metálica para mesa', categoria: 'Mobiliario', precioRenta: 40, unidad: 'pz' },
            { nombre: 'banco alto tejido plástico negro', categoria: 'Mobiliario', precioRenta: 50, unidad: 'pz' },
            { nombre: 'rack metálico para platos', categoria: 'Accesorios y Miscelánea', precioRenta: 100, unidad: 'pz' },
            { nombre: 'Letra gigante xv 1.10mt', categoria: 'Decoración Iluminada', precioRenta: 600, unidad: 'set' },
            { nombre: 'Letra gigante XV 1.80mt', categoria: 'Decoración Iluminada', precioRenta: 900, unidad: 'set' },
            { nombre: 'letra gigante L', categoria: 'Decoración Iluminada', precioRenta: 150, unidad: 'set' },
            { nombre: 'Letra gigante O', categoria: 'Decoración Iluminada', precioRenta: 150, unidad: 'set' },
            { nombre: 'Letra gigante V', categoria: 'Decoración Iluminada', precioRenta: 150, unidad: 'set' },
            { nombre: 'Letra gigante E', categoria: 'Decoración Iluminada', precioRenta: 150, unidad: 'set' },
            { nombre: 'Corazón gigante', categoria: 'Decoración Iluminada', precioRenta: 700, unidad: 'pz' },
            { nombre: 'Alfombra roja', categoria: 'Decoración', precioRenta: 300, unidad: 'pz' },
            { nombre: 'portería metálica negra', categoria: 'Estructuras', precioRenta: 1500, unidad: 'pz' },
            { nombre: 'Portería metálica dorada', categoria: 'Estructuras', precioRenta: 1500, unidad: 'pz' },
            { nombre: 'back redondo metálico', categoria: 'Estructuras', precioRenta: 800, unidad: 'pz' },
            { nombre: 'Carrito de snaks', categoria: 'Extras', precioRenta: 2500, unidad: 'pz' },
            { nombre: 'Tapa de carrito de snacks ( shots)', categoria: 'Extras', precioRenta: 500, unidad: 'pz' },
            { nombre: 'Tapa de carrito de snacks ( esquites)', categoria: 'Extras', precioRenta: 500, unidad: 'pz' },
            { nombre: 'Charola bar', categoria: 'Accesorios y Miscelánea', precioRenta: 30, unidad: 'pz' },
            { nombre: 'Charola grasa', categoria: 'Accesorios y Miscelánea', precioRenta: 30, unidad: 'pz' },
            { nombre: 'Plato trinche (27)', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Plato sopero negro', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Plato sopero redondo blanco', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Plato sopero cuadrado blanco', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Plato entremes blanco', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Plato postre', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
            { nombre: 'Plato base romano', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Plato base vintage', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Plato base concha dorado', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
            { nombre: 'Plato base chocolate', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Plato gotico', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Copa flauta', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Copa de agua trasparente', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Copa de vino trasparente', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Copa de vino ambar', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Copa de vino uva', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Copa de vino verde olivo', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Copa de vino azul', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Copa de agua roja', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Copa agua romana', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchara sopera plateada', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Cuchara sopera dorada', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchara sopera gold rose', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchara sopera negra', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Copa martinera', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Cuchillo plateado', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Cuchillo dorado', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchillo gold rose', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchillo negro', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Tenedor plateado carne', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Tenedor dorado ensalada', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Tenedor dorado carne', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Tenedor gold rose ensalada', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'cucharita plateada', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Cucharita dorada', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cucharita gold rose', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cucharita negra', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Tenedor plateado ensalada', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Tenedor gold rose carne', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Tenedor negro carne', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Tenedor negro ensalada', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
            { nombre: 'Vaso cubero', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
            { nombre: 'Vaso old fashion', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
            { nombre: 'Tequilero', categoria: 'Loza y Cristalería', precioRenta: 6, unidad: 'pz' },
            { nombre: 'Ceniceros', categoria: 'Accesorios y Miscelánea', precioRenta: 5, unidad: 'pz' },
            { nombre: 'garrafón de plástico 19 lts', categoria: 'Accesorios y Miscelánea', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Tablas para pan (madera)', categoria: 'Accesorios y Miscelánea', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Plato base plateado', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'plato base tipo espiral', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Plato base cristal aperlado', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Numeros para mesa en madera', categoria: 'Mobiliario', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Números de mesa acrílico', categoria: 'Mobiliario', precioRenta: 20, unidad: 'pz' },
            { nombre: 'base metálica para numeración de mesas', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Pinzas para hielo', categoria: 'Accesorios y Miscelánea', precioRenta: 10, unidad: 'pz' },
            { nombre: 'Hielera metálica pequeña', categoria: 'Accesorios y Miscelánea', precioRenta: 100, unidad: 'pz' },
            { nombre: 'Matel blanco cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel blanco redondo', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel negro cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel Caki cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel azul marino cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel arena cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel chocolate cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Mantel blanco para tablón', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
            { nombre: 'Bambalinas negras para tablón', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
            { nombre: 'Bambalina negra para tablón', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
            { nombre: 'Cubre mantel dorado', categoria: 'Mantelería', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Cubre mantel palo de rosa', categoria: 'Mantelería', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Cubre mantel rojo', categoria: 'Mantelería', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Cubre mantel verde', categoria: 'Mantelería', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Cubre mantel amarillo', categoria: 'Mantelería', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Camino champange', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino dorado', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino verde olivo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino azul rey', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino azul marino', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino azul cielo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino Azul Turquesa', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino palo de rosa', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino rosa baby', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Caminos Rosa blush', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino rosa brillante', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino fiuxa', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino Corrugado Ivory', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino verde bandera', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino shedron', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino beige', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino rojo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino negro', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino caki', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino chocolate', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino arena', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino Durazno', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino lila', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino verde navidad', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino morado', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino salmón', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino mexicano', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Camino corrugado verde olivo', categoria: 'Mantelería', precioRenta: 18, unidad: 'pz' },
            { nombre: 'Camino hueso', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Jarra de plástico', categoria: 'Accesorios y Miscelánea', precioRenta: 25, unidad: 'pz' },
            { nombre: 'Tarja para hielo', categoria: 'Accesorios y Miscelánea', precioRenta: 150, unidad: 'pz' },
            { nombre: 'Pica hielo', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Licuadora', categoria: 'Accesorios y Miscelánea', precioRenta: 200, unidad: 'pz' },
            { nombre: 'Vitrolero de plástico grande', categoria: 'Accesorios y Miscelánea', precioRenta: 80, unidad: 'pz' },
            { nombre: 'Vitrolero de cristal pequeño', categoria: 'Accesorios y Miscelánea', precioRenta: 50, unidad: 'pz' },
            { nombre: 'Exprimidor de limon', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Cuchillos', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
            { nombre: 'Salsero', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Tortillero', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
            { nombre: 'Banca para novios', categoria: 'Mobiliario', precioRenta: 200, unidad: 'pz' },
            { nombre: 'Mantel blanco tipo macrame', categoria: 'Mantelería', precioRenta: 60, unidad: 'pz' },
            { nombre: 'cruz madera para ceremonia', categoria: 'Decoración', precioRenta: 350, unidad: 'pz' }
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
