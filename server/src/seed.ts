
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

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
