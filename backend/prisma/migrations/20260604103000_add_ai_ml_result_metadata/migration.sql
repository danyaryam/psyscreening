-- Store external AI/ML response metadata without breaking existing screening results.
ALTER TABLE "ScreeningResult" ADD COLUMN "aiProvider" TEXT NOT NULL DEFAULT 'mock';
ALTER TABLE "ScreeningResult" ADD COLUMN "aiSeverity" TEXT;
ALTER TABLE "ScreeningResult" ADD COLUMN "aiConfidence" DOUBLE PRECISION;
ALTER TABLE "ScreeningResult" ADD COLUMN "aiRawResponse" JSONB;
