import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import pg from "pg";
import { 
  users, 
  documents, 
  legalCases, 
  documentTemplates, 
  contactInquiries, 
  pdfJobs,
  caseTimelines,
  type User,
  type InsertUser,
  type Document,
  type InsertDocument,
  type LegalCase,
  type InsertLegalCase,
  type ContactInquiry,
  type InsertContactInquiry,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type CaseTimeline,
  type InsertCaseTimeline
} from "./schema.js";
import { 
  CASE_TYPE_KEYS,
  CASE_STATUS_KEYS,
  DOCUMENT_STATUS_KEYS,
  TIMELINE_EVENT_TYPE_KEYS,
  US_STATE_KEYS,
  getCaseTypeByKey,
  getCaseStatusByKey
} from "../constants/index.js";

// Database connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// ============================
// USER OPERATIONS
// ============================

export class UserService {
  // Create a new user
  static async createUser(userData: Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Find user by ID
  static async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // Find user by username
  static async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // Update user
  static async updateUser(id: number, updates: Partial<Omit<InsertUser, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Delete user
  static async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Get user profile (without password)
  static async getUserProfile(id: number) {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users).where(eq(users.id, id));
    return user;
  }
}

// ============================
// DOCUMENT OPERATIONS
// ============================

export class DocumentService {
  // Validate document data before operations
  private static validateDocumentData(documentData: Partial<InsertDocument>): void {
    if (documentData.status && !DOCUMENT_STATUS_KEYS.includes(documentData.status as any)) {
      throw new Error(`Invalid document status: ${documentData.status}. Valid statuses: ${DOCUMENT_STATUS_KEYS.join(', ')}`);
    }
  }

  // Create a new document
  static async createDocument(documentData: Omit<InsertDocument, 'createdAt' | 'lastModified'>): Promise<Document> {
    this.validateDocumentData(documentData);
    
    const [document] = await db.insert(documents).values({
      ...documentData,
      data: typeof documentData.data === 'string' ? documentData.data : JSON.stringify(documentData.data)
    }).returning();
    return document;
  }

  // Get all documents for a user
  static async getUserDocuments(userId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  // Get a specific document by ID (with user check)
  static async getDocument(id: string, userId: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
    return document;
  }

  // Update document
  static async updateDocument(id: string, userId: number, updates: Partial<Omit<InsertDocument, 'id' | 'userId' | 'createdAt'>>): Promise<Document | undefined> {
    this.validateDocumentData(updates);
    
    const [document] = await db.update(documents)
      .set({ 
        ...updates, 
        data: updates.data ? (typeof updates.data === 'string' ? updates.data : JSON.stringify(updates.data)) : undefined,
        lastModified: new Date() 
      })
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return document;
  }

  // Delete document
  static async deleteDocument(id: string, userId: number): Promise<boolean> {
    const result = await db.delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Get documents by type
  static async getDocumentsByType(userId: number, documentType: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.documentType, documentType)));
  }

  // Get documents by status
  static async getDocumentsByStatus(userId: number, status: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.status, status)));
  }

  // Mark document as completed
  static async completeDocument(id: string, userId: number): Promise<Document | undefined> {
    const [document] = await db.update(documents)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        lastModified: new Date()
      })
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return document;
  }
}

// ============================
// LEGAL CASE OPERATIONS
// ============================

export class LegalCaseService {
  // Validate case data before operations
  private static validateCaseData(caseData: Partial<InsertLegalCase>): void {
    if (caseData.caseType && !CASE_TYPE_KEYS.includes(caseData.caseType as any)) {
      throw new Error(`Invalid case type: ${caseData.caseType}. Valid types: ${CASE_TYPE_KEYS.join(', ')}`);
    }
    if (caseData.status && !CASE_STATUS_KEYS.includes(caseData.status as any)) {
      throw new Error(`Invalid case status: ${caseData.status}. Valid statuses: ${CASE_STATUS_KEYS.join(', ')}`);
    }
    if (caseData.state && !US_STATE_KEYS.includes(caseData.state as any)) {
      throw new Error(`Invalid state: ${caseData.state}. Valid states: ${US_STATE_KEYS.join(', ')}`);
    }
  }

