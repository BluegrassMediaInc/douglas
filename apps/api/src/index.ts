import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import {
  UserService,
  DocumentService,
  LegalCaseService,
  DocumentTemplateService,
  ContactInquiryService,
  PdfJobService,
  DatabaseUtils
} from "./db/database.js";
import {
  caseTypeValidation,
  caseStatusValidation,
  documentStatusValidation,
  timelineEventTypeValidation,
  usStateValidation
} from "./db/schema.js";
import { setupSwagger } from "./swagger.js";
import { 
  CASE_TYPES, 
  CASE_STATUS, 
  DOCUMENT_STATUS,
  TIMELINE_EVENT_TYPES,
  US_STATES,
  CASE_TYPE_DISPLAY_NAMES,
  CASE_STATUS_DISPLAY_NAMES,
  US_STATE_NAMES
} from "./constants/index.js";
import { z } from "zod";

const app = express();


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Initialize Stripe

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-07-30.basil",
});

// Validation schemas for API endpoints
const createCaseSchema = z.object({
  id: z.string().min(1),
  caseType: caseTypeValidation,
  state: usStateValidation,
  zipCode: z.string().min(1),
  caseData: z.union([z.string(), z.object({}).passthrough()])
});

const updateCaseSchema = z.object({
  caseType: caseTypeValidation.optional(),
  state: usStateValidation.optional(),
  zipCode: z.string().optional(),
  status: caseStatusValidation.optional(),
  caseData: z.union([z.string(), z.object({}).passthrough()]).optional()
});

const createDocumentSchema = z.object({
  id: z.string().min(1),
  documentType: z.string().min(1),
  status: documentStatusValidation.optional(),
  data: z.union([z.string(), z.object({}).passthrough()])
});

const updateDocumentSchema = z.object({
  documentType: z.string().optional(),
  status: documentStatusValidation.optional(),
  data: z.union([z.string(), z.object({}).passthrough()]).optional()
});

const createTimelineEventSchema = z.object({
  caseId: z.string().min(1),
  eventType: timelineEventTypeValidation,
  eventDescription: z.string().min(1),
  dueDate: z.string().datetime()
});

const createTemplateSchema = z.object({
  id: z.string().min(1),
  caseType: caseTypeValidation,
  state: usStateValidation,
  documentName: z.string().min(1),
  templatePath: z.string().min(1),
  requiredFields: z.union([z.string(), z.array(z.string())])
});

