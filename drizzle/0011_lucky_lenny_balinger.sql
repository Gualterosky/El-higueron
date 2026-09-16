CREATE TABLE "community_post" (
	"id" text PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"contact_info" text NOT NULL,
	"contact_id" text,
	"activity" text NOT NULL,
	"event_date" text NOT NULL,
	"location_text" text DEFAULT '' NOT NULL,
	"level" text,
	"grade_detail" text,
	"logistics_tags" text[],
	"max_participants" integer,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"event_status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "hide_comunidad" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE set null ON UPDATE no action;