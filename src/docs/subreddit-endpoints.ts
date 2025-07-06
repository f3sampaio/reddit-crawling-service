/**
 * @swagger
 * /api/subreddit/{subreddit}:
 *   get:
 *     summary: Get subreddit information
 *     description: Retrieves detailed information about a specific subreddit including member count, online users, title, description, and rules.
 *     tags: [Subreddit]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the subreddit to fetch information for
 *         example: programming
 *     responses:
 *       200:
 *         description: Successfully retrieved subreddit information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubredditInfo'
 *             example:
 *               name: programming
 *               title: Programming
 *               description: Computer Programming
 *               members: 5000000
 *               online: 1500
 *               rules: ["Be respectful", "No spam", "Follow Reddit's content policy", "Use descriptive titles"]
 *       400:
 *         description: Bad request - missing or invalid subreddit name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Missing or invalid subreddit name.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Failed to fetch subreddit info.
 */ 