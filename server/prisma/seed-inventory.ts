import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalogData = [
    {
        category: "🪑 MOBILIARIO",
        subcategories: [
            {
                name: "Mesas",
                items: [
                    "Mesa redonda", "Tablón", "Mesa cuadrada de madera", "Mesa rectangular tipo mármol",
                    "Mesa rectangular de madera color miel", "Mesa rectangular de madera color nogal clásico",
                    "Mesa plegable cuadrada", "Mesa infantil", "Mesa madera blanca ceremonia", "Mesa de centro"
                ]
            },
            {
                name: "Bases y Soportes para Mesa",
                items: [
                    "Base de madera plegable para mesa", "Cubo metálico base", "Base metálica alta (centro de mesa)",
                    "Descanso metálico", "Descanso de madera", "Base metálica para mesa",
                    "Rueda de madera para mesa de cóctel", "Rueda metálica con repisas de madera"
                ]
            },
            {
                name: "Sillas",
                items: [
                    "Silla negra plegable", "Silla Tiffany blanca", "Silla Tiffany chocolate",
                    "Silla Tiffany blanca infantil", "Silla Cross Back madera tono nogal",
                    "Silla Cross Back madera tono miel", "Silla metálica Boss", "Silla metálica Lotus"
                ]
            },
            {
                name: "Sillones y Lounge",
                items: [
                    "Sillón principal gris Oxford", "Sillón principal palo de rosa (alita)",
                    "Sillón principal beige", "Sala lounge madera"
                ]
            },
            {
                name: "Bancas y Bancos",
                items: [
                    "Banca larga sin respaldo", "Banca larga con respaldo", "Banco individual puff",
                    "Banco metálico alto", "Banco de madera alto", "Banco alto tejido plástico negro",
                    "Banca para novios", "Periquera alta madera", "Periquera alta metal"
                ]
            },
            {
                name: "Cojines para Sillas",
                items: [
                    "Cojín para silla Tiffany", "Cojín para silla Lotus", "Cojín para silla Boss"
                ]
            }
        ]
    },
    {
        category: "🏛️ ESTRUCTURAS Y DECORACIÓN DE EVENTO",
        subcategories: [
            {
                name: "Estructuras y Escenografía",
                items: [
                    "Pieza de templete de madera", "Sombrilla", "Back redondo metálico", "Portería metálica negra",
                    "Portería metálica dorada", "Alfombra roja", "Caballete de madera", "Atril de madera",
                    "Reclinatorio", "Cruz de madera para ceremonia", "Unifila de madera"
                ]
            },
            {
                name: "Letras y Figuras Gigantes",
                items: [
                    "Letra gigante XV 1.10 mt", "Letra gigante XV 1.80 mt", "Letra gigante L",
                    "Letra gigante O", "Letra gigante V", "Letra gigante E", "Corazón gigante"
                ]
            },
            {
                name: "Decoración Religiosa / Ceremonial",
                items: [
                    "Cuadro Virgen María", "Reclinatorio"
                ]
            },
            {
                name: "Servicio y Logística en Evento",
                items: [
                    "Rack metálico para platos", "Carrito de snacks", "Tapa de carrito de snacks (shots)",
                    "Tapa de carrito de snacks (esquites)"
                ]
            }
        ]
    },
    {
        category: "🍽️ LOZA Y CRISTALERÍA",
        subcategories: [
            {
                name: "Platos",
                items: [
                    "Plato trinche 27 cm", "Plato sopero negro", "Plato sopero redondo blanco",
                    "Plato sopero cuadrado blanco", "Plato entremés blanco", "Plato postre",
                    "Plato base romano", "Plato base vintage", "Plato base concha dorado",
                    "Plato base chocolate", "Plato gótico", "Plato base plateado", "Plato base tipo espiral",
                    "Plato base cristal aperlado"
                ]
            },
            {
                name: "Copas",
                items: [
                    "Copa flauta", "Copa de agua transparente", "Copa de vino transparente",
                    "Copa de vino ámbar", "Copa de vino uva", "Copa de vino verde olivo",
                    "Copa de vino azul", "Copa de agua roja", "Copa agua romana", "Copa martinera"
                ]
            },
            {
                name: "Vasos",
                items: [
                    "Vaso cubero", "Vaso old fashion", "Tequilero"
                ]
            }
        ]
    },
    {
        category: "🥄 CUBIERTOS",
        subcategories: [
            {
                name: "Cucharas",
                items: [
                    "Cuchara sopera plateada", "Cuchara sopera dorada", "Cuchara sopera gold rose",
                    "Cuchara sopera negra", "Cucharita plateada", "Cucharita dorada",
                    "Cucharita gold rose", "Cucharita negra"
                ]
            },
            {
                name: "Cuchillos",
                items: [
                    "Cuchillo plateado", "Cuchillo dorado", "Cuchillo gold rose", "Cuchillo negro",
                    "Cuchillos (cocina)"
                ]
            },
            {
                name: "Tenedores",
                items: [
                    "Tenedor plateado carne", "Tenedor plateado ensalada", "Tenedor dorado ensalada",
                    "Tenedor dorado carne", "Tenedor gold rose ensalada", "Tenedor gold rose carne",
                    "Tenedor negro carne", "Tenedor negro ensalada"
                ]
            }
        ]
    },
    {
        category: "🧺 MANTELERÍA Y TEXTILES",
        subcategories: [
            {
                name: "Manteles",
                items: [
                    "Mantel blanco cuadrado", "Mantel blanco redondo", "Mantel negro cuadrado",
                    "Mantel caqui cuadrado", "Mantel azul marino cuadrado", "Mantel arena cuadrado",
                    "Mantel chocolate cuadrado", "Mantel blanco para tablón", "Mantel blanco tipo macramé"
                ]
            },
            {
                name: "Bambalinas",
                items: [
                    "Bambalinas negras para tablón", "Bambalina negra para tablón"
                ]
            },
            {
                name: "Cubre Manteles",
                items: [
                    "Cubre mantel dorado", "Cubre mantel palo de rosa", "Cubre mantel rojo",
                    "Cubre mantel verde", "Cubre mantel amarillo"
                ]
            },
            {
                name: "Caminos de Mesa",
                items: [
                    "Camino champagne", "Camino dorado", "Camino verde olivo", "Camino azul rey",
                    "Camino azul marino", "Camino azul cielo", "Camino azul turquesa", "Camino palo de rosa",
                    "Camino rosa baby", "Camino rosa blush", "Camino rosa brillante", "Camino fuxia",
                    "Camino corrugado ivory", "Camino verde bandera", "Camino shedron", "Camino beige",
                    "Camino rojo", "Camino negro", "Camino caqui", "Camino chocolate", "Camino arena",
                    "Camino durazno", "Camino lila", "Camino verde navidad", "Camino morado",
                    "Camino salmón", "Camino mexicano", "Camino corrugado verde olivo", "Camino hueso"
                ]
            }
        ]
    },
    {
        category: "🍹 UTENSILIOS DE BAR Y COCINA",
        subcategories: [
            {
                name: "Servicio de Bar",
                items: [
                    "Charola bar", "Charola grasa", "Pinzas para hielo", "Hielera metálica pequeña",
                    "Tarja para hielo", "Pica hielo", "Ceniceros", "Garrafón de plástico 19 lts"
                ]
            },
            {
                name: "Utensilios de Cocina / Servicio",
                items: [
                    "Licuadora", "Vitrolero de plástico grande", "Vitrolero de cristal pequeño",
                    "Exprimidor de limón", "Jarra de plástico", "Salsero", "Tortillero",
                    "Tablas para pan (madera)"
                ]
            }
        ]
    },
    {
        category: "🏷️ SEÑALIZACIÓN DE MESAS",
        subcategories: [
            {
                name: "Señalización",
                items: [
                    "Números para mesa en madera", "Números de mesa acrílico", "Base metálica para numeración de mesas"
                ]
            }
        ]
    }
];

