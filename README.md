# SalesPad Outbound Automation Prototype

This repository contains the Tech Lead screening task submission for SalesPad. It is a working prototype of the outbound sales automation backend.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation
```bash
npm install
```

### Running the Server
```bash
npm start
```
The server will start at `http://localhost:3000`.

### 3. Verify the Prototype
Run the provided verification script to see the end-to-end flow:
```bash
./verify.ps1
```

### 4. API Documentation
Swagger UI is available for interactive API testing:
- **URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Spec**: Defined in `src/routes/lead.routes.ts` via JSDoc.
Or use `curl` to interact with the endpoints:
- `POST /lead`
- `POST /send`
- `POST /reply`
- `POST /ai/reply`
- `GET /lead/:id`

## 📂 Project Structure
- `src/`
    - `index.js`: Main entry point.
    - `controllers/`: Request handlers (LeadController).
    - `models/`: Data persistence layer (LeadModel).
    - `routes/`: API route definitions.
    - `services/`: Business logic (Queue, AI).
- `ARCHITECTURE.md`: High-level system design and multi-channel strategy.
- `DAILY_REPORT.md`: Sample daily update simulation.
- `LOOM_SCRIPT.md`: Outline for the video explainer.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: In-Memory Mock Store (for portability)
- **Queue**: In-Memory Async Mock Queue

*Note: The implementation uses standard JavaScript to ensure maximum compatibility and ease of execution in various environments.*
