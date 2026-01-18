# Loom Script: Tech Lead Screening Task

## Intro (30s)
"Hi Adam and the SalesPad team. I'm Shoaib, and today I'm walking you through the architecture and prototype I've built for our outbound sales automation platform."

## Architecture & Flow (1.5m)
"The core of our system is a Modular Monolith. We're using Node.js and TypeScript for the backend.
The flow starts when a lead is captured. Once a lead is in the system, we enqueue an outbound message job. 
We're using a queue-based system (BullMQ in a production setting) to handle this asynchronously. This ensures that even if our email provider or AI service is slow, our main API remains responsive.
When a prospect replies, we handle that via a webhook, log the event, and then trigger an AI generation job to draft a personalized response."

## Key Decisions (1m)
"One key decision was using the **Adapter Pattern** for our outreach channels. This makes it trivial to add WhatsApp or LinkedIn tomorrow without touching our core orchestration logic. 
I also prioritized **Event Logging** for every state transition. In a multi-channel system, observability is everything—you need to know exactly why a lead stopped moving."

## What I'd Improve (45s)
"If I had more time, I'd:
1. Implement a more robust **Retry Strategy** with jitter to handle rate limits.
2. Add a **Lead Scoring service** that uses AI to prioritize which replies need manual human intervention vs automated follow-up.
3. Integrate real multi-tenant support for different sales teams."

## Outro (15s)
"Thanks for watching. I've focused on clean, modular code that's ready to scale. Looking forward to your feedback!"
