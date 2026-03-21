-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('API_CREDENTIAL', 'LINK', 'TEXT_INFO');

-- CreateTable
CREATE TABLE "EventResource" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "url" TEXT,
    "fileName" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiCredential" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "participantHint" TEXT,
    "value" TEXT NOT NULL,
    "assignedToId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantResource" (
    "id" TEXT NOT NULL,
    "participantCheckinId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "apiCredentialId" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventResource_eventId_idx" ON "EventResource"("eventId");

-- CreateIndex
CREATE INDEX "ApiCredential_resourceId_idx" ON "ApiCredential"("resourceId");

-- CreateIndex
CREATE INDEX "ApiCredential_assignedToId_idx" ON "ApiCredential"("assignedToId");

-- CreateIndex
CREATE INDEX "ParticipantResource_participantCheckinId_idx" ON "ParticipantResource"("participantCheckinId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantResource_participantCheckinId_resourceId_key" ON "ParticipantResource"("participantCheckinId", "resourceId");

-- AddForeignKey
ALTER TABLE "EventResource" ADD CONSTRAINT "EventResource_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "EventResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "ParticipantCheckin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantResource" ADD CONSTRAINT "ParticipantResource_participantCheckinId_fkey" FOREIGN KEY ("participantCheckinId") REFERENCES "ParticipantCheckin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantResource" ADD CONSTRAINT "ParticipantResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "EventResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
