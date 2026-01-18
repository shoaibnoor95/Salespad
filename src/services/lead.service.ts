import { leadModel, Lead, Message, LeadStatus, MessageDirection, EventType } from '../models/lead.model';
import { EventLog } from '@prisma/client';

/**
 * LeadService
 * 
 * Orchestrates business logic related to leads. 
 * Delegates data access to LeadModel and handles logging of key business events.
 */
class LeadService {
    /**
     * Creates a new lead and logs the event.
     * @param data - Lead contact info.
     */
    async createLead(data: Pick<Lead, 'name' | 'email' | 'phone'>): Promise<Lead> {
        const lead = await leadModel.create(data);
        await this.logEvent(lead.id, 'LEAD_CREATED', `Lead ${lead.name} added.`);
        return lead;
    }

    /**
     * Retrieves full lead details including timeline history.
     * @param id - The UUID of the lead.
     */
    async getLead(id: string) {
        const lead = await leadModel.findById(id);
        if (!lead) return null;

        return {
            ...lead,
            messages: await leadModel.getMessagesByLeadId(id),
            logs: await leadModel.getLogsByLeadId(id),
        };
    }

    /**
     * Updates the status of a lead.
     * @param id - The UUID of the lead.
     * @param status - The new status.
     */
    async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
        return await leadModel.updateStatus(id, status);
    }

    /**
     * Adds a message to the lead's history and logs the event.
     * @param leadId - The ID of the lead.
     * @param content - Text content of the message.
     * @param direction - 'INBOUND' or 'OUTBOUND'.
     */
    async addMessage(leadId: string, content: string, direction: MessageDirection): Promise<Message> {
        const message = await leadModel.addMessage(leadId, content, direction);
        const logType: EventType = direction === 'OUTBOUND' ? 'MESSAGE_SENT' : 'REPLY_RECEIVED';
        await this.logEvent(leadId, logType, content);
        return message;
    }

    /**
     * Helper to log events via the model.
     * @param leadId - The ID of the lead.
     * @param type - The type of event to log.
     * @param details - Optional details.
     */
    async logEvent(leadId: string, type: EventType, details?: string) {
        // await leadModel.addLog(leadId, type, details); // Fire-and-forget or await? Controller awaits service actions.
        // It's safer to await logs to ensure consistency during tests.
        try {
            await leadModel.addLog(leadId, type, details);
            console.log(`[EventLog] ${type} for Lead ${leadId}: ${details}`);
        } catch (e) {
            console.error(`[EventLog] Failed to log event ${type}:`, e);
        }
    }
}

export const leadService = new LeadService();
