-- Add optional profile context fields used by the PsyScreening ML feature set.
ALTER TABLE "Profile" ADD COLUMN "age" TEXT;
ALTER TABLE "Profile" ADD COLUMN "country" TEXT;
ALTER TABLE "Profile" ADD COLUMN "self_employed" TEXT;
ALTER TABLE "Profile" ADD COLUMN "family_history" TEXT;
ALTER TABLE "Profile" ADD COLUMN "no_employees" TEXT;
ALTER TABLE "Profile" ADD COLUMN "remote_work" TEXT;
ALTER TABLE "Profile" ADD COLUMN "coworkers" TEXT;
