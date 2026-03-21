-- AddForeignKey
ALTER TABLE "ParticipantResource" ADD CONSTRAINT "ParticipantResource_apiCredentialId_fkey" FOREIGN KEY ("apiCredentialId") REFERENCES "ApiCredential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
