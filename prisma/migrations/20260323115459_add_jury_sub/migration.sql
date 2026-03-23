-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "organizerId" TEXT;

-- AlterTable
ALTER TABLE "JuryAssignment" ADD COLUMN     "magicTokenUsedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
