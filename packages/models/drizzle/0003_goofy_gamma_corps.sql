CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"month" date NOT NULL,
	"currency" varchar(3) NOT NULL,
	"limit_amount" numeric(19, 4) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "budgets_limit_amount_positive" CHECK ("budgets"."limit_amount" > 0),
	CONSTRAINT "budgets_currency_iso_format" CHECK ("budgets"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "budgets_month_is_first_of_month" CHECK (date_trunc('month', "budgets"."month") = "budgets"."month")
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_month_unique" ON "budgets" USING btree ("category_id","month");