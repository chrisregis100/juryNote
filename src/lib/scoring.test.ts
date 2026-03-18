import { describe, it, expect } from "vitest";
import {
  getScaleMax,
  computeTeamWeightedScore,
  computeRanking,
} from "./scoring";

describe("getScaleMax", () => {
  it("returns 5 for SCALE_0_5", () => {
    expect(getScaleMax("SCALE_0_5")).toBe(5);
  });
  it("returns 10 for SCALE_0_10", () => {
    expect(getScaleMax("SCALE_0_10")).toBe(10);
  });
  it("returns 20 for SCALE_0_20", () => {
    expect(getScaleMax("SCALE_0_20")).toBe(20);
  });
  it("returns 10 for unknown", () => {
    expect(getScaleMax("UNKNOWN")).toBe(10);
  });
});

describe("computeTeamWeightedScore", () => {
  const criteria = [
    { id: "c1", weight: 2, scaleType: "SCALE_0_10" },
    { id: "c2", weight: 1, scaleType: "SCALE_0_10" },
  ];

  it("returns 0 when no grades", () => {
    expect(computeTeamWeightedScore([], criteria)).toBe(0);
  });

  it("computes weighted average: (8*2 + 4*1) / 3 = 6.67", () => {
    const grades = [
      { teamId: "t1", criterionId: "c1", value: 8 },
      { teamId: "t1", criterionId: "c2", value: 4 },
    ];
    const score = computeTeamWeightedScore(grades, criteria);
    expect(score).toBeCloseTo((8 * 2 + 4 * 1) / 3, 2);
    expect(score).toBeCloseTo(6.67, 2);
  });

  it("ignores grades for unknown criteria", () => {
    const grades = [
      { teamId: "t1", criterionId: "c1", value: 10 },
      { teamId: "t1", criterionId: "other", value: 100 },
    ];
    const score = computeTeamWeightedScore(grades, criteria);
    expect(score).toBe(10);
  });
});

describe("computeRanking", () => {
  const teams = [
    { id: "t1", name: "Team A" },
    { id: "t2", name: "Team B" },
    { id: "t3", name: "Team C" },
  ];
  const criteria = [
    { id: "c1", weight: 1, scaleType: "SCALE_0_10" },
  ];

  it("ranks by score descending", () => {
    const grades = [
      { teamId: "t1", criterionId: "c1", value: 5 },
      { teamId: "t2", criterionId: "c1", value: 10 },
      { teamId: "t3", criterionId: "c1", value: 7 },
    ];
    const ranking = computeRanking(teams, grades, criteria);
    expect(ranking[0].teamId).toBe("t2");
    expect(ranking[0].rank).toBe(1);
    expect(ranking[1].teamId).toBe("t3");
    expect(ranking[1].rank).toBe(2);
    expect(ranking[2].teamId).toBe("t1");
    expect(ranking[2].rank).toBe(3);
  });

  it("handles ties by order of appearance", () => {
    const grades = [
      { teamId: "t1", criterionId: "c1", value: 10 },
      { teamId: "t2", criterionId: "c1", value: 10 },
    ];
    const ranking = computeRanking(teams.slice(0, 2), grades, criteria);
    expect(ranking[0].score).toBe(10);
    expect(ranking[1].score).toBe(10);
    expect(ranking[0].rank).toBe(1);
    expect(ranking[1].rank).toBe(2);
  });

  it("includes teams with no grades at score 0", () => {
    const grades = [
      { teamId: "t1", criterionId: "c1", value: 5 },
    ];
    const ranking = computeRanking(teams, grades, criteria);
    expect(ranking).toHaveLength(3);
    const noGrade = ranking.find((r) => r.teamId === "t2");
    expect(noGrade?.score).toBe(0);
  });
});
