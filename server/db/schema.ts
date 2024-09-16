import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

// Roles Table to manage user roles (owner, manager, etc.)
export const roles = pgTable('roles', {
  roleId: serial('role_id').primaryKey(),
  roleName: varchar('role_name', { length: 50 }).notNull(), // e.g., owner, manager, kitchen_staff, etc.
});

// Relation to associate with users
export const usersRoles = pgTable('users_roles', {
  userId: varchar('user_id', { length: 255 }).notNull(), // This will reference Supabase auth.users table
  roleId: serial('role_id').references(() => roles.roleId),
});

// Restaurants
export const restaurants = pgTable('restaurants', {
  restaurantId: serial('restaurant_id').primaryKey(),
  ownerId: varchar('owner_id', { length: 255 }).notNull(), // References Supabase auth.users
  restaurantName: varchar('restaurant_name', { length: 100 }).notNull(),
  address: text('address'),
  phoneNumber: varchar('phone_number', { length: 20 }),
  createdAt: text('created_at').default('now()'),
});

// Staff
export const staff = pgTable('staff', {
  staffId: serial('staff_id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(), // References Supabase auth.users
  restaurantId: serial('restaurant_id').references(
    () => restaurants.restaurantId
  ),
  roleId: serial('role_id').references(() => roles.roleId), // Manager, kitchen staff, etc.
  employmentDate: text('employment_date').default('now()'),
});

// Menu Items
export const menuItems = pgTable('menu_items', {
  itemId: serial('item_id').primaryKey(),
  restaurantId: serial('restaurant_id').references(
    () => restaurants.restaurantId
  ),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  costPrice: text('cost_price').notNull(),
  salePrice: text('sale_price').notNull(),
  createdAt: text('created_at').default('now()'),
});

// Sales
export const sales = pgTable('sales', {
  saleId: serial('sale_id').primaryKey(),
  restaurantId: serial('restaurant_id').references(
    () => restaurants.restaurantId
  ),
  staffId: serial('staff_id').references(() => staff.staffId),
  saleDate: text('sale_date').default('now()'),
  totalAmount: text('total_amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'cash', 'card', 'online'
});

// SalesItem
export const saleItems = pgTable('sale_items', {
  saleItemId: serial('sale_item_id').primaryKey(),
  saleId: serial('sale_id').references(() => sales.saleId),
  itemId: serial('item_id').references(() => menuItems.itemId),
  quantity: text('quantity').notNull(),
  price: text('price').notNull(),
  total: text('total').default('(quantity * price)'),
});

// Payments
export const payments = pgTable('payments', {
  paymentId: serial('payment_id').primaryKey(),
  saleId: serial('sale_id').references(() => sales.saleId),
  amount: text('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'cash', 'card', 'online'
  paymentDate: text('payment_date').default('now()'),
});

// Reports
export const financialReports = pgTable('financial_reports', {
  reportId: serial('report_id').primaryKey(),
  restaurantId: serial('restaurant_id').references(
    () => restaurants.restaurantId
  ),
  revenue: text('revenue').notNull(),
  expenses: text('expenses').notNull(),
  netProfit: text('net_profit').default('(revenue - expenses)'),
  reportDate: text('report_date'),
});
