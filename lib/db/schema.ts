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
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role").notNull().default("visitante"),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  banned: boolean("banned").notNull().default(false),
})

/** Unified contact/lead identity. One row per canonical email or phone;
 *  rows are merged when the same person is identified through both channels. */
export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").notNull().default(false),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  source: text("source").notNull().default("unknown"),
  firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
  submissionCount: integer("submission_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/** Verification tokens for claiming a contact (email or WhatsApp/SMS OTP).
 *  Active once the project has a mail/SMS provider configured. */
export const contactVerification = pgTable("contact_verification", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
  channel: text("channel").notNull(), // "email" | "phone"
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  hideComunidad: boolean("hide_comunidad").notNull().default(false),
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

/** Climb ascent posts submitted from individual route pages (or from the
 *  aggregated /muro form, which can tag zero or several routes at once). */
export const climbPost = pgTable("climb_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  ascentDate: text("ascent_date").notNull(),
  // Legacy single-route field, kept for backward compatibility with rows created
  // before the multi-route selector (2026-09): mirrors routeIds[0], or "" when
  // the post was submitted from /muro without picking any route.
  routeId: text("route_id").notNull(),
  // Full set of routes the visitor tagged (0..n). Ids match MURO_ROUTES, with an
  // optional "-<subLevel>" suffix (e.g. "MBS14-5.9"). Null/empty = no route tagged.
  routeIds: text("route_ids").array(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  // "incident" | "review" | "tip" | "question" (legacy rows may still say "suggestion",
  // normalized to "review" by lib/posts/shared.ts::normalizePostCategory)
  category: text("category").notNull().default("review"),
  // Only set when category = "incident": "low" | "medium" | "high" | "critical"
  urgencyLevel: text("urgency_level"),
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
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
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
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  // "incident" | "review" | "tip" | "question" (legacy rows may still say "suggestion",
  // normalized to "review" by lib/posts/shared.ts::normalizePostCategory)
  category: text("category").notNull().default("review"),
  // Only set when category = "incident": "low" | "medium" | "high" | "critical"
  urgencyLevel: text("urgency_level"),
  status: text("status").notNull().default("pending"),
  socialMediaUrl: text("social_media_url"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Boulder ascent posts submitted from the boulder page (or from the
 *  aggregated /boulder form, which can tag zero or several problems at once). */
export const boulderPost = pgTable("boulder_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  visitDate: text("visit_date").notNull(),
  // Legacy single-problem fields, kept for backward compatibility with rows
  // created before the multi-select selector (2026-09). Before that change
  // these were free-text (visitor-typed), so old rows can't reliably be
  // mapped back to a BOULDERS id — see system_architecture.md. New rows
  // mirror problemIds[0]'s base boulder id / problem id, or "" when the post
  // was submitted from /boulder without tagging any problem.
  boulderName: text("boulder_name").notNull(),
  routeName: text("route_name").notNull(),
  // Full set of problems the visitor tagged (0..n). Ids look like
  // "BLDR01-PP01" (boulderId-problemId). Null/empty = no problem tagged.
  problemIds: text("problem_ids").array(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  // "incident" | "review" | "tip" | "question" (legacy rows may still say "suggestion",
  // normalized to "review" by lib/posts/shared.ts::normalizePostCategory)
  category: text("category").notNull().default("review"),
  // Only set when category = "incident": "low" | "medium" | "high" | "critical"
  urgencyLevel: text("urgency_level"),
  status: text("status").notNull().default("pending"),
  socialMediaUrl: text("social_media_url"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Replies to any post type (muro, camping, boulder, equipos). No star rating. */
export const postReply = pgTable("post_reply", {
  id: text("id").primaryKey(),
  postType: text("post_type").notNull(), // "muro" | "camping" | "boulder" | "equipos"
  postId: text("post_id").notNull(),
  authorName: text("author_name").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Comments/reviews about the equipment rental section as a whole (not tied to
 *  a single catalog item). Simplified compared to climbPost/campingPost/
 *  boulderPost: no visit date, category, urgency or media — just a name,
 *  star rating and comment, same as a plain review. */
export const equipmentPost = pgTable("equipment_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  comment: text("comment").notNull(),
  contactInfo: text("contact_info").notNull(),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Rentable equipment catalog item (e.g. "Casco", "Pies de gato", "Carpa"). */
export const equipment = pgTable("equipment", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull().default("otro"), // "escalada" | "boulder" | "camping" | "otro"
  description: text("description").notNull().default(""),
  // COP per day, nullable = price not defined yet.
  pricePerDay: integer("price_per_day"),
  // Square (1:1) image. Nullable = show placeholder until real photos are uploaded.
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/** Rentable variant/size of an equipment item (e.g. talla "M", or "Única" when
 *  the item has no real sizes). Availability is always computed as
 *  totalQuantity - sum(quantity) of "activa" rentals for this variant — never
 *  stored directly, to avoid it drifting out of sync. */
export const equipmentVariant = pgTable("equipment_variant", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Única"),
  totalQuantity: integer("total_quantity").notNull().default(0),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** A single rental movement registered by staff/admin from the equipment panel. */
export const equipmentRental = pgTable("equipment_rental", {
  id: text("id").primaryKey(),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  variantId: text("variant_id")
    .notNull()
    .references(() => equipmentVariant.id, { onDelete: "cascade" }),
  // Free-text customer info — walk-in visitors don't need a site account.
  renterName: text("renter_name").notNull(),
  renterContact: text("renter_contact"),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(1),
  rentedAt: text("rented_at").notNull(), // ISO date (YYYY-MM-DD)
  expectedReturnAt: text("expected_return_at"), // ISO date (YYYY-MM-DD), nullable
  returnedAt: timestamp("returned_at"),
  status: text("status").notNull().default("activa"), // "activa" | "devuelta" | "cancelada"
  registeredByUserId: text("registered_by_user_id").references(() => user.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Community matchmaking post: a visitor announces a future plan (climbing,
 *  bouldering, hiking, camping...) so others can find them and coordinate.
 *  Unlike climbPost/campingPost/boulderPost (reviews of a past visit), this is
 *  a single unified table across activities (see system_architecture.md) —
 *  the plan is always in the future, not a review of something already done.
 *  Replies use the existing `postReply` table with postType = "comunidad". */
export const communityPost = pgTable("community_post", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  // Shown publicly (unlike other post families) so other visitors can
  // coordinate directly — see system_architecture.md for the privacy trade-off.
  // Blanked out once the plan is cancelled or its date has passed.
  contactInfo: text("contact_info").notNull(),
  contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
  // "escalada_deportiva" | "boulder" | "senderismo" | "camping" | "otro"
  activity: text("activity").notNull(),
  // ISO date (YYYY-MM-DD), required: the day this plan happens. The post is
  // treated as "expired" (display-only, never stored) the day after this date.
  eventDate: text("event_date").notNull(),
  locationText: text("location_text").notNull().default(""),
  // "principiante" | "intermedio" | "avanzado" | "cualquiera"
  level: text("level"),
  // Free-text grade range (e.g. "5.10-5.12", "V3-V5") — scales differ per discipline.
  gradeDetail: text("grade_detail"),
  // Dynamic per-activity logistics indicators (see lib/comunidad/shared.ts
  // ACTIVITY_LOGISTICS_TAGS), e.g. "tengo_cuerda", "busco_transporte".
  logisticsTags: text("logistics_tags").array(),
  maxParticipants: integer("max_participants"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"), // moderation: "pending" | "approved" | "hidden"
  // "open" | "cancelled" — manually set; "expired" is derived from eventDate,
  // never stored (see lib/comunidad/shared.ts::getCommunityDisplayStatus).
  eventStatus: text("event_status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type Contact = typeof contact.$inferSelect
export type ContactVerification = typeof contactVerification.$inferSelect
export type Session = typeof session.$inferSelect
export type SiteSettings = typeof siteSettings.$inferSelect
export type SiteAnnouncement = typeof siteAnnouncement.$inferSelect
export type ClimbPost = typeof climbPost.$inferSelect
export type CampingPost = typeof campingPost.$inferSelect
export type BoulderPost = typeof boulderPost.$inferSelect
export type PostReply = typeof postReply.$inferSelect
export type CommunityPost = typeof communityPost.$inferSelect
export type EquipmentPost = typeof equipmentPost.$inferSelect
export type ChatSession = typeof chatSession.$inferSelect
export type ChatMessage = typeof chatMessage.$inferSelect
export type Reservation = typeof reservation.$inferSelect
export type Equipment = typeof equipment.$inferSelect
export type EquipmentVariant = typeof equipmentVariant.$inferSelect
export type EquipmentRental = typeof equipmentRental.$inferSelect
