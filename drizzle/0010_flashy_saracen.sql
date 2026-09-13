CREATE TABLE "equipment_post" (
	"id" text PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"comment" text NOT NULL,
	"contact_info" text NOT NULL,
	"contact_id" text,
	"rating" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equipment_post" ADD CONSTRAINT "equipment_post_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE set null ON UPDATE no action;