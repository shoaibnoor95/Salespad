/**
 * AIService
 * 
 * Simulates an interface to an LLM (Large Language Model) provider like OpenAI or Anthropic.
 */
export class AIService {
    /**
     * Generates a personalized response based on the lead's information and their last message.
     * @param leadName - The name of the lead.
     * @param prospectReply - The content of the reply received from the prospect.
     * @returns A promise that resolves to the generated response string.
     */
    async generateResponse(leadName: string, prospectReply: string): Promise<string> {
        console.log(`[AI] Generating response for ${leadName} based on: "${prospectReply}"`);

        // Simulate AI delay from env or default to 1500ms
        const delay = parseInt(process.env.AI_DELAY_MS || '1500', 10);
        await new Promise(resolve => setTimeout(resolve, delay));

        return `Hi ${leadName}, thanks for getting back to us! That sounds interesting. Would you be open to a quick 10-minute chat next Tuesday to dive deeper?`;
    }
}

export const aiService = new AIService();
