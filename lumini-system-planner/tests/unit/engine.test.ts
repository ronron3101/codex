import { describe, expect, test } from "vitest";
import { calculatePlannerResult, calculateSplitRunScenario } from "@/lib/calculations/engine";

describe("calculatePlannerResult", () => {
  test("returns Good for low drop short run", () => {
    const result = calculatePlannerResult({
      projectType: "Hospitality",
      voltage: 24,
      topology: "tee",
      fixtures: [{ fixtureId: "fx-2", quantity: 8 }],
      cableId: "cb-10",
      runLengthMetres: 12,
      headroomPercent: 25,
      reserveCapacityWatt: 10
    });

    expect(result.status).toBe("Good");
    expect(result.voltageDropPercent).toBeLessThanOrEqual(3);
  });

  test("returns Caution for medium drop", () => {
    const result = calculatePlannerResult({
      projectType: "Estate",
      voltage: 12,
      topology: "single_run",
      fixtures: [{ fixtureId: "fx-1", quantity: 8 }],
      cableId: "cb-12",
      runLengthMetres: 12,
      headroomPercent: 25,
      reserveCapacityWatt: 0
    });

    expect(result.status).toBe("Caution");
    expect(result.voltageDropPercent).toBeGreaterThan(3);
    expect(result.voltageDropPercent).toBeLessThanOrEqual(8);
  });

  test("returns Not Recommended for high drop", () => {
    const result = calculatePlannerResult({
      projectType: "Campus",
      voltage: 12,
      topology: "single_run",
      fixtures: [{ fixtureId: "fx-1", quantity: 20 }],
      cableId: "cb-14",
      runLengthMetres: 60,
      headroomPercent: 25,
      reserveCapacityWatt: 0
    });

    expect(result.status).toBe("Not Recommended");
    expect(result.voltageDropPercent).toBeGreaterThan(8);
  });

  test("split-run improves drop profile", () => {
    const baseInput = {
      projectType: "Campus",
      voltage: 12 as const,
      topology: "single_run" as const,
      fixtures: [{ fixtureId: "fx-1", quantity: 20 }],
      cableId: "cb-14",
      runLengthMetres: 60,
      headroomPercent: 25,
      reserveCapacityWatt: 0
    };

    const single = calculatePlannerResult(baseInput);
    const split = calculateSplitRunScenario(baseInput, 2);

    expect(split.voltageDropPercent).toBeLessThan(single.voltageDropPercent);
  });
});
