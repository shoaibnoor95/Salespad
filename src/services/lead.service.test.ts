import { leadService } from './lead.service';
import { leadModel } from '../models/lead.model';

// Mock the leadModel to avoid DB calls
jest.mock('../models/lead.model', () => ({
    leadModel: {
        create: jest.fn(),
        findById: jest.fn(),
        updateStatus: jest.fn(),
        addMessage: jest.fn(),
        addLog: jest.fn(),
        getMessagesByLeadId: jest.fn(),
        getLogsByLeadId: jest.fn(),
    }
}));

describe('LeadService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a lead successfully', async () => {
        const mockLead = { id: '123', name: 'Test Lead', status: 'NEW' };
        (leadModel.create as jest.Mock).mockResolvedValue(mockLead);

        const result = await leadService.createLead({ name: 'Test Lead', email: 'test@example.com', phone: null });

        expect(leadModel.create).toHaveBeenCalledWith({ name: 'Test Lead', email: 'test@example.com', phone: null });
        expect(leadModel.addLog).toHaveBeenCalledWith('123', 'LEAD_CREATED', expect.stringContaining('Test Lead'));
        expect(result).toEqual(mockLead);
    });

    it('should update lead status', async () => {
        const mockLead = { id: '123', status: 'OUTREACHED' };
        (leadModel.updateStatus as jest.Mock).mockResolvedValue(mockLead);

        const result = await leadService.updateLeadStatus('123', 'OUTREACHED');

        expect(leadModel.updateStatus).toHaveBeenCalledWith('123', 'OUTREACHED');
        expect(result).toEqual(mockLead);
    });
});
