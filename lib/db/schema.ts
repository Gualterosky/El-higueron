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
  banned: boolean("banned").notNull().default(false),
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
  hideReservas: boolean("hide_reservas").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/** Singleton news/announcement pop-up shown on the public site (id = "default"). */
export const siteAnnouncement = pgTable("site_announcement", {
  id: text("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  titleEs: text("title_es").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  subtitleEs: text("subtitle_es").notNull().default(""),
  subtitleEn: text("subtitle_en").notNull().default(""),
  bodyEs: text("body_es").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  ctaLabelEs: text("cta_label_es").notNull().default(""),
  ctaLabelEn: text("cta_label_en").notNull().default(""),
  ctaUrl: text("cta_url").notNull().default(""),
  ctaNewTab: boolean("cta_new_tab").notNull().default(false),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  frequency: text("frequency").notNull().default("once"),
  delaySeconds: integer("delay_seconds").notNull().default(2),
  version: integer("version").notNull().default(1),
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

/** Reservation requests submitted through the booking form. */
export const reservation = pgTable("reservation", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // "camping" | "escalada"
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  numberOfPeople: integer("number_of_people").notNull(),
  arrivalDate: text("arrival_date").notNull(),
  departureDate: text("departure_date"),
  mayStayExtra: boolean("may_stay_extra").notNull().default(false),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Camping experience posts submitted from the camping page. */
export const campingPost = pgTable("camping_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  visitDate: text("visit_date").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("pending"),
  socialMediaUrl: text("social_media_url"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Boulder ascent posts submitted from the boulder page. */
export const boulderPost = pgTable("boulder_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  visitDate: text("visit_date").notNull(),
  boulderName: text("boulder_name").notNull(),
  routeName: text("route_name").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("pending"),
  socialMediaUrl: text("social_media_url"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Replies to any post type (muro, camping, boulder). No star rating. */
export const postReply = pgTable("post_reply", {
  id: text("id").primaryKey(),
  postType: text("post_type").notNull(), // "muro" | "camping" | "boulder"
  postId: text("post_id").notNull(),
  authorName: text("author_name").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
export type SiteSettings = typeof siteSettings.$inferSelect
export type SiteAnnouncement = typeof siteAnnouncement.$inferSelect
export type ClimbPost = typeof climbPost.$inferSelect
export type CampingPost = typeof campingPost.$inferSelect
export type BoulderPost = typeof boulderPost.$inferSelect
export type PostReply = typeof postReply.$inferSelect
export type ChatSession = typeof chatSession.$inferSelect
export type ChatMessage = typeof chatMessage.$inferSelect
export type Reservation = typeof reservation.$inferSelect
