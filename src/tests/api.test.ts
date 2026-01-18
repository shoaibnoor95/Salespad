import request from 'supertest';
import express from 'express';
import { leadRoutes } from '../routes/lead.routes';
import { leadService } from '../services/lead.service';
import { queueService } from '../services/queue.service';

const app = express();
app.use(express.json());
app.use(leadRoutes);

// Mock the services
jest.mock('../services/lead.service', () => ({
    leadService: {
        createLead: jest.fn(),
        addMessage: jest.fn(),
        updateLeadStatus: jest.fn(),
        getLead: jest.fn(),
        logEvent: jest.fn(),
    }
}));
jest.mock('../services/queue.service', () => ({
    queueService: {
        addJob: jest.fn(),
        getJobsByLead: jest.fn(),
    }
}));
jest.mock('../services/ai.service', () => ({
    aiService: {
        generateResponse: jest.fn(),
    }
}));

describe('API Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /lead', () => {
        it('should create a lead successfully', async () => {
            const mockLead = { id: '123', name: 'John', email: 'john@example.com' };
            (leadService.createLead as jest.Mock).mockResolvedValue(mockLead);

            const res = await request(app)
                .post('/lead')
                .send({ name: 'John', email: 'john@example.com' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockLead);
        });

        it('should return 400 if name is missing', async () => {
            const res = await request(app).post('/lead').send({ email: 'john@example.com' });
            expect(res.status).toBe(400);
        });
    });

    describe('POST /send', () => {
        it('should enqueue outbound message', async () => {
            const mockLead = { id: '123' };
            (leadService.getLead as jest.Mock).mockResolvedValue(mockLead);
            (queueService.addJob as jest.Mock).mockResolvedValue({ id: 'job1' });

            const res = await request(app)
                .post('/send')
                .send({ leadId: '123', content: 'Hello' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('jobId', 'job1');
            expect(leadService.addMessage).toHaveBeenCalled();
        });

        it('should return 404 if lead not found', async () => {
            (leadService.getLead as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post('/send')
                .send({ leadId: '999', content: 'Hello' });

            expect(res.status).toBe(404);
        });
    });
});
