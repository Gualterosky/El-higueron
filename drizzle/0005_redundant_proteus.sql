CREATE TABLE "boulder_post" (
	"id" text PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"visit_date" text NOT NULL,
	"boulder_name" text NOT NULL,
	"route_name" text NOT NULL,
	"comment" text NOT NULL,
	"contact_info" text NOT NULL,
	"rating" integer NOT NULL,
	"category" text DEFAULT 'review' NOT NULL,
	"urgency_level" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"social_media_url" text,
	"media_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "camping_post" (
	"id" text PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"visit_date" text NOT NULL,
	"comment" text NOT NULL,
	"contact_info" text NOT NULL,
	"rating" integer NOT NULL,
	"category" text DEFAULT 'review' NOT NULL,
	"urgency_level" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"social_media_url" text,
	"media_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_message" text NOT NULL,
	"bot_response" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_session" (
	"id" text PRIMARY KEY NOT NULL,
	"locale" text DEFAULT 'es' NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "climb_post" (
	"id" text PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"ascent_date" text NOT NULL,
	"route_id" text NOT NULL,
	"comment" text NOT NULL,
	"contact_info" text NOT NULL,
	"rating" integer NOT NULL,
	"category" text DEFAULT 'review' NOT NULL,
	"urgency_level" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"social_media_url" text,
	"media_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_reply" (
	"id" text PRIMARY KEY NOT NULL,
	"post_type" text NOT NULL,
	"post_id" text NOT NULL,
	"author_name" text NOT NULL,
	"comment" text NOT NULL,
	"contact_info" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservation" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"contact_info" text NOT NULL,
	"number_of_people" integer NOT NULL,
	"arrival_date" text NOT NULL,
	"departure_date" text,
	"may_stay_extra" boolean DEFAULT false NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_announcement" (
	"id" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"title_es" text DEFAULT '' NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"subtitle_es" text DEFAULT '' NOT NULL,
	"subtitle_en" text DEFAULT '' NOT NULL,
	"body_es" text DEFAULT '' NOT NULL,
	"body_en" text DEFAULT '' NOT NULL,
	"cta_label_es" text DEFAULT '' NOT NULL,
	"cta_label_en" text DEFAULT '' NOT NULL,
	"cta_url" text DEFAULT '' NOT NULL,
	"cta_new_tab" boolean DEFAULT false NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"image_alt" text DEFAULT '' NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"frequency" text DEFAULT 'once' NOT NULL,
	"delay_seconds" integer DEFAULT 2 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"hide_escalada" boolean DEFAULT false NOT NULL,
	"hide_muro" boolean DEFAULT false NOT NULL,
	"hide_boulder" boolean DEFAULT false NOT NULL,
	"hide_camping" boolean DEFAULT false NOT NULL,
	"hide_equipos" boolean DEFAULT false NOT NULL,
	"hide_visita" boolean DEFAULT false NOT NULL,
	"hide_galeria" boolean DEFAULT false NOT NULL,
	"hide_reservas" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_session_id_chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_session"("id") ON DELETE cascade ON UPDATE no action;