import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const inventario = [
    { nombre: 'base de madera plegable para mesa', categoria: 'Mobiliario', precioRenta: 20, unidad: 'pz' },
    { nombre: 'cubo metálico base', categoria: 'Mobiliario', precioRenta: 25, unidad: 'pz' },
    { nombre: 'base metálica alta (centro de mesa)', categoria: 'Mobiliario', precioRenta: 30, unidad: 'pz' },
    { nombre: 'descanso metálico', categoria: 'Mobiliario', precioRenta: 15, unidad: 'pz' },
    { nombre: 'mesa redonda', categoria: 'Mobiliario', precioRenta: 80, unidad: 'pz' },
    { nombre: 'tablon', categoria: 'Mobiliario', precioRenta: 60, unidad: 'pz' },
    { nombre: 'Mesa cuadrada de madera', categoria: 'Mobiliario', precioRenta: 120, unidad: 'pz' },
    { nombre: 'Mesa rectangular tipo marmol', categoria: 'Mobiliario', precioRenta: 150, unidad: 'pz' },
    { nombre: 'mesa rectangular de madera color miel', categoria: 'Mobiliario', precioRenta: 130, unidad: 'pz' },
    { nombre: 'descansó de madera', categoria: 'Mobiliario', precioRenta: 20, unidad: 'pz' },
    { nombre: 'mesa rectangular de madera color nogal clasico', categoria: 'Mobiliario', precioRenta: 130, unidad: 'pz' },
    { nombre: 'mesa plegable cuadrada', categoria: 'Mobiliario', precioRenta: 50, unidad: 'pz' },
    { nombre: 'mesa infantil', categoria: 'Mobiliario', precioRenta: 40, unidad: 'pz' },
    { nombre: 'mesa madera blanca ceremonia', categoria: 'Mobiliario', precioRenta: 200, unidad: 'pz' },
    { nombre: 'periquera alta madera', categoria: 'Mobiliario', precioRenta: 180, unidad: 'pz' },
    { nombre: 'Periquera alta metal', categoria: 'Mobiliario', precioRenta: 160, unidad: 'pz' },
    { nombre: 'Sala lounge madera', categoria: 'Mobiliario', precioRenta: 450, unidad: 'pz' },
    { nombre: 'mesa de centro', categoria: 'Mobiliario', precioRenta: 100, unidad: 'pz' },
    { nombre: 'banca larga sin respaldo', categoria: 'Mobiliario', precioRenta: 70, unidad: 'pz' },
    { nombre: 'banca larga con respaldo', categoria: 'Mobiliario', precioRenta: 90, unidad: 'pz' },
    { nombre: 'banco individual puff', categoria: 'Mobiliario', precioRenta: 35, unidad: 'pz' },
    { nombre: 'silla negra plegable', categoria: 'Mobiliario', precioRenta: 15, unidad: 'pz' },
    { nombre: 'silla Tiffany blanca', categoria: 'Mobiliario', precioRenta: 28, unidad: 'pz' },
    { nombre: 'silla tiffany chocolate', categoria: 'Mobiliario', precioRenta: 28, unidad: 'pz' },
    { nombre: 'silla tiffany blanca infantil', categoria: 'Mobiliario', precioRenta: 25, unidad: 'pz' },
    { nombre: 'silla cross back madera tono nogal', categoria: 'Mobiliario', precioRenta: 65, unidad: 'pz' },
    { nombre: 'silla cross back madera tono miel', categoria: 'Mobiliario', precioRenta: 65, unidad: 'pz' },
    { nombre: 'banco metálico alto', categoria: 'Mobiliario', precioRenta: 45, unidad: 'pz' },
    { nombre: 'banco madera alto', categoria: 'Mobiliario', precioRenta: 55, unidad: 'pz' },
    { nombre: 'silla metalica boss', categoria: 'Mobiliario', precioRenta: 50, unidad: 'pz' },
    { nombre: 'silla metálica Lotus', categoria: 'Mobiliario', precioRenta: 50, unidad: 'pz' },
    { nombre: 'Sillón principal gris Oxford', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
    { nombre: 'sillón principal palo de rosa (alita)', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
    { nombre: 'sillón principal beige', categoria: 'Mobiliario', precioRenta: 300, unidad: 'pz' },
    { nombre: 'Sombrilla', categoria: 'Mobiliario', precioRenta: 150, unidad: 'pz' },
    { nombre: 'pieza de templete de madera', categoria: 'Estructuras', precioRenta: 200, unidad: 'pz' },
    { nombre: 'caballete madera', categoria: 'Decoración', precioRenta: 80, unidad: 'pz' },
    { nombre: 'Atril de madera', categoria: 'Decoración', precioRenta: 120, unidad: 'pz' },
    { nombre: 'Reclinatorio', categoria: 'Decoración', precioRenta: 150, unidad: 'pz' },
    { nombre: 'Cuadro virgen maría', categoria: 'Decoración', precioRenta: 200, unidad: 'pz' },
    { nombre: 'Rueda madera para mesa de coctel', categoria: 'Mobiliario', precioRenta: 40, unidad: 'pz' },
    { nombre: 'unifila madera', categoria: 'Mobiliario', precioRenta: 60, unidad: 'pz' },
    { nombre: 'Rueda metálica con repisas de madera', categoria: 'Mobiliario', precioRenta: 180, unidad: 'pz' },
    { nombre: 'rack metálico para platos', categoria: 'Accesorios y Miscelánea', precioRenta: 120, unidad: 'pz' },
    { nombre: 'carrito snacks', categoria: 'Mobiliario', precioRenta: 500, unidad: 'pz' },
    { nombre: 'tapa carrito de snacks(shots)', categoria: 'Mobiliario', precioRenta: 100, unidad: 'pz' },
    { nombre: 'tapa de carrito snacks( esquites)', categoria: 'Mobiliario', precioRenta: 100, unidad: 'pz' },
    { nombre: 'back redondo metálico', categoria: 'Estructuras', precioRenta: 400, unidad: 'pz' },
    { nombre: 'portería metálica negra', categoria: 'Estructuras', precioRenta: 350, unidad: 'pz' },
    { nombre: 'portería metálica dorada', categoria: 'Estructuras', precioRenta: 450, unidad: 'pz' },
    { nombre: 'alfombra roja', categoria: 'Decoración', precioRenta: 300, unidad: 'pz' },
    { nombre: 'letra gigante XV 1.10 mt', categoria: 'Estructuras', precioRenta: 600, unidad: 'pz' },
    { nombre: 'letra gigante XV 1.80 mt', categoria: 'Estructuras', precioRenta: 900, unidad: 'pz' },
    { nombre: 'letra gigante L', categoria: 'Estructuras', precioRenta: 300, unidad: 'pz' },
    { nombre: 'letra gigante O', categoria: 'Estructuras', precioRenta: 300, unidad: 'pz' },
    { nombre: 'letra gigante V', categoria: 'Estructuras', precioRenta: 300, unidad: 'pz' },
    { nombre: 'letra gigante E', categoria: 'Estructuras', precioRenta: 300, unidad: 'pz' },
    { nombre: 'corazon gigante', categoria: 'Estructuras', precioRenta: 400, unidad: 'pz' },
    { nombre: 'banco alto tejido plástico negro', categoria: 'Mobiliario', precioRenta: 65, unidad: 'pz' },
    { nombre: 'cojín para silla tiffany', categoria: 'Mobiliario', precioRenta: 8, unidad: 'pz' },
    { nombre: 'cojín para silla lotus', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
    { nombre: 'cojín para silla boss', categoria: 'Mobiliario', precioRenta: 10, unidad: 'pz' },
    { nombre: 'números para mesa en madera', categoria: 'Decoración', precioRenta: 15, unidad: 'pz' },
    { nombre: 'números de mesa acrilicos', categoria: 'Decoración', precioRenta: 20, unidad: 'pz' },
    { nombre: 'base metalica para mesas', categoria: 'Mobiliario', precioRenta: 25, unidad: 'pz' },
    { nombre: 'base metálica para numeración de mesas', categoria: 'Decoración', precioRenta: 10, unidad: 'pz' },
    { nombre: 'ceniceros', categoria: 'Accesorios y Miscelánea', precioRenta: 5, unidad: 'pz' },
    { nombre: 'plato trinche 27 cm', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'plato sopero negro', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'plato sopero redondo blanco', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'plato sopero cuadrado blanco', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'plato entremés blanco', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'plato postre', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'plato base romano', categoria: 'Loza y Cristalería', precioRenta: 25, unidad: 'pz' },
    { nombre: 'plato base vintage', categoria: 'Loza y Cristalería', precioRenta: 30, unidad: 'pz' },
    { nombre: 'plato base concha dorado', categoria: 'Loza y Cristalería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'plato dase chocolate', categoria: 'Loza y Cristalería', precioRenta: 25, unidad: 'pz' },
    { nombre: 'plato gotico', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
    { nombre: 'plato base plateado', categoria: 'Loza y Cristalería', precioRenta: 25, unidad: 'pz' },
    { nombre: 'plato base tipo espiral', categoria: 'Loza y Cristalería', precioRenta: 25, unidad: 'pz' },
    { nombre: 'plato base cristal aperlado', categoria: 'Loza y Cristalería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'copa flauta', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'copa de agua transparente', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'copa de vino transparente', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'copa de vino ambar', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'copa de vino uva', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'copa de vino verde olivo', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'copa de vino azul', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'copa de agua roja', categoria: 'Loza y Cristalería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'copa agua romana', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
    { nombre: 'vaso cubero', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'vaso old fashion', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'tequilero', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
    { nombre: 'copa martinera', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
    { nombre: 'cuchara sopera plateada', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
    { nombre: 'cuchara sopera dorada', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'cuchara sopera gold rose', categoria: 'Loza y Cristalería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'cuchara sopera negra', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'cuchillo plateado', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'cuchillo dorado', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'cuchillo gold rose', categoria: 'Loza y Cristalería', precioRenta: 16, unidad: 'pz' },
    { nombre: 'cuchillo negro', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'cucharita plateada', categoria: 'Loza y Cristalería', precioRenta: 6, unidad: 'pz' },
    { nombre: 'cucharita dorada', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'cucharita gold rose', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'Cucharita negra', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'tenedor plateado carne', categoria: 'Loza y Cristalería', precioRenta: 10, unidad: 'pz' },
    { nombre: 'tenedor plateado ensalada', categoria: 'Loza y Cristalería', precioRenta: 8, unidad: 'pz' },
    { nombre: 'tenedor dorado ensalada', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'tenedor dorado carne', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'tenedor gold rose ensalada', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'tenedor gold rose carne', categoria: 'Loza y Cristalería', precioRenta: 16, unidad: 'pz' },
    { nombre: 'tenedor negro carne', categoria: 'Loza y Cristalería', precioRenta: 14, unidad: 'pz' },
    { nombre: 'tenedor negro ensalada', categoria: 'Loza y Cristalería', precioRenta: 12, unidad: 'pz' },
    { nombre: 'Mantel negro cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'Mantel caqui cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'Mantel azúl marino cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'Mantel arena cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'Mantel chocolate cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'Mantel blanco cuadrado', categoria: 'Mantelería', precioRenta: 40, unidad: 'pz' },
    { nombre: 'mantel blanco redondo', categoria: 'Mantelería', precioRenta: 45, unidad: 'pz' },
    { nombre: 'Mantel blanco para tablon', categoria: 'Mantelería', precioRenta: 45, unidad: 'pz' },
    { nombre: 'Bambalinas negras para tablon', categoria: 'Mantelería', precioRenta: 60, unidad: 'pz' },
    { nombre: 'Cubre mantel dorado', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'Cubre mantel palo de rosa', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'Cubre mantel rojo', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'Cubre mantel verde', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'Cubre mantel amarillo', categoria: 'Mantelería', precioRenta: 35, unidad: 'pz' },
    { nombre: 'Camino champagne', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino dorado', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino verde olivo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino azul rey', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino azul marino', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino azul cielo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino acul turqueza', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino palo de rosa', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino rosa baby', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino rosa blusa', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino rosa brillante', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino fuxia', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino corrugado ivory', categoria: 'Mantelería', precioRenta: 18, unidad: 'pz' },
    { nombre: 'Camino verde bandera', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino shedron', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino beige', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino rojo', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino negro', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino caqui', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino chocolate', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino arena', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Camino durazno', categoria: 'Mantelería', precioRenta: 15, unidad: 'pz' },
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
    { nombre: 'Cuchillos (cocina)', categoria: 'Loza y Cristalería', precioRenta: 20, unidad: 'pz' },
    { nombre: 'Salsero', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Tortillero', categoria: 'Accesorios y Miscelánea', precioRenta: 15, unidad: 'pz' },
    { nombre: 'Banca para novios', categoria: 'Mobiliario', precioRenta: 200, unidad: 'pz' },
    { nombre: 'Mantel blanco tipo macrame', categoria: 'Mantelería', precioRenta: 60, unidad: 'pz' },
    { nombre: 'cruz madera para ceremonia', categoria: 'Decoración', precioRenta: 350, unidad: 'pz' }
];

async function main() {
    console.log('Iniciando carga de inventario maestro de rentas...');
    let totalAdded = 0;
    let totalUpdated = 0;

    for (const item of inventario) {
        const existing = await prisma.inventarioItem.findFirst({
            where: { nombre: item.nombre }
        });

        if (existing) {
            await prisma.inventarioItem.update({
                where: { id: existing.id },
                data: {
                    precioRenta: item.precioRenta,
                    activo: true,
                    categoria: item.categoria,
                    stockTotal: existing.stockTotal === 0 ? 100 : existing.stockTotal,
                    stockDisponible: existing.stockDisponible === 0 ? 100 : existing.stockDisponible
                }
            });
            totalUpdated++;
        } else {
            await prisma.inventarioItem.create({
                data: {
                    nombre: item.nombre,
                    categoria: item.categoria,
                    precioRenta: item.precioRenta,
                    stockTotal: 100,
                    stockDisponible: 100,
                    unidad: 'pieza',
                    activo: true
                }
            });
            totalAdded++;
        }
    }

    console.log(`Carga de Módulo Rentas completa! Se agregaron ${totalAdded} artículos y actualizaron ${totalUpdated}.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
