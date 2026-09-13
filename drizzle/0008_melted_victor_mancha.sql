CREATE TABLE "equipment" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text DEFAULT 'otro' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price_per_day" integer,
	"image_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "equipment_rental" (
	"id" text PRIMARY KEY NOT NULL,
	"equipment_id" text NOT NULL,
	"variant_id" text NOT NULL,
	"renter_name" text NOT NULL,
	"renter_contact" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"rented_at" text NOT NULL,
	"expected_return_at" text,
	"returned_at" timestamp,
	"status" text DEFAULT 'activa' NOT NULL,
	"registered_by_user_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_variant" (
	"id" text PRIMARY KEY NOT NULL,
	"equipment_id" text NOT NULL,
	"label" text DEFAULT 'Única' NOT NULL,
	"total_quantity" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equipment_rental" ADD CONSTRAINT "equipment_rental_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_rental" ADD CONSTRAINT "equipment_rental_variant_id_equipment_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."equipment_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_rental" ADD CONSTRAINT "equipment_rental_registered_by_user_id_user_id_fk" FOREIGN KEY ("registered_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_variant" ADD CONSTRAINT "equipment_variant_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;