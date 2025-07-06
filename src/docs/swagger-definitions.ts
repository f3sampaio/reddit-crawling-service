/**
 * @swagger
 * components:
 *   schemas:
 *     SubredditInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the subreddit
 *           example: programming
 *         title:
 *           type: string
 *           description: The title of the subreddit
 *           example: Programming
 *         description:
 *           type: string
 *           description: The description of the subreddit
 *           example: Computer Programming
 *         members:
 *           type: number
 *           description: Number of members in the subreddit
 *           example: 5000000
 *         online:
 *           type: number
 *           description: Number of users currently online
 *           example: 1500
 *         rules:
 *           type: array
 *           description: List of subreddit rules
 *           items:
 *             type: string
 *           example: ["Be respectful", "No spam", "Follow Reddit's content policy"]
 *       required: [name, title, description, members, online, rules]
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: Missing or invalid subreddit name.
 *       required: [error]
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00.000Z
 *         service:
 *           type: string
 *           example: Reddit Crawling Service
 *       required: [status, timestamp, service]
 */ 