import { pgTable, serial, text, integer, timestamp, boolean, pgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { 
  CASE_TYPE_KEYS, 
  CASE_STATUS_KEYS, 
  DOCUMENT_STATUS_KEYS, 
  TIMELINE_EVENT_TYPE_KEYS,
  US_STATE_KEYS,
  type CaseTypeKey,
  type CaseStatusKey,
  type DocumentStatusKey,
  type TimelineEventTypeKey,
  type USStateKey
} from "../constants/index.js";

// Define the app schema
export const appSchema = pgSchema("app");

export const pdfJobs = appSchema.table("pdf_jobs", {
  id:          serial("id").primaryKey(),
  documentId:  integer("document_id").notNull(),
  runAt:       timestamp("run_at").defaultNow().notNull(),
  priority:    integer("priority").default(0).notNull(),
  attempts:    integer("attempts").default(0).notNull(),
  maxAttempts: integer("max_attempts").default(5).notNull(),
  lastError:   text("last_error"),
  createdAt:   timestamp("created_at").defaultNow().notNull()
});



export const users = appSchema.table("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactInquiries = appSchema.table("contact_inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

// Document schema
export const documents = appSchema.table("documents", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(),
  status: text("status", { enum: DOCUMENT_STATUS_KEYS }).notNull().default("draft"),
  data: text("data").notNull(), // JSON string
  lastModified: timestamp("last_modified").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});



// Legal case schema for workflow management
export const legalCases = appSchema.table("legal_cases", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  caseType: text("case_type", { enum: CASE_TYPE_KEYS }).notNull(),
  state: text("state", { enum: US_STATE_KEYS }).notNull(),
  zipCode: text("zip_code").notNull(),
  status: text("status", { enum: CASE_STATUS_KEYS }).notNull().default("intake"),
  caseData: text("case_data").notNull(), // JSON string with all case details
  suggestedDocuments: text("suggested_documents"), // JSON array of suggested document IDs
  attorneyReviewRequested: boolean("attorney_review_requested").default(false),
  attorneyReviewId: text("attorney_review_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timeline tracking for deadlines
export const caseTimelines = appSchema.table("case_timelines", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").references(() => legalCases.id).notNull(),
  eventType: text("event_type", { enum: TIMELINE_EVENT_TYPE_KEYS }).notNull(),
  eventDescription: text("event_description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  reminderSent: boolean("reminder_sent").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document templates registry
export const documentTemplates = appSchema.table("document_templates", {
  id: text("id").primaryKey(),
  caseType: text("case_type", { enum: CASE_TYPE_KEYS }).notNull(),
  state: text("state", { enum: US_STATE_KEYS }).notNull(),
  documentName: text("document_name").notNull(),
  templatePath: text("template_path").notNull(),
  requiredFields: text("required_fields").notNull(), // JSON array of required field names
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Zod schemas with proper validation
export const insertLegalCaseSchema = createInsertSchema(legalCases, {
  caseType: z.enum(CASE_TYPE_KEYS as [string, ...string[]]),
  state: z.enum(US_STATE_KEYS as [string, ...string[]]),
  status: z.enum(CASE_STATUS_KEYS as [string, ...string[]]),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCaseTimelineSchema = createInsertSchema(caseTimelines, {
  eventType: z.enum(TIMELINE_EVENT_TYPE_KEYS as [string, ...string[]]),
}).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents, {
  status: z.enum(DOCUMENT_STATUS_KEYS as [string, ...string[]]),
}).omit({
  createdAt: true,
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates, {
  caseType: z.enum(CASE_TYPE_KEYS as [string, ...string[]]),
  state: z.enum(US_STATE_KEYS as [string, ...string[]]),
}).omit({
  createdAt: true,
});

// Custom validation schemas for API endpoints
export const caseTypeValidation = z.enum(CASE_TYPE_KEYS as [string, ...string[]]);
export const caseStatusValidation = z.enum(CASE_STATUS_KEYS as [string, ...string[]]);
export const documentStatusValidation = z.enum(DOCUMENT_STATUS_KEYS as [string, ...string[]]);
export const timelineEventTypeValidation = z.enum(TIMELINE_EVENT_TYPE_KEYS as [string, ...string[]]);
export const usStateValidation = z.enum(US_STATE_KEYS as [string, ...string[]]);

export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCases.$inferSelect;
export type InsertCaseTimeline = z.infer<typeof insertCaseTimelineSchema>;
export type CaseTimeline = typeof caseTimelines.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
