CREATE TABLE "guide" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"phone" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_link" (
	"id" text PRIMARY KEY NOT NULL,
	"guide_id" text NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"icon" text DEFAULT 'web' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guide_link" ADD CONSTRAINT "guide_link_guide_id_guide_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guide"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "guide_position_idx" ON "guide" USING btree ("position");--> statement-breakpoint
CREATE INDEX "guide_link_guide_id_idx" ON "guide_link" USING btree ("guide_id");