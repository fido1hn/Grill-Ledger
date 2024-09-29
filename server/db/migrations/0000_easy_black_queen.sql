DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('card', 'transfer', 'cash');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_items" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"sale_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale_items" (
	"sale_item_id" serial PRIMARY KEY NOT NULL,
	"sale_id" serial NOT NULL,
	"item_id" serial NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"sale_id" serial PRIMARY KEY NOT NULL,
	"sale_date" timestamp with time zone,
	"total_amount" integer NOT NULL,
	"payment_method" "payment_method" NOT NULL
);
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
