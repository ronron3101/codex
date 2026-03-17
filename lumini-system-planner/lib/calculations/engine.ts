import { cables, fixtures, rules, transformers } from "@/lib/data/seed-data";
import { buildRecommendations } from "@/lib/calculations/recommendations";
import type { CalculationResult, PlannerInput, TransformerStatus } from "@/lib/models";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function topologyResistanceMultiplier(topology: PlannerInput["topology"]): number {
  if (topology === "single_run") {
    return 1;
  }
  if (topology === "tee") {
    return 0.85;
  }
  return 0.7;
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

  // Two-conductor run model: outbound + return path (2x length), adjusted by topology balancing.
  const loopResistance =
    selectedCable.resistanceOhmPerMetre * input.runLengthMetres * 2 * topologyResistanceMultiplier(input.topology);
  const voltageDropVolt = currentDrawAmp * loopResistance;
  const voltageDropPercent = (voltageDropVolt / input.voltage) * 100;
  const endOfRunVoltage = input.voltage - voltageDropVolt;

  const transformerRecommendation =
    transformers.find((transformer) => transformer.sizeWatt >= designLoadWatt) ?? null;

  const status = getStatus(voltageDropPercent);

  return {
    totalConnectedLoadWatt: round2(totalConnectedLoadWatt),
    designLoadWatt: round2(designLoadWatt),
    currentDrawAmp: round2(currentDrawAmp),
    voltageDropVolt: round2(voltageDropVolt),
    voltageDropPercent: round2(voltageDropPercent),
    endOfRunVoltage: round2(endOfRunVoltage),
    transformerRecommendation,
    status,
    recommendations: buildRecommendations({
      status,
      voltage: input.voltage,
      hasTransformerCapacity: Boolean(transformerRecommendation),
      currentDrawAmp,
      maxRecommendedCurrent: selectedCable.maxRecommendedCurrent,
      topology: input.topology,
      voltageDropPercent
    })
  };
}

export function calculateSplitRunScenario(input: PlannerInput, splits: number): CalculationResult {
  if (splits < 2) {
    throw new Error("Splits must be 2 or greater");
  }

  return calculatePlannerResult({
    ...input,
    fixtures: input.fixtures.map((fixture) => ({
      ...fixture,
      quantity: Math.max(1, Math.ceil(fixture.quantity / splits))
    }))
  });
}
