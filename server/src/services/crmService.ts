import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export const crmService = {
    /**
     * Creates or updates a lead based on phone or email
     */
    async createOrUpdateLead(data: Prisma.LeadCreateInput | Prisma.LeadUpdateInput) {
        let existingLead = null;

        // Try to find existing lead by phone
        if (data.phone) {
            existingLead = await prisma.lead.findFirst({
                where: { phone: data.phone as string }
            });
        }

        // Try to find existing lead by email if not found by phone
        if (!existingLead && data.email) {
            existingLead = await prisma.lead.findFirst({
                where: { email: data.email as string }
            });
        }

        if (existingLead) {
            // Update existing
            const updatedLead = await prisma.lead.update({
                where: { id: existingLead.id },
                data: data
            });
            return { lead: updatedLead, isNew: false, message: 'Lead actualizado exitosamente' };
        } else {
            // Create new
            const newLead = await prisma.lead.create({
                data: data as Prisma.LeadCreateInput
            });
            return { lead: newLead, isNew: true, message: 'Nuevo lead creado exitosamente' };
        }
    },

    /**
     * Retrieves a lead by ID including their appointment
     */
    async getLead(id: string) {
        return prisma.lead.findUnique({
            where: { id },
            include: {
                appointment: true
            }
        });
    },

    /**
     * Retrieves all leads with optional filtering
     */
    async getAllLeads(filters?: { status?: any, eventType?: string, dateRange?: { start: Date, end: Date } }) {
        const where: Prisma.LeadWhereInput = {};

        if (filters?.status) where.status = filters.status;
        if (filters?.eventType) where.eventType = { contains: filters.eventType, mode: 'insensitive' };

        if (filters?.dateRange) {
            where.createdAt = {
                gte: filters.dateRange.start,
                lte: filters.dateRange.end
            };
        }

        return prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { appointment: true }
        });
    },

    /**
     * Updates a lead's status
     */
    async updateLeadStatus(id: string, status: any) { // using any for LeadStatus enum while types sync
        return prisma.lead.update({
            where: { id },
            data: { status }
        });
    },

    /**
     * Generates summary metrics for the admin interface
     */
    async getLeadsSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [total, newLeads, contacted, qualified, closedWon, closedLost, todayLeads] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.count({ where: { status: 'NEW' } }),
            prisma.lead.count({ where: { status: 'CONTACTED' } }),
            prisma.lead.count({ where: { status: 'QUALIFIED' } }),
            prisma.lead.count({ where: { status: 'CLOSED_WON' } }),
            prisma.lead.count({ where: { status: 'CLOSED_LOST' } }),
            prisma.lead.count({ where: { createdAt: { gte: today } } })
        ]);

        return {
            total,
            new: newLeads,
            contacted,
            qualified,
            closedWon,
            closedLost,
            todayLeads
        };
    }
};
