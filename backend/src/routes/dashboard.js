const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and analytics
 */

/**
 * @swagger
 * /dashboard/admin/overview:
 *   get:
 *     summary: Get admin overview stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview stats
 *       403:
 *         description: Forbidden
 */
router.get('/admin/overview', authMiddleware, roleMiddleware('admin'), dashboardController.adminOverview);

/**
 * @swagger
 * /dashboard/agent/overview:
 *   get:
 *     summary: Get agent-specific stats and workload
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent stats
 *       403:
 *         description: Forbidden
 */
router.get('/agent/overview', authMiddleware, roleMiddleware('agent', 'admin'), dashboardController.agentOverview);

/**
 * @swagger
 * /dashboard/user/stats:
 *   get:
 *     summary: Get user-specific stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats
 *       401:
 *         description: Unauthorized
 */
router.get('/user/stats', authMiddleware, dashboardController.userStats);

/**
 * @swagger
 * /dashboard/tickets:
 *   get:
 *     summary: Get tickets with filters and pagination
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of tickets per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by ticket status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: Tickets list with pagination
 *       401:
 *         description: Unauthorized
 */
router.get('/tickets', authMiddleware, dashboardController.getTickets);

module.exports = router; 