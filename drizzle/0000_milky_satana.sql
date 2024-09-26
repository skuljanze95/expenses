DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income', 'investment', 'saving');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_history" (
	"balance" numeric NOT NULL,
	"balance_id" text NOT NULL,
	"expense_amount" numeric NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"income_amount" numeric NOT NULL,
	"investment_amount" numeric NOT NULL,
	"savings_amount" numeric NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "balance" (
	"balance" numeric DEFAULT '0.0' NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budget" (
	"amount" numeric DEFAULT '0.0' NOT NULL,
	"category_id" text,
	"id" text PRIMARY KEY NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recurring_transaction" (
	"amount" numeric,
	"category_id" text,
	"day" integer NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_draft" (
	"amount" numeric,
	"category_id" text,
	"date" timestamp DEFAULT now(),
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"amount" numeric NOT NULL,
	"category_id" text,
	"date" timestamp DEFAULT now(),
	"id" text PRIMARY KEY NOT NULL,
	"recurring_transaction_id" text,
	"title" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_history" ADD CONSTRAINT "account_history_balance_id_balance_id_fk" FOREIGN KEY ("balance_id") REFERENCES "public"."balance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget" ADD CONSTRAINT "budget_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recurring_transaction" ADD CONSTRAINT "recurring_transaction_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_draft" ADD CONSTRAINT "transaction_draft_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_category_unique" ON "budget" USING btree ("userId","category_id");