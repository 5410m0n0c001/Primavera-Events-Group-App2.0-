import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    { nombre: "Banco metálico alto", categoria: "Sillas", precioRenta: 40 },
    { nombre: "Banco madera alto", categoria: "Sillas", precioRenta: 40 },
    { nombre: "Banco tejido plástico negro", categoria: "Sillas", precioRenta: 35 },
    { nombre: "Silla negra plegable", categoria: "Sillas", precioRenta: 15 },
    { nombre: "Sillón principal gris Oxford", categoria: "Sillas", precioRenta: 200 },
    { nombre: "Sillón principal palo de rosa", categoria: "Sillas", precioRenta: 200 },
    { nombre: "Sillón principal beige", categoria: "Sillas", precioRenta: 200 },
    { nombre: "Banca larga sin respaldo", categoria: "Sillas", precioRenta: 80 },
    { nombre: "Banca larga con respaldo", categoria: "Sillas", precioRenta: 90 },
    { nombre: "Banco individual puff", categoria: "Sillas", precioRenta: 50 },

    // DECORACIÓN Y CEREMONIA
    { nombre: "Letra gigante XV 1.10m", categoria: "Decoración", precioRenta: 300 },
    { nombre: "Letra gigante XV 1.80m", categoria: "Decoración", precioRenta: 450 },
    { nombre: "Letra gigante L", categoria: "Decoración", precioRenta: 200 },
    { nombre: "Letra gigante O", categoria: "Decoración", precioRenta: 200 },
    { nombre: "Letra gigante V", categoria: "Decoración", precioRenta: 200 },
    { nombre: "Letra gigante E", categoria: "Decoración", precioRenta: 200 },
    { nombre: "Corazón gigante", categoria: "Decoración", precioRenta: 350 },
    { nombre: "Alfombra roja", categoria: "Decoración", precioRenta: 150 },
    { nombre: "Portería metálica negra", categoria: "Decoración", precioRenta: 120 },
    { nombre: "Portería metálica dorada", categoria: "Decoración", precioRenta: 120 },
    { nombre: "Back redondo metálico", categoria: "Decoración", precioRenta: 250 },
    { nombre: "Caballete madera", categoria: "Decoración", precioRenta: 80 },
    { nombre: "Atril de madera", categoria: "Decoración", precioRenta: 100 },
    { nombre: "Reclinatorio", categoria: "Ceremonia", precioRenta: 120 },
    { nombre: "Cruz madera ceremonia", categoria: "Ceremonia", precioRenta: 150 },
    { nombre: "Banca para novios", categoria: "Ceremonia", precioRenta: 180 },
    { nombre: "Carrito de snacks", categoria: "Decoración", precioRenta: 200 },

    // LOZA
    { nombre: "Plato trinche 27cm", categoria: "Loza", precioRenta: 8 },
    { nombre: "Plato sopero negro", categoria: "Loza", precioRenta: 7 },
    { nombre: "Plato sopero redondo blanco", categoria: "Loza", precioRenta: 7 },
    { nombre: "Plato sopero cuadrado blanco", categoria: "Loza", precioRenta: 7 },
    { nombre: "Plato entremés blanco", categoria: "Loza", precioRenta: 6 },
    { nombre: "Plato postre", categoria: "Loza", precioRenta: 6 },
    { nombre: "Plato base romano", categoria: "Loza", precioRenta: 10 },
    { nombre: "Plato base vintage", categoria: "Loza", precioRenta: 10 },
    { nombre: "Plato base concha dorado", categoria: "Loza", precioRenta: 12 },
    { nombre: "Plato base chocolate", categoria: "Loza", precioRenta: 10 },
    { nombre: "Plato base gótico", categoria: "Loza", precioRenta: 10 },
    { nombre: "Plato base plateado", categoria: "Loza", precioRenta: 10 },

    // CRISTALERÍA
    { nombre: "Copa flauta", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa de agua transparente", categoria: "Cristalería", precioRenta: 7 },
    { nombre: "Copa de vino transparente", categoria: "Cristalería", precioRenta: 7 },
    { nombre: "Copa de vino ámbar", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa de vino uva", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa de vino verde olivo", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa de vino azul", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa de agua roja", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa agua romana", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Copa martinera", categoria: "Cristalería", precioRenta: 8 },
    { nombre: "Vaso cubero", categoria: "Cristalería", precioRenta: 5 },
    { nombre: "Vaso old fashion", categoria: "Cristalería", precioRenta: 5 },
    { nombre: "Tequilero", categoria: "Cristalería", precioRenta: 4 },

    // CUBERTERÍA
    { nombre: "Cuchara sopera plateada", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchara sopera dorada", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchara sopera gold rose", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchara sopera negra", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchillo plateado", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchillo dorado", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchillo gold rose", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Cuchillo negro", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Tenedor plateado carne", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Tenedor dorado carne", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Tenedor gold rose carne", categoria: "Cubertería", precioRenta: 4 },
    { nombre: "Tenedor negro carne", categoria: "Cubertería", precioRenta: 4 },

    // MANTELERÍA
    { nombre: "Mantel blanco cuadrado", categoria: "Mantelería", precioRenta: 30 },
    { nombre: "Mantel blanco redondo", categoria: "Mantelería", precioRenta: 30 },
    { nombre: "Mantel negro cuadrado", categoria: "Mantelería", precioRenta: 30 },
    { nombre: "Mantel blanco para tablón", categoria: "Mantelería", precioRenta: 35 },
    { nombre: "Camino champagne", categoria: "Mantelería", precioRenta: 15 },
    { nombre: "Camino dorado", categoria: "Mantelería", precioRenta: 15 },
    { nombre: "Camino palo de rosa", categoria: "Mantelería", precioRenta: 15 },
    { nombre: "Camino azul rey", categoria: "Mantelería", precioRenta: 15 },
];

async function main() {
    console.log('🌱 Iniciando Seed del Catálogo de Inventario...');

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of inventario) {
        const existingItem = await prisma.inventarioItem.findFirst({
            where: { nombre: item.nombre }
        });

        if (existingItem) {
            // Actualizar si el precio cambió o asegurar stock base.
            await prisma.inventarioItem.update({
                where: { id: existingItem.id },
                data: {
                    precioRenta: item.precioRenta,
                    categoria: item.categoria,
                    stockTotal: existingItem.stockTotal === 0 ? 50 : existingItem.stockTotal, // Arbitrary stock if zero
                    stockDisponible: existingItem.stockDisponible === 0 ? 50 : existingItem.stockDisponible,
                    unidad: "pieza"
                }
            });
            updatedCount++;
        } else {
            // Crear nuevo
            await prisma.inventarioItem.create({
                data: {
                    nombre: item.nombre,
                    categoria: item.categoria,
                    precioRenta: item.precioRenta,
                    stockTotal: 100, // Starting default stock
                    stockDisponible: 100,
                    unidad: "pieza",
                    activo: true
                }
            });
            console.log(`✅ Creado: ${item.nombre}`);
            createdCount++;
        }
    }

    console.log(`\n🎉 Seed terminado. Creados: ${createdCount}, Actualizados: ${updatedCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
