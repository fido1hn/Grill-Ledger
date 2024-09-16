CREATE TABLE IF NOT EXISTS "financial_reports" (
	"report_id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" serial NOT NULL,
	"revenue" text NOT NULL,
	"expenses" text NOT NULL,
	"net_profit" text DEFAULT '(revenue - expenses)',
	"report_date" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_items" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"cost_price" text NOT NULL,
	"sale_price" text NOT NULL,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"sale_id" serial NOT NULL,
	"amount" text NOT NULL,
	"payment_method" text NOT NULL,
	"payment_date" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurants" (
	"restaurant_id" serial PRIMARY KEY NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"restaurant_name" varchar(100) NOT NULL,
	"address" text,
	"phone_number" varchar(20),
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale_items" (
	"sale_item_id" serial PRIMARY KEY NOT NULL,
	"sale_id" serial NOT NULL,
	"item_id" serial NOT NULL,
	"quantity" text NOT NULL,
	"price" text NOT NULL,
	"total" text DEFAULT '(quantity * price)'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"sale_id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" serial NOT NULL,
	"staff_id" serial NOT NULL,
	"sale_date" text DEFAULT 'now()',
	"total_amount" text NOT NULL,
	"payment_method" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"staff_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"restaurant_id" serial NOT NULL,
	"role_id" serial NOT NULL,
	"employment_date" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_roles" (
	"user_id" varchar(255) NOT NULL,
	"role_id" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_restaurant_id_restaurants_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_restaurants_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_sale_id_sales_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("sale_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_sales_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("sale_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_item_id_menu_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."menu_items"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_restaurant_id_restaurants_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_staff_id_staff_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_restaurant_id_restaurants_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
