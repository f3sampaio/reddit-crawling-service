import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reddit Crawling Service API',
      version: '1.0.0',
      description: 'A service for crawling and retrieving subreddit information',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/docs/*.ts', './src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options); 