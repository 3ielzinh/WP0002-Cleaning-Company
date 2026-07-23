import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  normalizedEmail: text("normalized_email").notNull(),
  phone: text("phone").notNull(),
  normalizedPhone: text("normalized_phone").notNull(),
  address: text("address").notNull(),
  propertySize: integer("property_size").notNull(),
  status: text("status").notNull().default("new"),
  firstSource: text("first_source").notNull(),
  latestSource: text("latest_source").notNull(),
  termsAccepted: integer("terms_accepted", { mode: "boolean" }).notNull(),
  policyAccepted: integer("policy_accepted", { mode: "boolean" }).notNull(),
  consentVersion: text("consent_version").notNull(),
  consentedAt: integer("consented_at").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("leads_normalized_email_idx").on(table.normalizedEmail),
  index("leads_normalized_phone_idx").on(table.normalizedPhone),
  index("leads_status_idx").on(table.status),
  index("leads_created_at_idx").on(table.createdAt),
]);

export const leadServices = sqliteTable("lead_services", {
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  service: text("service").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  primaryKey({ columns: [table.leadId, table.service] }),
  index("lead_services_lead_id_idx").on(table.leadId),
]);

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull(),
  channel: text("channel").notNull(),
  summary: text("summary").notNull(),
  messageCount: integer("message_count").notNull(),
  startedAt: integer("started_at").notNull(),
  completedAt: integer("completed_at").notNull(),
}, (table) => [
  uniqueIndex("conversations_channel_session_idx").on(table.channel, table.sessionId),
  index("conversations_lead_id_idx").on(table.leadId),
]);

export const conversationMessages = sqliteTable("conversation_messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  sender: text("sender").notNull(),
  message: text("message").notNull(),
  sequence: integer("sequence").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  uniqueIndex("conversation_messages_sequence_idx").on(table.conversationId, table.sequence),
  index("conversation_messages_conversation_id_idx").on(table.conversationId),
]);

export const leadEvents = sqliteTable("lead_events", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  source: text("source").notNull(),
  payload: text("payload").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("lead_events_lead_id_idx").on(table.leadId),
  index("lead_events_type_idx").on(table.eventType),
  index("lead_events_created_at_idx").on(table.createdAt),
]);

export const submissionReceipts = sqliteTable("submission_receipts", {
  idempotencyKey: text("idempotency_key").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  disposition: text("disposition").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const leadRateLimits = sqliteTable("lead_rate_limits", {
  ipHash: text("ip_hash").primaryKey(),
  windowStartedAt: integer("window_started_at").notNull(),
  requestCount: integer("request_count").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