  // Create a new legal case
  static async createCase(caseData: Omit<InsertLegalCase, 'createdAt' | 'updatedAt'>): Promise<LegalCase> {
    this.validateCaseData(caseData);
    
    const [legalCase] = await db.insert(legalCases).values({
      ...caseData,
      caseData: typeof caseData.caseData === 'string' ? caseData.caseData : JSON.stringify(caseData.caseData)
    }).returning();
    return legalCase;
  }

  // Get all cases for a user
  static async getUserCases(userId: number): Promise<LegalCase[]> {
    return await db.select().from(legalCases).where(eq(legalCases.userId, userId));
  }

  // Get a specific case by ID (with user check)
  static async getCase(id: string, userId: number): Promise<LegalCase | undefined> {
    const [legalCase] = await db.select().from(legalCases)
      .where(and(eq(legalCases.id, id), eq(legalCases.userId, userId)));
    return legalCase;
  }

  // Update case
  static async updateCase(id: string, userId: number, updates: Partial<Omit<InsertLegalCase, 'id' | 'userId' | 'createdAt'>>): Promise<LegalCase | undefined> {
    this.validateCaseData(updates);
    
    const [legalCase] = await db.update(legalCases)
      .set({ 
        ...updates,
        caseData: updates.caseData ? (typeof updates.caseData === 'string' ? updates.caseData : JSON.stringify(updates.caseData)) : undefined,
        updatedAt: new Date() 
      })
      .where(and(eq(legalCases.id, id), eq(legalCases.userId, userId)))
      .returning();
    return legalCase;
  }

