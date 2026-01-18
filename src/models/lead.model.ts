import { PrismaClient, Lead, Message, EventLog } from '@prisma/client';
export { Lead, Message, EventLog };

export type LeadStatus = 'NEW' | 'OUTREACHED' | 'REPLIED' | 'AI_REPLIED';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type EventType = 'LEAD_CREATED' | 'MESSAGE_SENT' | 'REPLY_RECEIVED' | 'AI_REPLY_GENERATED';

const prisma = new PrismaClient();

export class LeadModel {
    /**
     * Creates a new lead using Prisma.
     */
    async create(data: Pick<Lead, 'name' | 'email' | 'phone'>): Promise<Lead> {
        return prisma.lead.create({
            data: {
                ...data,
                status: 'NEW'
            }
        });
    }

    /**
     * Finds a lead by unique ID.
     */
    async findById(id: string): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: { id }
        });
    }

    /**
     * Updates the status of a lead.
     */
    async updateStatus(id: string, status: LeadStatus): Promise<Lead | null> {
        try {
            return await prisma.lead.update({
                where: { id },
                data: { status }
            });
        } catch (e) {
            return null;
        }
    }

    /**
     * Records a message for a lead.
     */
    async addMessage(leadId: string, content: string, direction: MessageDirection): Promise<Message> {
        return prisma.message.create({
            data: {
                leadId,
                content,
                direction
            }
        });
    }

    /**
     * Logs a system event.
     */
    async addLog(leadId: string, type: EventType, details?: string): Promise<EventLog> {
        return prisma.eventLog.create({
            data: {
                leadId,
                type,
                details
            }
        });
    }

    /**
     * Retrieves messages for a lead.
     */
    async getMessagesByLeadId(leadId: string): Promise<Message[]> {
        return prisma.message.findMany({
            where: { leadId },
            orderBy: { sentAt: 'asc' }
        });
    }

    /**
     * Retrieves logs for a lead.
     */
    async getLogsByLeadId(leadId: string): Promise<EventLog[]> {
        return prisma.eventLog.findMany({
            where: { leadId },
            orderBy: { timestamp: 'asc' }
        });
    }
}

export const leadModel = new LeadModel();
