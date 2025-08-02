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

module.exports = router; 