  // Delete case
  static async deleteCase(id: string, userId: number): Promise<boolean> {
    const result = await db.delete(legalCases)
      .where(and(eq(legalCases.id, id), eq(legalCases.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Get cases by type
  static async getCasesByType(userId: number, caseType: string): Promise<LegalCase[]> {
    return await db.select().from(legalCases)
      .where(and(eq(legalCases.userId, userId), eq(legalCases.caseType, caseType)));
  }

  // Get cases by status
  static async getCasesByStatus(userId: number, status: string): Promise<LegalCase[]> {
    return await db.select().from(legalCases)
      .where(and(eq(legalCases.userId, userId), eq(legalCases.status, status)));
  }

  // Get cases by state
  static async getCasesByState(userId: number, state: string): Promise<LegalCase[]> {
    return await db.select().from(legalCases)
      .where(and(eq(legalCases.userId, userId), eq(legalCases.state, state)));
  }

  // Update case status
  static async updateCaseStatus(id: string, userId: number, status: string): Promise<LegalCase | undefined> {
    if (!CASE_STATUS_KEYS.includes(status as any)) {
      throw new Error(`Invalid case status: ${status}. Valid statuses: ${CASE_STATUS_KEYS.join(', ')}`);
    }
    
    const [legalCase] = await db.update(legalCases)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(legalCases.id, id), eq(legalCases.userId, userId)))
      .returning();
    return legalCase;
  }

  // Request attorney review
  static async requestAttorneyReview(id: string, userId: number, reviewId?: string): Promise<LegalCase | undefined> {
    const [legalCase] = await db.update(legalCases)
      .set({ 
        attorneyReviewRequested: true,
        attorneyReviewId: reviewId,
        updatedAt: new Date() 
      })
      .where(and(eq(legalCases.id, id), eq(legalCases.userId, userId)))
      .returning();
    return legalCase;
  }
}

// ============================
// DOCUMENT TEMPLATE OPERATIONS
// ============================

export class DocumentTemplateService {
  // Validate template data before operations
  private static validateTemplateData(templateData: Partial<InsertDocumentTemplate>): void {
    if (templateData.caseType && !CASE_TYPE_KEYS.includes(templateData.caseType as any)) {
      throw new Error(`Invalid case type: ${templateData.caseType}. Valid types: ${CASE_TYPE_KEYS.join(', ')}`);
    }
    if (templateData.state && !US_STATE_KEYS.includes(templateData.state as any)) {
      throw new Error(`Invalid state: ${templateData.state}. Valid states: ${US_STATE_KEYS.join(', ')}`);
    }
  }

  // Create a new template (admin only)
  static async createTemplate(templateData: Omit<InsertDocumentTemplate, 'createdAt'>): Promise<DocumentTemplate> {
    this.validateTemplateData(templateData);
    
    const [template] = await db.insert(documentTemplates).values({
      ...templateData,
      requiredFields: typeof templateData.requiredFields === 'string' ? templateData.requiredFields : JSON.stringify(templateData.requiredFields)
    }).returning();
    return template;
  }

  // Get all active templates
  static async getActiveTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true));
  }

  // Get templates by case type
  static async getTemplatesByCaseType(caseType: string): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates)
      .where(and(eq(documentTemplates.caseType, caseType), eq(documentTemplates.isActive, true)));
  }

  // Get templates by state
  static async getTemplatesByState(state: string): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates)
      .where(and(eq(documentTemplates.state, state), eq(documentTemplates.isActive, true)));
  }

  // Get templates by case type and state
  static async getTemplatesByCaseTypeAndState(caseType: string, state: string): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates)
      .where(and(
        eq(documentTemplates.caseType, caseType),
        eq(documentTemplates.state, state),
        eq(documentTemplates.isActive, true)
      ));
  }

  // Get template by ID
  static async getTemplate(id: string): Promise<DocumentTemplate | undefined> {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template;
  }

  // Update template
  static async updateTemplate(id: string, updates: Partial<Omit<InsertDocumentTemplate, 'id' | 'createdAt'>>): Promise<DocumentTemplate | undefined> {
    this.validateTemplateData(updates);
    
    const [template] = await db.update(documentTemplates)
      .set({
        ...updates,
        requiredFields: updates.requiredFields ? 
          (typeof updates.requiredFields === 'string' ? updates.requiredFields : JSON.stringify(updates.requiredFields)) : 
          undefined
      })
      .where(eq(documentTemplates.id, id))
      .returning();
    return template;
  }

  // Deactivate template
  static async deactivateTemplate(id: string): Promise<boolean> {
    const result = await db.update(documentTemplates)
      .set({ isActive: false })
      .where(eq(documentTemplates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Get all templates (including inactive) - admin only
  static async getAllTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates);
  }
}

// ============================
// CONTACT INQUIRY OPERATIONS
// ============================

export class ContactInquiryService {
  // Create a new contact inquiry
  static async createInquiry(inquiryData: Omit<InsertContactInquiry, 'id' | 'createdAt'>): Promise<ContactInquiry> {
    const [inquiry] = await db.insert(contactInquiries).values(inquiryData).returning();
    return inquiry;
  }

