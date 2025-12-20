
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Categories and Subcategories
    const categories = [
        {
            name: 'Mobiliario',
            description: 'Sillas, mesas y muebles principales',
            subs: ['Sillas', 'Mesas', 'Salas Lounge', 'Periqueras']
        },
        {
            name: 'Mantelería',
            description: 'Manteles, caminos y servilletas',
            subs: ['Manteles Redondos', 'Manteles Tablón', 'Servilletas', 'Caminos']
        },
        {
            name: 'Catering',
            description: 'Equipo de servicio de alimentos',
            subs: ['Loza', 'Cristalería', 'Plaqué', 'Utensilios']
        },
        {
            name: 'Equipo',
            description: 'Audio, iluminación y estructura',
            subs: ['Audio', 'Iluminación', 'Carpas', 'Tarimas']
        },
        {
            name: 'Decoración',
            description: 'Elementos decorativos',
            subs: ['Centros de Mesa', 'Flores Artificiales', 'Velas']
        }
    ];

    for (const cat of categories) {
        // Check if category exists (ID is UUID, Name is NOT unique in schema)
        let category = await prisma.catalogCategory.findFirst({
            where: { name: cat.name }
        });

        if (!category) {
            category = await prisma.catalogCategory.create({
                data: {
                    name: cat.name,
                    description: cat.description
                }
            });
            console.log(`Created category: ${category.name}`);
        } else {
            console.log(`Category exists: ${category.name}`);
        }

        if (!category) continue; // Should not happen

        for (const sub of cat.subs) {
            const existingSub = await prisma.catalogSubCategory.findFirst({
                where: { name: sub, categoryId: category.id }
            });

            if (!existingSub) {
                await prisma.catalogSubCategory.create({
                    data: { name: sub, categoryId: category.id }
                });
                console.log(`  - Added sub: ${sub}`);
            }
        }
    }

    // --- PRODUCTION ELEMENTS SEEDING ---
    console.log('🌱 Seeding Production Elements...');

    const floorplanCategories = [
        {
            id: 'acceso',
            name: 'ACCESO Y RECEPCIÓN',
            emoji: '🚪',
            elements: [
                { id: 'acceso-principal', name: 'Acceso principal invitados', width: 100, height: 50 },
                { id: 'acceso-proveedores', name: 'Acceso proveedores', width: 80, height: 50 },
                { id: 'acceso-staff', name: 'Acceso staff', width: 80, height: 50 },
                { id: 'recepcion', name: 'Recepción', width: 120, height: 80 },
                { id: 'mesa-bienvenida', name: 'Mesa de bienvenida', width: 100, height: 60 },
                { id: 'mesa-registro', name: 'Mesa de registro', width: 100, height: 60 },
                { id: 'area-pulseras', name: 'Área de pulseras / boletos', width: 90, height: 60 },
                { id: 'tornafiesta', name: 'Tornafiesta / torniquetes', width: 60, height: 60 },
                { id: 'area-hostess', name: 'Área de hostess', width: 80, height: 60 },
                { id: 'control-invitados', name: 'Área de control de invitados', width: 100, height: 70 },
                { id: 'punto-info', name: 'Punto de información', width: 70, height: 70 },
                { id: 'senaletica', name: 'Señalética general', width: 40, height: 40 }
            ]
        },
        {
            id: 'estacionamiento',
            name: 'ESTACIONAMIENTO Y MOVILIDAD',
            emoji: '🚗',
            elements: [
                { id: 'estacionamiento-gral', name: 'Estacionamiento general', width: 200, height: 150 },
                { id: 'estacionamiento-vip', name: 'Estacionamiento VIP', width: 150, height: 100 },
                { id: 'estacionamiento-prov', name: 'Estacionamiento proveedores', width: 120, height: 100 },
                { id: 'estacionamiento-staff', name: 'Estacionamiento staff', width: 100, height: 80 },
                { id: 'valet-parking', name: 'Área de valet parking', width: 80, height: 60 },
                { id: 'ascenso-descenso', name: 'Zona de ascenso y descenso', width: 100, height: 50 },
                { id: 'circulacion', name: 'Circulación vehicular', width: 150, height: 40 },
                { id: 'area-buses', name: 'Área de autobuses / vans', width: 150, height: 100 },
                { id: 'rampas', name: 'Rampas para discapacidad', width: 60, height: 80 },
                { id: 'iluminacion-est', name: 'Iluminación de estacionamiento', width: 30, height: 30 }
            ]
        },
        {
            id: 'coctel',
            name: 'ÁREA DE CÓCTEL / BIENVENIDA',
            emoji: '🍸',
            elements: [
                { id: 'area-coctel', name: 'Área de cóctel', width: 150, height: 150 },
                { id: 'mesas-cocteleras', name: 'Mesas cocteleras', width: 60, height: 60 },
                { id: 'periqueras', name: 'Periqueras', width: 40, height: 40 },
                { id: 'sillones-lounge', name: 'Sillones lounge', width: 100, height: 80 },
                { id: 'barra-bienvenida', name: 'Barra de bienvenida', width: 120, height: 60 },
                { id: 'barra-mixologia', name: 'Barra de mixología', width: 150, height: 70 },
                { id: 'barra-sin-alcohol', name: 'Barra de bebidas sin alcohol', width: 100, height: 60 },
                { id: 'estacion-aguas', name: 'Estación de aguas frescas', width: 80, height: 50 },
                { id: 'estacion-botanas', name: 'Estación de botanas', width: 80, height: 50 }
            ]
        },
        {
            id: 'jardines',
            name: 'ÁREA DE JARDINES / EXTERIORES',
            emoji: '🌳',
            elements: [
                { id: 'jardines-principales', name: 'Jardines principales', width: 250, height: 200 },
                { id: 'jardines-secundarios', name: 'Jardines secundarios', width: 150, height: 120 },
                { id: 'areas-verdes', name: 'Áreas verdes delimitadas', width: 120, height: 100 },
                { id: 'caminos', name: 'Caminos peatonales', width: 200, height: 40 },
                { id: 'pergolas', name: 'Pérgolas', width: 100, height: 100 },
                { id: 'sombrillas', name: 'Sombrillas', width: 50, height: 50 },
                { id: 'iluminacion-ext', name: 'Iluminación exterior', width: 30, height: 30 },
                { id: 'area-descanso', name: 'Área de descanso', width: 100, height: 80 },
                { id: 'zona-fumadores', name: 'Zona de fumadores', width: 60, height: 60 }
            ]
        },
        {
            id: 'invitados',
            name: 'ÁREA DE INVITADOS',
            emoji: '🪑',
            elements: [
                { id: 'mesas-redondas', name: 'Mesas redondas', width: 80, height: 80 },
                { id: 'mesas-rectangulares', name: 'Mesas rectangulares', width: 120, height: 60 },
                { id: 'mesas-imperiales', name: 'Mesas imperiales', width: 200, height: 80 },
                { id: 'sillas', name: 'Sillas', width: 30, height: 30 },
                { id: 'mesa-novios', name: 'Mesa de novios', width: 150, height: 80 },
                { id: 'mesa-honor', name: 'Mesa de honor', width: 180, height: 80 },
                { id: 'mesa-familia', name: 'Mesa de familia', width: 100, height: 80 },
                { id: 'area-infantil', name: 'Área infantil', width: 120, height: 120 },
                { id: 'area-adultos', name: 'Área adultos mayores', width: 100, height: 100 }
            ]
        },
        {
            id: 'buffet',
            name: 'ÁREA DE ALIMENTOS - BUFFET',
            emoji: '🍽️',
            elements: [
                { id: 'buffet-caliente', name: 'Barra de buffet caliente', width: 150, height: 60 },
                { id: 'buffet-frio', name: 'Barra de buffet frío', width: 150, height: 60 },
                { id: 'barra-ensaladas', name: 'Barra de ensaladas', width: 120, height: 60 },
                { id: 'barra-sopas', name: 'Barra de sopas', width: 100, height: 60 },
                { id: 'barra-guarniciones', name: 'Barra de guarniciones', width: 100, height: 60 },
                { id: 'barra-postres', name: 'Barra de postres', width: 120, height: 60 },
                { id: 'barra-pan', name: 'Barra de pan', width: 80, height: 50 },
                { id: 'estacion-salsas', name: 'Estación de salsas', width: 60, height: 40 },
                { id: 'area-platos', name: 'Área de platos y cubiertos', width: 80, height: 60 },
                { id: 'estacion-tacos', name: 'Estación de tacos', width: 100, height: 60 },
                { id: 'estacion-antojitos', name: 'Estación de antojitos mexicanos', width: 100, height: 60 },
                { id: 'estacion-parrilla', name: 'Estación de parrilla', width: 120, height: 70 },
                { id: 'estacion-mariscos', name: 'Estación de mariscos', width: 120, height: 70 },
                { id: 'estacion-pasta', name: 'Estación de pasta', width: 100, height: 60 },
                { id: 'comida-infantil', name: 'Estación de comida infantil', width: 80, height: 60 }
            ]
        },
        {
            id: 'cocinas',
            name: 'COCINAS Y OPERACIÓN',
            emoji: '👨‍🍳',
            elements: [
                { id: 'cocina-caliente', name: 'Cocina caliente', width: 150, height: 120 },
                { id: 'cocina-fria', name: 'Cocina fría', width: 120, height: 100 },
                { id: 'area-preparacion', name: 'Área de preparación', width: 140, height: 100 },
                { id: 'area-emplatado', name: 'Área de emplatado', width: 120, height: 80 },
                { id: 'area-lavado', name: 'Área de lavado', width: 100, height: 80 },
                { id: 'area-basura', name: 'Área de basura', width: 60, height: 60 },
                { id: 'area-reciclaje', name: 'Área de reciclaje', width: 60, height: 60 },
                { id: 'almacen-seco', name: 'Almacén seco', width: 100, height: 100 },
                { id: 'camara-refrigeracion', name: 'Cámara de refrigeración', width: 80, height: 100 },
                { id: 'area-gas', name: 'Área de gas', width: 60, height: 60 },
                { id: 'area-electrica', name: 'Área eléctrica', width: 60, height: 60 },
                { id: 'carpa-cocina', name: 'Carpa de cocina', width: 200, height: 150 }
            ]
        },
        {
            id: 'barras',
            name: 'BARRAS DE BEBIDAS',
            emoji: '🍹',
            elements: [
                { id: 'barra-principal', name: 'Barra principal', width: 150, height: 70 },
                { id: 'barras-secundarias', name: 'Barras secundarias', width: 120, height: 60 },
                { id: 'barra-vip', name: 'Barra VIP', width: 130, height: 70 },
                { id: 'barra-vinos', name: 'Barra de vinos', width: 100, height: 60 },
                { id: 'barra-cerveza', name: 'Barra de cerveza', width: 120, height: 60 },
                { id: 'barra-tequila', name: 'Barra de tequila / mezcal', width: 110, height: 60 },
                { id: 'barra-cafe', name: 'Barra de café', width: 90, height: 60 },
                { id: 'barra-refrescos', name: 'Barra de refrescos', width: 100, height: 60 },
                { id: 'hieleras', name: 'Hieleras', width: 50, height: 50 },
                { id: 'area-cristaleria', name: 'Área de cristalería', width: 80, height: 60 }
            ]
        },
        {
            id: 'escenario',
            name: 'ESCENARIO, AUDIO Y SHOW',
            emoji: '🎤',
            elements: [
                { id: 'escenario', name: 'Escenario / stage', width: 200, height: 150 },
                { id: 'tarima-dj', name: 'Tarima DJ', width: 120, height: 100 },
                { id: 'backdrop', name: 'Backdrop', width: 150, height: 120 },
                { id: 'cabina-dj', name: 'Cabina DJ', width: 80, height: 80 },
                { id: 'area-grupo', name: 'Área grupo musical', width: 150, height: 120 },
                { id: 'area-mariachi', name: 'Área mariachi', width: 120, height: 100 },
                { id: 'area-norteno', name: 'Área norteño', width: 120, height: 100 },
                { id: 'pantallas-led', name: 'Pantallas LED', width: 100, height: 80 },
                { id: 'proyector', name: 'Proyector', width: 60, height: 60 },
                { id: 'torres-audio', name: 'Torres de audio', width: 40, height: 100 },
                { id: 'cabina-control', name: 'Cabina de control', width: 80, height: 80 },
                { id: 'fuegos-frios', name: 'Área de fuegos fríos', width: 60, height: 60 }
            ]
        },
        {
            id: 'pista',
            name: 'PISTA DE BAILE Y ENTRETENIMIENTO',
            emoji: '💃',
            elements: [
                { id: 'pista-baile', name: 'Pista de baile', width: 200, height: 200 },
                { id: 'area-animadores', name: 'Área de animadores', width: 100, height: 80 },
                { id: 'photo-booth', name: 'Photo booth', width: 80, height: 80 },
                { id: 'cabina-360', name: 'Cabina 360', width: 100, height: 100 },
                { id: 'area-recuerdos', name: 'Área de recuerdos', width: 80, height: 60 },
                { id: 'area-sorpresas', name: 'Área de sorpresas', width: 80, height: 60 },
                { id: 'juegos-inflables', name: 'Juegos inflables', width: 150, height: 150 },
                { id: 'inflables-infantiles', name: 'Inflables infantiles', width: 120, height: 120 },
                { id: 'inflables-mecanicos', name: 'Inflables mecánicos', width: 100, height: 100 },
                { id: 'toros-mecanicos', name: 'Toros mecánicos', width: 120, height: 120 }
            ]
        },
        {
            id: 'carpas',
            name: 'CARPAS Y ESTRUCTURAS',
            emoji: '⛺',
            elements: [
                { id: 'carpa-principal', name: 'Carpa principal', width: 300, height: 250 },
                { id: 'carpa-ceremonia', name: 'Carpa ceremonia', width: 200, height: 180 },
                { id: 'carpa-coctel', name: 'Carpa cóctel', width: 180, height: 150 },
                { id: 'carpa-buffet', name: 'Carpa buffet', width: 180, height: 150 },
                { id: 'carpa-barras', name: 'Carpa barras', width: 150, height: 120 },
                { id: 'carpa-inflables', name: 'Carpa inflables', width: 150, height: 150 },
                { id: 'carpa-staff', name: 'Carpa staff', width: 120, height: 100 },
                { id: 'carpa-proveedores', name: 'Carpa proveedores', width: 120, height: 100 },
                { id: 'carpa-primeros-auxilios', name: 'Carpa primeros auxilios', width: 80, height: 80 }
            ]
        },
        {
            id: 'ceremonia',
            name: 'CEREMONIA',
            emoji: '💒',
            elements: [
                { id: 'altar', name: 'Altar', width: 100, height: 80 },
                { id: 'arco', name: 'Arco', width: 120, height: 150 },
                { id: 'pasillo', name: 'Pasillo', width: 200, height: 50 },
                { id: 'sillas-ceremonia', name: 'Sillas ceremonia', width: 30, height: 30 },
                { id: 'mesa-ritual', name: 'Mesa ritual', width: 80, height: 60 },
                { id: 'area-oficiante', name: 'Área oficiante', width: 60, height: 60 },
                { id: 'area-musicos', name: 'Área músicos', width: 100, height: 80 }
            ]
        },
        {
            id: 'regalos',
            name: 'REGALOS Y EXPERIENCIAS',
            emoji: '🎁',
            elements: [
                { id: 'mesa-regalos', name: 'Mesa de regalos', width: 100, height: 60 },
                { id: 'area-sobres', name: 'Área de sobres', width: 80, height: 60 },
                { id: 'area-regalos-fisicos', name: 'Área de regalos físicos', width: 120, height: 80 },
                { id: 'area-resguardo', name: 'Área de resguardo', width: 100, height: 100 },
                { id: 'caja-seguridad', name: 'Caja de seguridad', width: 60, height: 60 }
            ]
        },
        {
            id: 'banos',
            name: 'BAÑOS Y SERVICIOS',
            emoji: '🚻',
            elements: [
                { id: 'banos-fijos', name: 'Baños fijos', width: 100, height: 120 },
                { id: 'banos-moviles', name: 'Baños móviles', width: 80, height: 100 },
                { id: 'banos-vip', name: 'Baños VIP', width: 120, height: 100 },
                { id: 'banos-staff', name: 'Baños staff', width: 80, height: 80 },
                { id: 'lavamanos', name: 'Lavamanos', width: 60, height: 40 },
                { id: 'area-limpieza', name: 'Área de limpieza', width: 60, height: 60 }
            ]
        },
        {
            id: 'staff',
            name: 'STAFF Y PROVEEDORES',
            emoji: '👔',
            elements: [
                { id: 'area-staff', name: 'Área staff', width: 120, height: 100 },
                { id: 'vestidores', name: 'Vestidores', width: 100, height: 80 },
                { id: 'area-descanso-staff', name: 'Área descanso', width: 100, height: 80 },
                { id: 'area-coordinacion', name: 'Área de coordinación', width: 80, height: 80 },
                { id: 'area-proveedores', name: 'Área de proveedores', width: 100, height: 100 },
                { id: 'area-carga', name: 'Área de carga y descarga', width: 150, height: 100 }
            ]
        },
        {
            id: 'seguridad',
            name: 'SEGURIDAD Y EMERGENCIAS',
            emoji: '🚨',
            elements: [
                { id: 'seguridad-privada', name: 'Seguridad privada', width: 60, height: 60 },
                { id: 'primeros-auxilios', name: 'Punto de primeros auxilios', width: 80, height: 80 },
                { id: 'ambulancia', name: 'Ambulancia', width: 100, height: 60 },
                { id: 'punto-reunion', name: 'Punto de reunión', width: 100, height: 100 },
                { id: 'extintores', name: 'Extintores', width: 30, height: 40 },
                { id: 'rutas-evacuacion', name: 'Rutas de evacuación', width: 200, height: 40 },
                { id: 'salidas-emergencia', name: 'Salidas de emergencia', width: 80, height: 50 },
                { id: 'cctv', name: 'CCTV', width: 40, height: 40 }
            ]
        },
        {
            id: 'iluminacion',
            name: 'ILUMINACIÓN Y ENERGÍA',
            emoji: '⚡',
            elements: [
                { id: 'planta-luz', name: 'Planta de luz', width: 100, height: 80 },
                { id: 'tablero-electrico', name: 'Tablero eléctrico', width: 60, height: 80 },
                { id: 'cableado', name: 'Cableado', width: 150, height: 20 },
                { id: 'torres-iluminacion', name: 'Torres de iluminación', width: 40, height: 120 },
                { id: 'iluminacion-ambiental', name: 'Iluminación ambiental', width: 50, height: 50 },
                { id: 'iluminacion-arquitectonica', name: 'Iluminación arquitectónica', width: 60, height: 60 }
            ]
        }
    ];

    // --- OPTIMIZED PRODUCTION SEEDING ---
    // 1. Fetch existing categories to map Name -> ID
    const existingCategories = await prisma.productionCategory.findMany();
    const catMap = new Map<string, string>();
    existingCategories.forEach(c => catMap.set(c.name, c.id));

    // 2. Ensure all Categories exist
    for (const cat of floorplanCategories) {
        if (!catMap.has(cat.name)) {
            const newCat = await prisma.productionCategory.create({
                data: { name: cat.name, emoji: cat.emoji }
            });
            catMap.set(newCat.name, newCat.id);
            console.log(`Created Prod Category: ${newCat.name}`);
        }
    }

    // 3. Prepare Elements for Bulk Insert
    // Fetch all existing elements to check purely in memory
    const allExistingElements = await prisma.productionElement.findMany({
        select: { name: true, categoryId: true }
    });

    // Create a Set for fast lookup: "categoryId:elementName"
    const existingElementSet = new Set(
        allExistingElements.map(e => `${e.categoryId}:${e.name}`)
    );

    const elementsToInsert: any[] = [];

    for (const cat of floorplanCategories) {
        const catId = catMap.get(cat.name);
        if (!catId) continue; // Should not happen

        for (const el of cat.elements) {
            const key = `${catId}:${el.name}`;
            if (!existingElementSet.has(key)) {
                elementsToInsert.push({
                    name: el.name,
                    width: el.width,
                    height: el.height,
                    categoryId: catId
                    // icon: el.icon // future proofing if needed
                });
            }
        }
    }

    // 4. Bulk Insert Elements
    if (elementsToInsert.length > 0) {
        console.log(`🚀 Bulk inserting ${elementsToInsert.length} elements...`);
        await prisma.productionElement.createMany({
            data: elementsToInsert
        });
        console.log('✅ Bulk insert completed.');
    } else {
        console.log('✅ No new elements to insert.');
    }

    console.log('✅ Production Elements seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
