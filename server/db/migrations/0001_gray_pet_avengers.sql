ALTER TABLE "sales" ALTER COLUMN "sale_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "sale_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "payment_method" SET DEFAULT 'card';--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "requires_packaging" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "packaging_count" integer DEFAULT 0;