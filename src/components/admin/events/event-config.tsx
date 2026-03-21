"use client";

import type { Team, Criterion, JuryAssignment } from "@prisma/client";
import { TeamsSection } from "./teams-section";
import { CriteriaSection } from "./criteria-section";
import { JuryAccessSection } from "./jury-access-section";

interface EventConfigProps {
  eventId: string;
  eventSlug: string;
  teams: Team[];
  criteria: Criterion[];
  juryAssignments: JuryAssignment[];
  isLocked: boolean;
}

export function EventConfig({
  eventId,
  eventSlug,
  teams,
  criteria,
  juryAssignments,
  isLocked,
}: EventConfigProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TeamsSection eventId={eventId} teams={teams} isLocked={isLocked} />
      <CriteriaSection eventId={eventId} criteria={criteria} isLocked={isLocked} />
      <div className="md:col-span-2">
        <JuryAccessSection
          eventId={eventId}
          eventSlug={eventSlug}
          juryAssignments={juryAssignments}
          isLocked={isLocked}
        />
      </div>
    </div>
  );
}
