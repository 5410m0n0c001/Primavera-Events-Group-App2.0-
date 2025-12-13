
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Analytics Queries...');

    try {
        const currentYear = new Date().getFullYear();
        console.log(`Querying payments for year ${currentYear}...`);

        const payments = await prisma.payment.findMany({
            where: {
                date: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            }
        });
        console.log(`Payments found: ${payments.length}`);

        console.log('Querying events...');
        const events = await prisma.event.findMany();
        console.log(`Events found: ${events.length}`);

        console.log('Grouping clients...');
        const clients = await prisma.client.groupBy({
            by: ['type'],
            _count: {
                _all: true
            }
        });
        console.log('Clients grouped:', clients);

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
