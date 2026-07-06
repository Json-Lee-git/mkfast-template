/**
 * Application database schema (non-auth tables).
 * Add your app tables here; keep Better Auth tables in auth.schema.ts.
 */

import { relations } from 'drizzle-orm';
import {
  integer,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
import type {
  PaymentScene,
  PaymentStatus,
  PaymentType,
  PlanInterval,
} from '@/payment/types';

/** 
 * Payment: subscription and one-time 
 */
export const payment = sqliteTable(
  'payment',
  {
    id: text('id').primaryKey(),
    priceId: text('price_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').notNull(),
    subscriptionId: text('subscription_id'),
    sessionId: text('session_id'),
    invoiceId: text('invoice_id').unique(),
    type: text('type').notNull().$type<PaymentType>(), // 'subscription' | 'one_time'
    scene: text('scene').$type<PaymentScene>(), // 'subscription' | 'lifetime'
    interval: text('interval').$type<PlanInterval>(), // 'month' | 'year'
    status: text('status').notNull().$type<PaymentStatus>(),
    paid: integer('paid', { mode: 'boolean' }).notNull().default(false),
    periodStart: integer('period_start', { mode: 'timestamp_ms' }),
    periodEnd: integer('period_end', { mode: 'timestamp_ms' }),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }),
    trialStart: integer('trial_start', { mode: 'timestamp_ms' }),
    trialEnd: integer('trial_end', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('payment_user_id_idx').on(table.userId),
    index('payment_customer_id_idx').on(table.customerId),
    index('payment_subscription_id_idx').on(table.subscriptionId),
    index('payment_session_id_idx').on(table.sessionId),
    index('payment_invoice_id_idx').on(table.invoiceId),
    index('payment_paid_idx').on(table.paid),
    index('payment_user_paid_idx').on(table.userId, table.paid),
  ]
);

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, { fields: [payment.userId], references: [user.id] }),
}));

/**
 * User files
 * metadata for files uploaded to R2 (path userfiles/{userId}/xxx);
 * filename = stored name on R2 (e.g. uuid.ext);
 * originalName = user's file name.
 */
export const userFiles = sqliteTable(
  'user_files',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    r2Key: text('r2_key').notNull(),
    isPublic: integer('is_public', { mode: 'boolean' }),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('user_files_user_id_idx').on(table.userId),
    index('user_files_r2_key_idx').on(table.r2Key),
  ]
);

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(user, {
    fields: [userFiles.userId],
    references: [user.id],
  }),
}));

/**
 * AI Visibility Checker form submissions
 */
export const checkerSubmissions = sqliteTable("checker_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brandName: text("brand_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  industry: text("industry"),
  competitors: text("competitors"),
  email: text("email").notNull(),
  platforms: text("platforms").notNull(),
  role: text("role"),
  submittedAt: text("submitted_at").notNull(),
});

/**
 * Full AEO Report tokens — $19 one-time purchase access
 */
export const reportTokens = sqliteTable("report_tokens", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  status: text("status").notNull().$type<"pending" | "active">(),
  resultJson: text("result_json").notNull(), // AeoAuditResult serialized
  email: text("email"),
  websiteUrl: text("website_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  activatedAt: integer("activated_at", { mode: "timestamp_ms" }),
});

/**
 * AI usage tracking — daily per-feature limits
 */
/**
 * Manual audit orders for the $99 human-reviewed service.
 */
export const manualAuditOrders = sqliteTable(
  "manual_audit_orders",
  {
    id: text("id").primaryKey(),
    status: text("status")
      .notNull()
      .$type<
        | "pending"
        | "checkout_failed"
        | "paid"
        | "notified"
        | "notification_failed"
        | "delivered"
      >(),
    checkoutId: text("checkout_id"),
    requestId: text("request_id").notNull(),
    websiteUrl: text("website_url").notNull(),
    email: text("email").notNull(),
    competitors: text("competitors"),
    notes: text("notes"),
    notificationError: text("notification_error"),
    reportUrl: text("report_url"),
    deliveryNotes: text("delivery_notes"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    notifiedAt: integer("notified_at", { mode: "timestamp_ms" }),
    deliveredAt: integer("delivered_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("manual_audit_orders_request_id_idx").on(table.requestId),
    uniqueIndex("manual_audit_orders_checkout_id_idx").on(table.checkoutId),
    index("manual_audit_orders_status_idx").on(table.status),
    index("manual_audit_orders_email_idx").on(table.email),
    index("manual_audit_orders_created_at_idx").on(table.createdAt),
  ]
);

/**
 * External webhook delivery ledger.
 */
export const webhookEvents = sqliteTable(
  "webhook_events",
  {
    id: text("id").primaryKey(),
    provider: text("provider").notNull(),
    eventId: text("event_id").notNull(),
    eventType: text("event_type").notNull(),
    target: text("target"),
    status: text("status")
      .notNull()
      .$type<"processing" | "processed" | "failed">(),
    error: text("error"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    processedAt: integer("processed_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_id_idx").on(
      table.provider,
      table.eventId
    ),
    index("webhook_events_status_idx").on(table.status),
    index("webhook_events_event_type_idx").on(table.eventType),
    index("webhook_events_created_at_idx").on(table.createdAt),
  ]
);

export const aiUsage = sqliteTable("ai_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feature: text("feature").notNull(), // 'query-fan-out' | 'aeo-analysis' | 'llms-polish'
  success: integer("success", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

/**
 * First-party funnel events for validating copy, CTA, and checkout hypotheses.
 */
export const conversionEvents = sqliteTable(
  "conversion_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    event: text("event").notNull(),
    path: text("path"),
    pageUrl: text("page_url"),
    referrer: text("referrer"),
    sessionId: text("session_id"),
    variant: text("variant"),
    payloadJson: text("payload_json"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("conversion_events_event_idx").on(table.event),
    index("conversion_events_session_id_idx").on(table.sessionId),
    index("conversion_events_created_at_idx").on(table.createdAt),
  ]
);

/**
 * AI visibility tracking snapshots — Pro subscribers get weekly
 * automated AEO re-audits stored here so they can see trends.
 */
export const aiVisibilitySnapshots = sqliteTable(
  "ai_visibility_snapshots",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    score: integer("score").notNull(),
    scoreLabel: text("score_label").notNull(),
    resultJson: text("result_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("ai_vis_snapshots_user_idx").on(table.userId),
    index("ai_vis_snapshots_url_idx").on(table.url),
    index("ai_vis_snapshots_created_idx").on(table.createdAt),
  ]
);
