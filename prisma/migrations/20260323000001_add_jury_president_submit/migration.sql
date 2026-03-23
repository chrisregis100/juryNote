-- AlterTable
ALTER TABLE "JuryAssignment" ADD COLUMN "isPresident" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "JuryAssignment" ADD COLUMN "submittedAt" TIMESTAMP(3);