async function main() {
    console.log('Iniciando carga de inventario...');
    let totalAdded = 0;

    for (const catData of catalogData) {
        let category = await prisma.catalogCategory.findFirst({
            where: { name: catData.category }
        });

        if (!category) {
            category = await prisma.catalogCategory.create({
                data: { name: catData.category }
            });
            console.log(`Creada categoría: ${category.name}`);
        }

        for (const subData of catData.subcategories) {
            let subCategory = await prisma.catalogSubCategory.findFirst({
                where: { name: subData.name, categoryId: category.id }
            });

            if (!subCategory) {
                subCategory = await prisma.catalogSubCategory.create({
                    data: { name: subData.name, categoryId: category.id }
                });
                console.log(` Creada subcategoría: ${subCategory.name}`);
            }

            for (const itemName of subData.items) {
                let item = await prisma.catalogItem.findFirst({
                    where: { name: itemName, subCategoryId: subCategory.id }
                });

                if (!item) {
                    await prisma.catalogItem.create({
                        data: {
                            name: itemName,
                            subCategoryId: subCategory.id,
                            price: 0,
                            cost: 0,
                            unit: 'pieza',
                            stock: 0,
                            stockDamaged: 0,
                            options: JSON.stringify({ location: '', capacity: '' })
                        }
                    });
                    totalAdded++;
                }
            }
        }
    }

    console.log(`Carga completa! Se agregaron ${totalAdded} artículos nuevos.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
