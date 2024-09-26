DROP TABLE "financial_reports";--> statement-breakpoint
DROP TABLE "payments";--> statement-breakpoint
DROP TABLE "restaurants";--> statement-breakpoint
DROP TABLE "roles";--> statement-breakpoint
DROP TABLE "sale_items";--> statement-breakpoint
DROP TABLE "staff";--> statement-breakpoint
DROP TABLE "users_roles";--> statement-breakpoint
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_restaurant_id_restaurants_restaurant_id_fk";
--> statement-breakpoint
ALTER TABLE "sales" DROP CONSTRAINT "sales_restaurant_id_restaurants_restaurant_id_fk";
--> statement-breakpoint
ALTER TABLE "sales" DROP CONSTRAINT "sales_staff_id_staff_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN IF EXISTS "restaurant_id";--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN IF EXISTS "cost_price";--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN IF EXISTS "restaurant_id";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN IF EXISTS "staff_id";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN IF EXISTS "payment_method";