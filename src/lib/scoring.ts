/**
 * JuryFlow - Weighted score calculation
 * Score Final = Σ(Note × Coefficient) / Σ(Coefficients)
 * Aggregated per team across all criteria and all juries.
 */

import type { Criterion, Grade, Team } from "@prisma/client";

interface CriterionWithScale extends Pick<Criterion, "id" | "weight" | "scaleType"> {}
interface GradeInput extends Pick<Grade, "teamId" | "criterionId" | "value"> {}

const SCALE_MAX: Record<string, number> = {
  SCALE_0_5: 5,
  SCALE_0_10: 10,
  SCALE_0_20: 20,
};

export function getScaleMax(scaleType: string): number {
  return SCALE_MAX[scaleType] ?? 10;
}

/**
 * Compute weighted average for one team from grades and criteria.
 * Formula: Σ(Note × Coefficient) / Σ(Coefficients)
 * Only criteria that have at least one grade for this team are included in the denominator.
 */
export function computeTeamWeightedScore(
  grades: GradeInput[],
  criteria: CriterionWithScale[]
): number {
  const criteriaById = new Map(criteria.map((c) => [c.id, c]));
  let weightedSum = 0;
  let totalWeight = 0;

  for (const g of grades) {
    const criterion = criteriaById.get(g.criterionId);
    if (!criterion) continue;
    weightedSum += g.value * criterion.weight;
    totalWeight += criterion.weight;
  }

  if (totalWeight === 0) return 0;
  return weightedSum / totalWeight;
}

export interface TeamRankingItem {
  teamId: string;
  teamName: string;
  score: number;
  rank: number;
}

/**
 * Build full ranking: one score per team (aggregating all juries and criteria), then sort by score desc.
 */
export function computeRanking(
  teams: Pick<Team, "id" | "name">[],
  grades: GradeInput[],
  criteria: CriterionWithScale[]
): TeamRankingItem[] {
  const teamGrades = new Map<string, GradeInput[]>();
  for (const g of grades) {
    const list = teamGrades.get(g.teamId) ?? [];
    list.push(g);
    teamGrades.set(g.teamId, list);
  }

  const teamScores = teams.map((team) => {
    const gradesForTeam = teamGrades.get(team.id) ?? [];
    const score = computeTeamWeightedScore(gradesForTeam, criteria);
    return { teamId: team.id, teamName: team.name, score };
  });

  teamScores.sort((a, b) => b.score - a.score);

  return teamScores.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
