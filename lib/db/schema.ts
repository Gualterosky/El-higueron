import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

/**
 * Better Auth core tables + app roles.
 * Flow: edit schema → pnpm db:generate → pnpm db:migrate (or pnpm db:push while prototyping)
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role").notNull().default("visitante"),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

/** Singleton site configuration (id = "default"). */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  hideEscalada: boolean("hide_escalada").notNull().default(false),
  hideMuro: boolean("hide_muro").notNull().default(false),
  hideBoulder: boolean("hide_boulder").notNull().default(false),
  hideCamping: boolean("hide_camping").notNull().default(false),
  hideEquipos: boolean("hide_equipos").notNull().default(false),
  hideVisita: boolean("hide_visita").notNull().default(false),
  hideGaleria: boolean("hide_galeria").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/** Climb ascent posts submitted from individual route pages. */
export const climbPost = pgTable("climb_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  ascentDate: text("ascent_date").notNull(),
  routeId: text("route_id").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("pending"),
  socialMediaUrl: text("social_media_url"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Anonymous chatbot conversation sessions (one per browser). */
export const chatSession = pgTable("chat_session", {
  id: text("id").primaryKey(),
  locale: text("locale").notNull().default("es"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/** Individual message pairs saved from chatbot conversations. */
export const chatMessage = pgTable("chat_message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSession.id, { onDelete: "cascade" }),
  userMessage: text("user_message").notNull(),
  botResponse: text("bot_response").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
export type SiteSettings = typeof siteSettings.$inferSelect
export type ClimbPost = typeof climbPost.$inferSelect
export type ChatSession = typeof chatSession.$inferSelect
export type ChatMessage = typeof chatMessage.$inferSelect
