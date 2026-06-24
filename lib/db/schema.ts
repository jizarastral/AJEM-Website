import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  serial,
  numeric,
} from 'drizzle-orm/pg-core'

// ─── Better Auth Tables ───────────────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  role: text('role').notNull().default('client'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ─── App Tables ───────────────────────────────────────────────────────────────

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  company: text('company'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  contactPerson: text('contactPerson'),
  type: text('type').notNull().default('residential'),
  status: text('status').notNull().default('active'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const workOrders = pgTable('work_orders', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: integer('clientId'),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull().default('maintenance'),
  status: text('status').notNull().default('pending'),
  priority: text('priority').notNull().default('medium'),
  assignedTo: text('assignedTo'),
  location: text('location'),
  scheduledDate: timestamp('scheduledDate'),
  completedDate: timestamp('completedDate'),
  estimatedHours: numeric('estimatedHours'),
  actualHours: numeric('actualHours'),
  amount: numeric('amount'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const jobUpdates = pgTable('job_updates', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  workOrderId: integer('workOrderId').notNull(),
  message: text('message').notNull(),
  status: text('status'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: integer('clientId'),
  title: text('title').notNull(),
  type: text('type').notNull().default('amc'),
  status: text('status').notNull().default('active'),
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate'),
  value: numeric('value'),
  terms: text('terms'),
  autoRenew: boolean('autoRenew').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const serviceRequests = pgTable('service_requests', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull().default('maintenance'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('pending'),
  location: text('location'),
  preferredDate: timestamp('preferredDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const quotations = pgTable('quotations', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: integer('clientId'),
  title: text('title').notNull(),
  description: text('description'),
  amount: numeric('amount'),
  status: text('status').notNull().default('draft'),
  validUntil: timestamp('validUntil'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').notNull().default('unread'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
