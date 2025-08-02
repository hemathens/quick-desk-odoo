const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 */

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', authMiddleware, ticketController.getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created
 */
router.post('/', authMiddleware, ticketController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Update ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated
 */
router.patch('/:id', authMiddleware, ticketController.updateTicket);

/**
 * @swagger
 * /tickets/{id}/comments:
 *   post:
 *     summary: Add comment to ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               isInternal:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/:id/comments', authMiddleware, ticketController.addComment);

/**
 * @swagger
 * /tickets/{id}/assign:
 *   patch:
 *     summary: Assign ticket to an agent
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket assigned
 */
router.patch('/:id/assign', authMiddleware, roleMiddleware('admin', 'agent'), ticketController.assignTicket);

/**
 * @swagger
 * /tickets/agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get('/agents', authMiddleware, roleMiddleware('admin', 'agent'), ticketController.getAgents);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ticketController.deleteTicket);

module.exports = router;

