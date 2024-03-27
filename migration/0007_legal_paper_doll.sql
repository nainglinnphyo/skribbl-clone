ALTER TABLE "rooms" ADD COLUMN "create_at" timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP;