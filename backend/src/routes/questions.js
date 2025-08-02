const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management and Q&A
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Ask a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, questionController.create);

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: List questions with filters and search
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [upvotes, recent, answers]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of questions
 */
router.get('/', questionController.list);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Not found
 */
router.get('/:id', questionController.get);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Edit a question (owner only)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authMiddleware, questionController.update);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question (owner or admin)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authMiddleware, questionController.remove);

/**
 * @swagger
 * /questions/{id}/vote:
 *   post:
 *     summary: Upvote or downvote a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [up, down]
 *     responses:
 *       200:
 *         description: Vote registered
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/vote', authMiddleware, questionController.vote);

/**
 * @swagger
 * /questions/{id}/answer:
 *   post:
 *     summary: Add an answer to a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer added
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/answer', authMiddleware, questionController.answer);

module.exports = router; 