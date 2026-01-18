import express from 'express';
import 'dotenv/config'; // Load environment variables
import swaggerUi from 'swagger-ui-express';
import { leadRoutes } from './routes/lead.routes';
import { swaggerSpec } from './config/swagger';

const app = express();
// Enable JSON body parsing
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`[SalesPad] Swagger docs available at http://localhost:${PORT}/api-docs`);

// Register API routes
app.use('/', leadRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`[SalesPad] Prototype running at http://localhost:${PORT}`);
});
