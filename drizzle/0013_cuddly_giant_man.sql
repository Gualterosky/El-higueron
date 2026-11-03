CREATE TABLE "equipment_item" (
	"id" text PRIMARY KEY NOT NULL,
	"seq" integer NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'otros' NOT NULL,
	"talla" text,
	"image_url" text,
	"status" text DEFAULT 'disponible' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_item_seq_unique" UNIQUE("seq")
);
--> statement-breakpoint
CREATE TABLE "equipment_item_rental" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"rented_at" text NOT NULL,
	"returned_at" timestamp,
	"registered_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equipment_item_rental" ADD CONSTRAINT "equipment_item_rental_item_id_equipment_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."equipment_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_item_rental" ADD CONSTRAINT "equipment_item_rental_registered_by_user_id_user_id_fk" FOREIGN KEY ("registered_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "equipment_item_status_idx" ON "equipment_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "equipment_item_rental_item_id_idx" ON "equipment_item_rental" USING btree ("item_id");