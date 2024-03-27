ALTER TABLE "rooms" ADD COLUMN "start_at" timestamp;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);