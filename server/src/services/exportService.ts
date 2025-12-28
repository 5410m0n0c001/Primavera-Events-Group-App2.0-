import { PrismaClient } from '@prisma/client';

import { prisma } from '../prisma';

export async function generateEventCSV(eventId: string): Promise<string> {
    try {
        console.log(`[exportService] Starting CSV for: ${eventId}`);
        const startTime = Date.now();

        // ✅ SELECT ESPECÍFICO (no include todo)
        // Note: Schema has 'quotes' and 'timeline' relations.
        // 'selectedItems' is NOT in the schema provided in previous view_file (lines 41-71), 
        // it seems specific items are in Quotes -> QuoteItems.
        // The previous implementation used Quotes.
        // I will adapt the plan "selectedItems" to "quotes -> items" mapping which reflects the actual schema.

        // Actually, looking at schema line 121: quotes Quote[]. Quote has items QuoteItem[].
        // QuoteItem has serviceItem CatalogItem.
        // So to get "items", I need to fetch the accepted quote's items.

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                id: true,
                name: true,
                date: true,
                // description: true, // Verification: Event model (lines 41-71) does NOT have description field. It has notes.
                notes: true,
                location: true,
                guestCount: true,

                // Relation to get items: Active Quote
                quotes: {
                    where: { status: 'ACCEPTED' },
                    take: 1,
                    select: {
                        items: {
                            select: {
                                quantity: true,
                                unitPrice: true,
                                serviceItem: {
                                    select: {
                                        name: true,
                                        // category: true, // CatalogItem has subCategory -> category. 
                                        // Schema line 174: subCategory. subCategory has category.
                                        subCategory: {
                                            select: {
                                                category: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        if (!event) {
            throw new Error(`Event ${eventId} not found`);
        }

        const acceptedQuote = event.quotes[0];
        const items = acceptedQuote ? acceptedQuote.items : [];

        // ✅ Validar tamaño
        const rowCount = items.length + 5;
        if (rowCount > 1000) {
            throw new Error(`Event too large (${rowCount} rows)`);
        }

        // ✅ Generar CSV
        const csvLines: string[] = [];

        // Headers
        csvLines.push(
            'Task Name,Description,Assignee,Due Date,Start Date,Priority,Section,Depends On,Cost'
        );

        // Main event
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        const startDate = new Date(
            new Date(event.date).getTime() - 15 * 24 * 60 * 60 * 1000
        )
            .toISOString()
            .split('T')[0];

        csvLines.push(
            escapeCSV(
                `${event.name} - Event,${event.notes || 'Event'},,,${eventDate},${startDate},High,Planning,,0`
            )
        );

        // Services
        if (items.length > 0) {
            items.forEach((item) => {
                const cost = (Number(item.unitPrice) || 0) * item.quantity;
                const categoryName = item.serviceItem.subCategory.category.name;
                csvLines.push(
                    escapeCSV(
                        `${item.serviceItem.name},${categoryName},,,${eventDate},${startDate},Medium,${categoryName},"${event.name} - Event",${cost}`
                    )
                );
            });
        }

        // Post-event
        const postDate = new Date(
            new Date(event.date).getTime() + 1 * 24 * 60 * 60 * 1000
        )
            .toISOString()
            .split('T')[0];
        csvLines.push(
            escapeCSV(
                `Post-Event: Evaluation,Cleanup,,,${postDate},${postDate},Low,Closing,"${event.name} - Event",0`
            )
        );

        const csv = csvLines.join('\n');
        const duration = Date.now() - startTime;

        console.log(`[exportService] ✅ Done (${csv.length} bytes, ${duration}ms)`);
        return csv;
    } catch (error) {
        console.error('[exportService] ❌ Error:', error);
        throw error;
    }
}

function escapeCSV(value: string): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
