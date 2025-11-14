import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Legal Flow API',
      version: '1.0.0',
      description: 'AI-powered legal document generation API',
      contact: {
        name: 'Legal Flow Support',
        email: 'support@legalflow.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: '/api',
        description: 'Production server (Vercel)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            username: { type: 'string', example: 'johndoe' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            username: { type: 'string', example: 'johndoe' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'doc_123' },
            userId: { type: 'integer', example: 1 },
            documentType: { type: 'string', example: 'contract' },
            status: { type: 'string', enum: ['draft', 'completed', 'pending'], example: 'draft' },
            data: { type: 'string', example: '{"field1": "value1"}' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LegalCase: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'case_123' },
            userId: { type: 'integer', example: 1 },
            caseType: { type: 'string', example: 'bankruptcy' },
            state: { type: 'string', example: 'CA' },
            zipCode: { type: 'string', example: '90210' },
            status: { type: 'string', enum: ['open', 'closed', 'pending'], example: 'open' },
            caseData: { type: 'string', example: '{"details": "case details"}' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ContactInquiry: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            service: { type: 'string', example: 'bankruptcy' },
            message: { type: 'string', example: 'I need help with...' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' }
          }
        },
        Health: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            database: { type: 'boolean', example: true }
          }
        }
      }
    }
  },
  apis: ['./src/index.ts'] // Path to the API files
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Legal Flow API Documentation'
  }));
  
  // JSON endpoint for the spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export default specs;
