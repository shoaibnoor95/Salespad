import { Request, Response } from 'express';
import { leadService } from '../services/lead.service';
import { queueService } from '../services/queue.service';
import { aiService } from '../services/ai.service';

/**
 * Creates a new lead in the system.
 * Expected body: { name, email, phone }
 */
export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || (!email && !phone)) {
            return res.status(400).json({ error: 'Name and at least one contact method (email or phone) are required.' });
        }
        const lead = await leadService.createLead({ name, email, phone });
        res.status(201).json(lead);
    } catch (error) {
        console.error('[Controller Error] createLead:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
};

/**
 * Triggers an outbound message to a lead.
 * Expected body: { leadId, content? }
 */
export const sendOutreach = async (req: Request, res: Response) => {
    try {
        const { leadId, content } = req.body;
        if (!leadId) {
            return res.status(400).json({ error: 'leadId is required.' });
        }
        const lead = await leadService.getLead(leadId);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        await leadService.addMessage(leadId, content || 'Hello! Interested in SalesPad?', 'OUTBOUND');
        await leadService.updateLeadStatus(leadId, 'OUTREACHED');

        const job = await queueService.addJob('SEND_EMAIL', { leadId, content });
        res.json({ message: 'Outbound message enqueued', jobId: job.id });
    } catch (error) {
        console.error('[Controller Error] sendOutreach:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
};

/**
 * Simulates receiving a reply from a prospect (e.g., via webhook).
 * Expected body: { leadId, content }
 */
export const handleReply = async (req: Request, res: Response) => {
    try {
        const { leadId, content } = req.body;
        if (!leadId || !content) {
            return res.status(400).json({ error: 'leadId and content are required.' });
        }
        const lead = await leadService.getLead(leadId);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        await leadService.addMessage(leadId, content, 'INBOUND');
        await leadService.updateLeadStatus(leadId, 'REPLIED');

        res.json({ message: 'Reply received and logged' });
    } catch (error) {
        console.error('[Controller Error] handleReply:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
};

/**
 * Triggers the AI agent to generate a reply based on the conversation context.
 * Expected body: { leadId }
 */
export const generateAIReply = async (req: Request, res: Response) => {
    try {
        const { leadId } = req.body;
        if (!leadId) {
            return res.status(400).json({ error: 'leadId is required.' });
        }
        const lead = await leadService.getLead(leadId);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        // Find the last prospect reply
        const lastReply = lead.messages.filter(m => m.direction === 'INBOUND').pop();
        const prompt = lastReply ? lastReply.content : 'Follow up';

        const aiContent = await aiService.generateResponse(lead.name, prompt);

        await leadService.addMessage(leadId, aiContent, 'OUTBOUND');
        await leadService.updateLeadStatus(leadId, 'AI_REPLIED');
        await leadService.logEvent(leadId, 'AI_REPLY_GENERATED', aiContent);

        const job = await queueService.addJob('GENERATE_AI_REPLY', { leadId, aiContent });

        res.json({ message: 'AI reply generated and enqueued', aiContent, jobId: job.id });
    } catch (error) {
        console.error('[Controller Error] generateAIReply:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
};

/**
 * Retrieves full details of a lead, including messages and background jobs.
 * Expected params: { id }
 */
export const getLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lead = await leadService.getLead(id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        const jobs = queueService.getJobsByLead(id);

        res.json({
            ...lead,
            jobs
        });
    } catch (error) {
        console.error('[Controller Error] getLead:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
};