  // Get all inquiries (admin only)
  static async getAllInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries);
  }

  // Get inquiry by ID
  static async getInquiry(id: number): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id));
    return inquiry;
  }

  // Get inquiries by service type
  static async getInquiriesByService(service: string): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).where(eq(contactInquiries.service, service));
  }

  // Get inquiries by email
  static async getInquiriesByEmail(email: string): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).where(eq(contactInquiries.email, email));
  }

  // Delete inquiry
  static async deleteInquiry(id: number): Promise<boolean> {
    const result = await db.delete(contactInquiries).where(eq(contactInquiries.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

// ============================
// PDF JOB OPERATIONS
// ============================

export class PdfJobService {
  // Create a new PDF job
  static async createJob(documentId: number, priority: number = 0): Promise<any> {
    const [job] = await db.insert(pdfJobs).values({ documentId, priority }).returning();
    return job;
  }

  // Get all jobs
  static async getAllJobs(limit: number = 50): Promise<any[]> {
    return await db.select().from(pdfJobs).limit(limit);
  }

  // Get job by ID
  static async getJob(id: number): Promise<any | undefined> {
    const [job] = await db.select().from(pdfJobs).where(eq(pdfJobs.id, id));
    return job;
  }

  // Update job attempts
  static async incrementAttempts(id: number, error?: string): Promise<any | undefined> {
    const job = await this.getJob(id);
    if (!job) return undefined;
    
    const [updatedJob] = await db.update(pdfJobs)
      .set({ 
        attempts: job.attempts + 1,
        lastError: error || null
      })
      .where(eq(pdfJobs.id, id))
      .returning();
    return updatedJob;
  }

  // Get pending jobs
  static async getPendingJobs(): Promise<any[]> {
    return await db.select().from(pdfJobs)
      .where(eq(pdfJobs.attempts, 0));
  }

  // Get failed jobs
  static async getFailedJobs(): Promise<any[]> {
    return await db.select().from(pdfJobs);
    // Note: Add condition when we have a 'failed' status or when attempts >= maxAttempts
  }
}

// ============================
// CASE TIMELINE OPERATIONS
// ============================

export class CaseTimelineService {
  // Validate timeline event data before operations
  private static validateTimelineData(eventData: Partial<InsertCaseTimeline>): void {
    if (eventData.eventType && !TIMELINE_EVENT_TYPE_KEYS.includes(eventData.eventType as any)) {
      throw new Error(`Invalid event type: ${eventData.eventType}. Valid types: ${TIMELINE_EVENT_TYPE_KEYS.join(', ')}`);
    }
  }

  // Create a new timeline event
  static async createTimelineEvent(eventData: Omit<InsertCaseTimeline, 'id' | 'createdAt'>): Promise<CaseTimeline> {
    this.validateTimelineData(eventData);
    
    const [event] = await db.insert(caseTimelines).values(eventData).returning();
    return event;
  }

  // Get timeline for a case
  static async getCaseTimeline(caseId: string): Promise<CaseTimeline[]> {
    return await db.select().from(caseTimelines).where(eq(caseTimelines.caseId, caseId));
  }

  // Get upcoming deadlines
  static async getUpcomingDeadlines(days: number = 7): Promise<CaseTimeline[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select().from(caseTimelines);
    // Note: Add date comparison when available in the query builder
  }

  // Mark event as completed
  static async completeEvent(id: number): Promise<CaseTimeline | undefined> {
    const [event] = await db.update(caseTimelines)
      .set({ completedAt: new Date() })
      .where(eq(caseTimelines.id, id))
      .returning();
    return event;
  }

  // Mark reminder as sent
  static async markReminderSent(id: number): Promise<CaseTimeline | undefined> {
    const [event] = await db.update(caseTimelines)
      .set({ reminderSent: true })
      .where(eq(caseTimelines.id, id))
      .returning();
    return event;
  }

  // Delete timeline event
  static async deleteTimelineEvent(id: number): Promise<boolean> {
    const result = await db.delete(caseTimelines).where(eq(caseTimelines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Update timeline event
  static async updateTimelineEvent(id: number, updates: Partial<Omit<InsertCaseTimeline, 'id' | 'caseId' | 'createdAt'>>): Promise<CaseTimeline | undefined> {
    this.validateTimelineData(updates);
    
    const [event] = await db.update(caseTimelines)
      .set(updates)
      .where(eq(caseTimelines.id, id))
      .returning();
    return event;
  }
}

// ============================
// UTILITY FUNCTIONS
// ============================

export class DatabaseUtils {
  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      await db.select().from(users).limit(1);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  // Get database statistics
  static async getStats() {
    try {
      const userCount = await db.select().from(users);
      const documentCount = await db.select().from(documents);
      const caseCount = await db.select().from(legalCases);
      const templateCount = await db.select().from(documentTemplates);
      const inquiryCount = await db.select().from(contactInquiries);

      return {
        users: userCount.length,
        documents: documentCount.length,
        cases: caseCount.length,
        templates: templateCount.length,
        inquiries: inquiryCount.length
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return null;
    }
  }

  // Close database connection
  static async closeConnection(): Promise<void> {
    await pool.end();
  }
}

// Note: Services are already exported above with their class declarations
