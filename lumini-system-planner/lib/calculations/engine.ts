import { cables, fixtures, rules, transformers } from "@/lib/data/seed-data";
import type { CalculationResult, PlannerInput, TransformerStatus } from "@/lib/models";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculatePlannerResult(input: PlannerInput): CalculationResult {
  const selectedCable = cables.find((cable) => cable.id === input.cableId);
  if (!selectedCable) {
    throw new Error("Cable not found");
  }

  const totalConnectedLoadWatt = input.fixtures.reduce((sum, item) => {
    const fixture = fixtures.find((entry) => entry.id === item.fixtureId);
    if (!fixture) {
      throw new Error(`Fixture ${item.fixtureId} not found`);
    }
    if (!fixture.availableVoltages.includes(input.voltage)) {
      throw new Error(`${fixture.name} does not support ${input.voltage}V systems`);
    }
    return sum + fixture.wattage * item.quantity;
  }, 0);

  const designLoadWatt = totalConnectedLoadWatt * (1 + input.headroomPercent / 100) + input.reserveCapacityWatt;
  const currentDrawAmp = designLoadWatt / input.voltage;

  // Engineering assumption: voltage drop for a low-voltage two-conductor run is loop resistance,
  // so we multiply distance by 2.
  const loopResistance = selectedCable.resistanceOhmPerMetre * input.runLengthMetres * 2;
  const voltageDropVolt = currentDrawAmp * loopResistance;
  const voltageDropPercent = (voltageDropVolt / input.voltage) * 100;
  const endOfRunVoltage = input.voltage - voltageDropVolt;

  const transformerRecommendation =
    transformers.find((transformer) => transformer.sizeWatt >= designLoadWatt) ?? null;

  const status = getStatus(voltageDropPercent);
  const recommendations = buildRecommendations({
    status,
    voltage: input.voltage,
    hasTransformerCapacity: Boolean(transformerRecommendation),
    currentDrawAmp,
    maxRecommendedCurrent: selectedCable.maxRecommendedCurrent,
    topology: input.topology
  });

  return {
    totalConnectedLoadWatt: round2(totalConnectedLoadWatt),
    designLoadWatt: round2(designLoadWatt),
    currentDrawAmp: round2(currentDrawAmp),
    voltageDropVolt: round2(voltageDropVolt),
    voltageDropPercent: round2(voltageDropPercent),
    endOfRunVoltage: round2(endOfRunVoltage),
    transformerRecommendation,
    status,
    recommendations
  };
}

export function calculateSplitRunScenario(input: PlannerInput, splits: number): CalculationResult {
  if (splits < 2) {
    throw new Error("Splits must be 2 or greater");
  }

  const perRunInput: PlannerInput = {
    ...input,
    fixtures: input.fixtures.map((fixture) => ({
      ...fixture,
      quantity: Math.max(1, Math.ceil(fixture.quantity / splits))
    }))
  };

  return calculatePlannerResult(perRunInput);
}

function getStatus(voltageDropPercent: number): TransformerStatus {
  if (voltageDropPercent <= rules.goodVoltageDropPercentMax) {
    return "Good";
  }
  if (voltageDropPercent <= rules.cautionVoltageDropPercentMax) {
    return "Caution";
  }
  return "Not Recommended";
}

function buildRecommendations(params: {
  status: TransformerStatus;
  voltage: 12 | 24;
  hasTransformerCapacity: boolean;
  currentDrawAmp: number;
  maxRecommendedCurrent: number;
  topology: string;
}): string[] {
  const recommendations: string[] = [];

  if (!params.hasTransformerCapacity) {
    recommendations.push("Connected load exceeds 300W transformer range. Split into multiple circuits.");
  }
  if (params.currentDrawAmp > params.maxRecommendedCurrent) {
    recommendations.push("Current draw is above cable recommendation. Select a larger cable gauge.");
  }

  if (params.status === "Caution") {
    recommendations.push("Voltage drop is elevated. Consider shortening run length or splitting the run.");
  }

  if (params.status === "Not Recommended") {
    recommendations.push("Voltage drop is outside best-practice range. Split run or move key fixtures closer.");
    if (params.voltage === 12) {
      recommendations.push("Move this design to 24V architecture for improved performance over long runs.");
    }
  }

  if (params.topology === "single_run") {
    recommendations.push("For branch-heavy sites, tee topology can reduce terminal voltage variance.");
  }

  if (recommendations.length === 0) {
    recommendations.push("System is within recommended range. Proceed to fixture schedule and final review.");
  }

  return recommendations;
}
