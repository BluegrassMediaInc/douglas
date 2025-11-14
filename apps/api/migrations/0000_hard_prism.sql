CREATE TABLE "case_timelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" text NOT NULL,
	"event_type" text NOT NULL,
	"event_description" text NOT NULL,
	"due_date" timestamp NOT NULL,
	"reminder_sent" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"case_type" text NOT NULL,
	"state" text NOT NULL,
	"document_name" text NOT NULL,
	"template_path" text NOT NULL,
	"required_fields" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"document_type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"data" text NOT NULL,
	"last_modified" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "legal_cases" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"case_type" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"status" text DEFAULT 'intake' NOT NULL,
	"case_data" text NOT NULL,
	"suggested_documents" text,
	"attorney_review_requested" boolean DEFAULT false,
	"attorney_review_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pdf_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"run_at" timestamp DEFAULT now() NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "case_timelines" ADD CONSTRAINT "case_timelines_case_id_legal_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."legal_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_cases" ADD CONSTRAINT "legal_cases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;