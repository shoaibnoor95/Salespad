/**
 * Represents the types of jobs the queue can handle.
 */
export type JobType = 'SEND_EMAIL' | 'GENERATE_AI_REPLY';

/**
 * Interface representing a background job.
 */
export interface Job {
    id: string;
    type: JobType;
    data: any;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
    attempts: number;
    maxRetries: number;
}

/**
 * MockQueueService
 * 
 * Simulates a message queue (like BullMQ or RabbitMQ) with retry logic.
 */
class MockQueueService {
    private jobs: Job[] = [];

    /**
     * Adds a new job to the queue.
     * @param type - The type of job (e.g., SEND_EMAIL).
     * @param data - The payload for the job.
     */
    async addJob(type: JobType, data: any): Promise<Job> {
        const maxRetries = parseInt(process.env.QUEUE_MAX_RETRIES || '3', 10);
        const job: Job = {
            id: Math.random().toString(36).substring(7),
            type,
            data,
            status: 'PENDING',
            attempts: 0,
            maxRetries,
        };
        this.jobs.push(job);
        console.log(`[Queue] Added job ${job.id} of type ${type}`);

        // Simulate async processing (fire-and-forget in this mock)
        this.processJob(job);

        return job;
    }

    /**
     * Simulates the worker processing a job with random failure and retry logic.
     * @param job - The job to process.
     */
    private async processJob(job: Job) {
        if (job.attempts >= job.maxRetries) {
            job.status = 'FAILED';
            console.error(`[Queue] Job ${job.id} FAILED after ${job.attempts} attempts.`);
            return;
        }

        job.attempts++;
        job.status = 'PENDING';

        // Simulate processing time
        const processDelay = parseInt(process.env.QUEUE_PROCESS_DELAY_MS || '2000', 10);
        await new Promise(resolve => setTimeout(resolve, processDelay));

        // Simulate a random failure (10% chance) to demonstrate retry logic
        const shouldFail = Math.random() < 0.1;

        if (shouldFail) {
            console.warn(`[Queue] Job ${job.id} failed attempt ${job.attempts}. Retrying...`);
            job.status = 'RETRYING';
            // Schedule retry
            setTimeout(() => this.processJob(job), 1000 * job.attempts); // Exponential backoff simulation
        } else {
            job.status = 'COMPLETED';
            console.log(`[Queue] Job ${job.id} (${job.type}) completed successfully.`);
        }
    }

    /**
     * Retrieves all jobs associated with a specific lead.
     * @param leadId - The ID of the lead.
     */
    getJobsByLead(leadId: string): Job[] {
        return this.jobs.filter(j => j.data.leadId === leadId);
    }
}

export const queueService = new MockQueueService();
