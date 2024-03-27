ALTER TABLE "rooms" ADD COLUMN "currentRound" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users_to_rooms" DROP COLUMN IF EXISTS "currentRound";