// CORS configuration
const allowedOrigins = [
  // Development
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Production domains
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL,
  // Vercel deployments (both production and preview)
  /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
    if (!origin) return callback(null, true);
    
    // In production on Vercel, requests from the same domain won't have CORS issues
    // But we still need to handle preview deployments and custom domains
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Constants endpoints for frontend use
/**
 * @swagger
 * /constants:
 *   get:
 *     summary: Get all system constants
 *     tags: [Constants]
 *     responses:
 *       200:
 *         description: System constants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 caseTypes:
 *                   type: object
 *                 caseStatuses:
 *                   type: object
 *                 usStates:
 *                   type: object
 */
app.get("/constants", (req, res) => {
  res.json({
    caseTypes: CASE_TYPES,
    caseStatuses: CASE_STATUS,
    documentStatuses: DOCUMENT_STATUS,
    timelineEventTypes: TIMELINE_EVENT_TYPES,
    usStates: US_STATES
  });
});

/**
 * @swagger
 * /constants/case-types:
 *   get:
 *     summary: Get case type constants
 *     tags: [Constants]
 *     responses:
 *       200:
 *         description: Case types retrieved successfully
 */
app.get("/constants/case-types", (req, res) => {
  res.json(CASE_TYPES);
});

/**
 * @swagger
 * /constants/case-statuses:
 *   get:
 *     summary: Get case status constants
 *     tags: [Constants]
 *     responses:
 *       200:
 *         description: Case statuses retrieved successfully
 */
app.get("/constants/case-statuses", (req, res) => {
  res.json(CASE_STATUS);
});

/**
 * @swagger
 * /constants/us-states:
 *   get:
 *     summary: Get US state constants
 *     tags: [Constants]
 *     responses:
 *       200:
 *         description: US states retrieved successfully
 */
app.get("/constants/us-states", (req, res) => {
  res.json(US_STATES);
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request (missing fields, user exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required" });
    }

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await UserService.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await UserService.createUser({
      email,
      username,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.status(201).json({ 
      user: { id: user.id, email: user.email, username: user.username },
      token 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ 
      user: { id: user.id, email: user.email, username: user.username },
      token 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/users/me", authenticateToken, async (req: any, res) => {
  try {
    const user = await UserService.getUserProfile(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contact inquiry endpoints
app.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, message } = req.body;
    
    if (!firstName || !lastName || !email || !service || !message) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }
    
    const inquiry = await ContactInquiryService.createInquiry({
      firstName,
      lastName,
      email,
      phone: phone || null,
      service,
      message
    });
    
    res.status(201).json(inquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Document endpoints
app.get("/documents", authenticateToken, async (req: any, res) => {
  try {
    const userDocuments = await DocumentService.getUserDocuments(req.user.userId);
    res.json(userDocuments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/documents", authenticateToken, async (req: any, res) => {
  try {
    const { id, documentType, data, status } = req.body;
    
    if (!id || !documentType || !data) {
      return res.status(400).json({ error: "ID, document type, and data are required" });
    }
    
    const document = await DocumentService.createDocument({
      id,
      userId: req.user.userId,
      documentType,
      status: status || 'draft',
      data: typeof data === 'string' ? data : JSON.stringify(data)
    });
    
    res.status(201).json(document);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/documents/:id", authenticateToken, async (req: any, res) => {
  try {
    const document = await DocumentService.getDocument(req.params.id, req.user.userId);
    
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.json(document);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/documents/:id", authenticateToken, async (req: any, res) => {
  try {
    const { documentType, data, status } = req.body;
    
    const document = await DocumentService.updateDocument(req.params.id, req.user.userId, {
      documentType,
      data: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
      status
    });
    
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.json(document);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/documents/:id", authenticateToken, async (req: any, res) => {
  try {
    const success = await DocumentService.deleteDocument(req.params.id, req.user.userId);
    
    if (!success) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Legal case endpoints
app.get("/cases", authenticateToken, async (req: any, res) => {
  try {
    const userCases = await LegalCaseService.getUserCases(req.user.userId);
    res.json(userCases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/cases", authenticateToken, async (req: any, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createCaseSchema.parse(req.body);
    
    const legalCase = await LegalCaseService.createCase({
      ...validatedData,
      userId: req.user.userId,
      caseData: typeof validatedData.caseData === 'string' ? validatedData.caseData : JSON.stringify(validatedData.caseData)
    });
    
    res.status(201).json(legalCase);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/cases/:id", authenticateToken, async (req: any, res) => {
  try {
    const legalCase = await LegalCaseService.getCase(req.params.id, req.user.userId);
    
    if (!legalCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json(legalCase);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/cases/:id", authenticateToken, async (req: any, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = updateCaseSchema.parse(req.body);
    
    const legalCase = await LegalCaseService.updateCase(req.params.id, req.user.userId, {
      ...validatedData,
      caseData: validatedData.caseData ? (typeof validatedData.caseData === 'string' ? validatedData.caseData : JSON.stringify(validatedData.caseData)) : undefined
    });
    
    if (!legalCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json(legalCase);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Document templates endpoints
app.get("/templates", async (req, res) => {
  try {
    const { caseType, state } = req.query;
    
    let templates;
    
    // Validate query parameters if provided
    if (caseType) {
      const validatedCaseType = caseTypeValidation.parse(caseType);
      if (state) {
        const validatedState = usStateValidation.parse(state);
        templates = await DocumentTemplateService.getTemplatesByCaseTypeAndState(
          validatedCaseType, 
          validatedState
        );
      } else {
        templates = await DocumentTemplateService.getTemplatesByCaseType(validatedCaseType);
      }
    } else if (state) {
      const validatedState = usStateValidation.parse(state);
      templates = await DocumentTemplateService.getTemplatesByState(validatedState);
    } else {
      templates = await DocumentTemplateService.getActiveTemplates();
    }
    
    res.json(templates);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: "Invalid query parameters", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/templates/:id", async (req, res) => {
  try {
    const template = await DocumentTemplateService.getTemplate(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PDF Jobs endpoints
app.get("/jobs", async (_, res) => {
  try {
    const jobs = await PdfJobService.getAllJobs(50);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const { documentId, priority } = req.body;
    
    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required" });
    }
    
    const job = await PdfJobService.createJob(documentId, priority);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await PdfJobService.getJob(parseInt(req.params.id));
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin/Stats endpoints
app.get("/admin/stats", authenticateToken, async (req: any, res) => {
  try {
    // TODO: Add admin role check
    const stats = await DatabaseUtils.getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Payment endpoints
/**
 * @swagger
 * /payment/create-intent:
 *   post:
 *     summary: Create payment intent for document purchase
 *     description: Creates a Stripe payment intent for one-time document payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount in cents
 *               currency:
 *                 type: string
 *                 description: Currency code (e.g., 'usd')
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
app.post("/payment/create-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      client_secret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Payment intent creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /payment/send-document:
 *   post:
 *     summary: Send document via email after successful payment
 *     description: Sends the generated document and payment receipt via email
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 description: Stripe payment intent ID
 *               documentData:
 *                 type: object
 *                 description: Document generation data
 *               email:
 *                 type: string
 *                 description: Email address to send to
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
app.post("/payment/send-document", async (req, res) => {
  try {
    const { paymentIntentId, documentData, email } = req.body;

    if (!paymentIntentId || !documentData || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Generate document content
    const documentContent = generateDocumentContent(documentData);
    
    // In a real implementation, you would:
    // 1. Send email with document attachment using your email service (SES, SendGrid, etc.)
    // 2. Store payment record in database
    // 3. Log the transaction
    
    // For now, we'll simulate this
    console.log(`Document would be sent to: ${email}`);
    console.log(`Payment confirmed: ${paymentIntentId}`);
    console.log(`Amount: $${paymentIntent.amount / 100}`);

    res.json({
      success: true,
      message: "Document sent successfully",
      paymentDetails: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
    });
  } catch (error: any) {
    console.error("Document sending failed:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /payment/create-order:
 *   post:
 *     summary: Create document order after successful payment
 *     description: Creates an order record for document preparation and delivery within 2 business days
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 description: Stripe payment intent ID
 *               documentData:
 *                 type: object
 *                 description: Document generation data
 *               email:
 *                 type: string
 *                 description: Email address for order confirmation
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
app.post("/payment/create-order", async (req, res) => {
  try {
    const { paymentIntentId, documentData, email } = req.body;

    if (!paymentIntentId || !documentData || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Create order record
    const orderDate = new Date().toISOString();
    const expectedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days from now
    
    // In a real implementation, you would:
    // 1. Store order in database with status "pending"
    // 2. Send order confirmation email
    // 3. Add to document processing queue
    // 4. Set up delivery reminder for 2 days
    
    // For now, we'll simulate this
    console.log(`Order created for: ${email}`);
    console.log(`Payment confirmed: ${paymentIntentId}`);
    console.log(`Amount: $${paymentIntent.amount / 100}`);
    console.log(`Order Date: ${orderDate}`);
    console.log(`Expected Delivery: ${expectedDelivery}`);
    console.log(`Document Type: ${documentData.caseTypeDisplay} for ${documentData.stateDisplay}`);

    res.json({
      success: true,
      message: "Order created successfully",
      orderDetails: {
        orderId: `ORDER_${Date.now()}`, // In real implementation, this would be a proper UUID
        orderDate,
        expectedDelivery,
        status: "pending",
        documentType: documentData.caseTypeDisplay,
        state: documentData.stateDisplay,
      },
      paymentDetails: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /order/status/{orderId}:
 *   get:
 *     summary: Get order status and tracking information
 *     description: Retrieves the current status of a document order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order status retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
app.get("/order/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // In a real implementation, you would:
    // 1. Query database for order by ID
    // 2. Return current status, expected delivery date, etc.
    
    // For now, we'll simulate this based on order age
    const orderNumber = orderId.replace('ORDER_', '');
    const orderTimestamp = parseInt(orderNumber);
    const orderDate = new Date(orderTimestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let status = "pending";
    let statusDisplay = "Being Prepared";
    
    if (daysDiff >= 2) {
      status = "completed";
      statusDisplay = "Delivered";
    } else if (daysDiff >= 1) {
      status = "processing";
      statusDisplay = "Under Review";
    }

    const expectedDelivery = new Date(orderTimestamp + 2 * 24 * 60 * 60 * 1000);

    console.log(`Order status requested for: ${orderId}`);
    console.log(`Status: ${status} (${statusDisplay})`);

    res.json({
      success: true,
      order: {
        orderId,
        status,
        statusDisplay,
        orderDate: orderDate.toISOString(),
        expectedDelivery: expectedDelivery.toISOString(),
        daysRemaining: Math.max(0, 2 - daysDiff),
      },
    });
  } catch (error: any) {
    console.error("Order status lookup failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate document content
function generateDocumentContent(documentData: any): string {
  return `
${documentData.caseTypeDisplay?.toUpperCase() || 'LEGAL DOCUMENT'}
State: ${documentData.stateDisplay || 'N/A'}

Generated on: ${new Date().toLocaleDateString()}

PERSONAL INFORMATION:
- Full Name: ${documentData.personalDetails?.fullName || 'N/A'}
- Email: ${documentData.personalDetails?.email || 'N/A'}
- Phone: ${documentData.personalDetails?.phone || 'N/A'}
- Address: ${documentData.personalDetails?.address || 'N/A'}
- City: ${documentData.personalDetails?.city || 'N/A'}
- ZIP Code: ${documentData.personalDetails?.zipCode || 'N/A'}

DOCUMENT-SPECIFIC DETAILS:
${Object.entries(documentData.documentSpecific || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

---

This is a sample document generated by Legal Flow.
In a production environment, this would contain the actual legal document content
formatted according to ${documentData.stateDisplay || 'applicable'} state requirements.

DISCLAIMER:
This document is generated for demonstration purposes only. 
It does not constitute legal advice. Please consult with a qualified attorney 
for your specific legal needs.
  `;
}

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database connection status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 *       500:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
app.get("/health/db", async (_, res) => {
  try {
    const isConnected = await DatabaseUtils.testConnection();
    res.json({ status: isConnected ? "ok" : "error", database: isConnected });
  } catch (error: any) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

// Export for Vercel serverless functions
export default app;
