-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'YES_NO', 'DATE', 'NUMBER');

-- CreateTable
CREATE TABLE "InvitedParticipant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "profession" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitedParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinLink" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckinLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantCheckin" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "invitedParticipantId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "photoConsent" BOOLEAN NOT NULL,
    "isInvited" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomQuestion" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantAnswer" (
    "id" TEXT NOT NULL,
    "participantCheckinId" TEXT NOT NULL,
    "customQuestionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvitedParticipant_eventId_idx" ON "InvitedParticipant"("eventId");

-- CreateIndex
CREATE INDEX "InvitedParticipant_eventId_name_idx" ON "InvitedParticipant"("eventId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CheckinLink_eventId_key" ON "CheckinLink"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckinLink_token_key" ON "CheckinLink"("token");

-- CreateIndex
CREATE INDEX "ParticipantCheckin_eventId_idx" ON "ParticipantCheckin"("eventId");

-- CreateIndex
CREATE INDEX "ParticipantCheckin_eventId_name_idx" ON "ParticipantCheckin"("eventId", "name");

-- CreateIndex
CREATE INDEX "ParticipantCheckin_eventId_email_idx" ON "ParticipantCheckin"("eventId", "email");

-- CreateIndex
CREATE INDEX "CustomQuestion_eventId_idx" ON "CustomQuestion"("eventId");

-- CreateIndex
CREATE INDEX "CustomQuestion_eventId_order_idx" ON "CustomQuestion"("eventId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantAnswer_participantCheckinId_customQuestionId_key" ON "ParticipantAnswer"("participantCheckinId", "customQuestionId");

-- AddForeignKey
ALTER TABLE "InvitedParticipant" ADD CONSTRAINT "InvitedParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinLink" ADD CONSTRAINT "CheckinLink_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCheckin" ADD CONSTRAINT "ParticipantCheckin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCheckin" ADD CONSTRAINT "ParticipantCheckin_invitedParticipantId_fkey" FOREIGN KEY ("invitedParticipantId") REFERENCES "InvitedParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomQuestion" ADD CONSTRAINT "CustomQuestion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAnswer" ADD CONSTRAINT "ParticipantAnswer_participantCheckinId_fkey" FOREIGN KEY ("participantCheckinId") REFERENCES "ParticipantCheckin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAnswer" ADD CONSTRAINT "ParticipantAnswer_customQuestionId_fkey" FOREIGN KEY ("customQuestionId") REFERENCES "CustomQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
