import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Roles Table to manage user roles (owner, manager, etc.)
// export const roles = pgTable('roles', {
//   roleId: serial('role_id').primaryKey(),
//   roleName: varchar('role_name', { length: 50 }).notNull(), // e.g., owner, manager, kitchen_staff, etc.
// });

// Relation to associate with users
// export const usersRoles = pgTable('users_roles', {
//   userId: varchar('user_id', { length: 255 }).notNull(), // This will reference Supabase auth.users table
//   roleId: serial('role_id').references(() => roles.roleId),
// });

// Restaurants
// export const restaurants = pgTable('restaurants', {
//   restaurantId: serial('restaurant_id').primaryKey(),
//   ownerId: varchar('owner_id', { length: 255 }).notNull(), // References Supabase auth.users
//   restaurantName: varchar('restaurant_name', { length: 100 }).notNull(),
//   address: text('address'),
//   phoneNumber: varchar('phone_number', { length: 20 }),
//   createdAt: text('created_at').default('now()'),
// });

// Staff
// export const staff = pgTable('staff', {
//   staffId: serial('staff_id').primaryKey(),
//   userId: varchar('user_id', { length: 255 }).notNull(), // References Supabase auth.users
//   restaurantId: serial('restaurant_id').references(
//     () => restaurants.restaurantId
//   ),
//   roleId: serial('role_id').references(() => roles.roleId), // Manager, kitchen staff, etc.
//   employmentDate: text('employment_date').default('now()'),
// });

// Payment methods enum
export const paymentMethodsEnum = pgEnum("payment_method", [
  "card",
  "transfer",
  "cash",
]);

// Menu Items
export const menuItems = pgTable("menu_items", {
  itemId: serial("item_id").primaryKey(),
  // restaurantId: serial('restaurant_id').references(
  //   () => restaurants.restaurantId
  // ),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  // costPrice: text('cost_price').notNull(),
  salePrice: integer("sale_price").notNull(),
  // createdAt: text('created_at').default('now()'),
  requiresPackaging: boolean("requires_packaging").default(false),
});

// Sales
export const sales = pgTable("sales", {
  saleId: serial("sale_id").primaryKey(),
  // restaurantId: serial('restaurant_id').references(
  //   () => restaurants.restaurantId
  // ),
  // staffId: serial('staff_id').references(() => staff.staffId),
  saleDate: timestamp("sale_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: paymentMethodsEnum("payment_method").notNull().default("card"), // 'cash', 'card', 'online'
  packaging_count: integer("packaging_count").default(0),
});

// SalesItem
export const saleItems = pgTable("sale_items", {
  saleItemId: serial("sale_item_id").primaryKey(),
  saleId: serial("sale_id").references(() => sales.saleId),
  itemId: serial("item_id").references(() => menuItems.itemId),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

// Payments
// export const payments = pgTable('payments', {
//   paymentId: serial('payment_id').primaryKey(),
//   saleId: serial('sale_id').references(() => sales.saleId),
//   amount: text('amount').notNull(),
//   paymentMethod: text('payment_method').notNull(), // 'cash', 'card', 'online'
//   paymentDate: text('payment_date').default('now()'),
// });

// Reports
// export const financialReports = pgTable('financial_reports', {
//   reportId: serial('report_id').primaryKey(),
//   restaurantId: serial('restaurant_id').references(
//     () => restaurants.restaurantId
//   ),
//   revenue: text('revenue').notNull(),
//   expenses: text('expenses').notNull(),
//   netProfit: text('net_profit').default('(revenue - expenses)'),
//   reportDate: text('report_date'),
// });
