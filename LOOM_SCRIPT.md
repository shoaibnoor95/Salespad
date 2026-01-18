# Loom Script: Tech Lead Screening Task

## Intro (45s)
"Hi Adam and the SalesPad team. I'm Shoaib. Today, I want to walk you through the prototype I've built for our outbound sales automation platform. My goal was to build something that isn't just code, but a scalable foundation for a real product. I'll show you how it works and, more importantly, *why* I built it this way."

## Architecture & Flow (2m)
"First, let's talk about the design. Think of this system like a high-end restaurant kitchen.
- **The Waiter (API)**: This is our Node.js backend. It takes orders (leads) from customers instantly.
- **The Ticket Line (Queue)**: Instead of the chef trying to cook everything at once and burning the food, we use a **Queue System**. When a lead comes in, we put a 'ticket' on the line. This ensures that even if we have 10,000 leads come in at once, the system doesn't crash—it just works through them one by one.
- **The Chefs (Workers)**: We have specialized workers for sending Emails, generating AI replies, and logging data.
- **The Filing Cabinet (PostgreSQL)**: We upgraded the memory to a proper PostgreSQL database. This is our permanent record store, handled by Prisma, ensuring we never lose a customer's history."

"The flow is simple: A lead enters via a form or ad -> The system validates them -> We check if they need an email or WhatsApp message -> The AI drafts a personalized note -> And we send it out, logging every single step."

## Key Decisions (1.5m)
"I made a few specific technical choices to make this future-proof:
1.  **The 'Universal Adapter' (Adapter Pattern)**:
    Just like a travel adapter lets you plug your phone into any wall socket in the world, I built an 'Adapter' for our messages. Right now, it sends Emails. But if tomorrow you want to send WhatsApp or LinkedIn messages, we just plug in a new 'adapter' without rewriting the whole system. 
2.  **Safety First (Database Limits)**:
    I added strict rules to the database—like making sure two leads can't share the same email. This acts like a bouncer at the door, keeping our data clean and preventing embarrassing double-messages to prospects.
3.  **Reliability (Automated Testing)**:
    I didn't just write code; I wrote tests that *check* the code. Before I hand this over, I run a command that simulates a user creating a lead and sending a message. It passes 100% of the time, so you can trust it works."

## What I'd Improve (1m)
"This is a solid prototype, but for the next version, I would add:
1.  **Smart Retries**: If a prospect's email server is down, we should wait 5 minutes and try again automatically.
2.  **Lead Scoring**: Using AI to tell the sales rep, 'Hey, this person is 90% likely to buy, call them now!' vs 'This person is just looking.'
3.  **Team Accounts**: Currently, it's single-player. I'd add features for whole sales teams to collaborate on the same list."

## Outro (30s)
"Thanks for watching. I wanted to deliver something that shows not just technical skill, but product thinking—building a system that is robust, scalable, and ready for whatever the business needs next. I'm looking forward to your feedback!"
