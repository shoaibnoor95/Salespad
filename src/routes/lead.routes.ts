import express from 'express';
import * as leadController from '../controllers/lead.controller';

const router = express.Router();

/**
 * @swagger
 * /lead:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created lead.
 *       400:
 *         description: Missing required fields (Name and at least one contact method).
 *       500:
 *         description: Internal Server Error.
 */
router.post('/lead', leadController.createLead);

/**
 * @swagger
 * /send:
 *   post:
 *     summary: Send an outbound message
 *     tags: [Outreach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *             properties:
 *               leadId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message enqueued for sending.
 *       400:
 *         description: Validation Error (Missing leadId).
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/send', leadController.sendOutreach);

/**
 * @swagger
 * /reply:
 *   post:
 *     summary: Simulate a prospect reply
 *     tags: [Outreach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - content
 *             properties:
 *               leadId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply received and logged.
 *       400:
 *         description: Validation Error (Missing leadId or content).
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/reply', leadController.handleReply);

/**
 * @swagger
 * /ai/reply:
 *   post:
 *     summary: Generate an AI response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *             properties:
 *               leadId:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI reply generated and enqueued.
 *       400:
 *         description: Validation Error (Missing leadId).
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/ai/reply', leadController.generateAIReply);

/**
 * @swagger
 * /lead/{id}:
 *   get:
 *     summary: Get lead details and history
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lead ID
 *     responses:
 *       200:
 *         description: The lead details.
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/lead/:id', leadController.getLead);

export const leadRoutes = router;
