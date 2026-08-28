CREATE TYPE "public"."account_type" AS ENUM('cash', 'checking', 'savings', 'credit', 'investment');--> statement-breakpoint
CREATE TYPE "public"."category_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense', 'transfer');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "account_type" NOT NULL,
	"currency" varchar(3) NOT NULL,
	"opening_balance" numeric(19, 4) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_name_not_blank" CHECK (length(trim("accounts"."name")) > 0),
	CONSTRAINT "accounts_currency_iso_format" CHECK ("accounts"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "category_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_not_blank" CHECK (length(trim("categories"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(19, 4) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"account_id" uuid NOT NULL,
	"transfer_account_id" uuid,
	"category_id" uuid,
	"occurred_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_amount_positive" CHECK ("transactions"."amount" > 0),
	CONSTRAINT "transactions_currency_iso_format" CHECK ("transactions"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "transactions_shape_by_type" CHECK ((
        ("transactions"."type" = 'transfer' AND "transactions"."transfer_account_id" IS NOT NULL AND "transactions"."category_id" IS NULL AND "transactions"."transfer_account_id" <> "transactions"."account_id")
        OR
        ("transactions"."type" IN ('income', 'expense') AND "transactions"."transfer_account_id" IS NULL AND "transactions"."category_id" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transfer_account_id_accounts_id_fk" FOREIGN KEY ("transfer_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_name_unique" ON "accounts" USING btree (lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_type_unique" ON "categories" USING btree (lower("name"),"type");--> statement-breakpoint
CREATE INDEX "transactions_account_occurred_at_idx" ON "transactions" USING btree ("account_id","occurred_at");--> statement-breakpoint
CREATE INDEX "transactions_transfer_account_idx" ON "transactions" USING btree ("transfer_account_id");--> statement-breakpoint
CREATE INDEX "transactions_category_idx" ON "transactions" USING btree ("category_id");