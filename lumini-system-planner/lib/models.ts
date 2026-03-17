export type SystemVoltage = 12 | 24;
export type RunTopology = "single_run" | "tee" | "hub";
export type TransformerStatus = "Good" | "Caution" | "Not Recommended";

export interface Fixture {
  id: string;
  sku: string;
  name: string;
  wattage: number;
  availableVoltages: SystemVoltage[];
}

export interface Cable {
  id: string;
  name: string;
  resistanceOhmPerMetre: number;
  maxRecommendedCurrent: number;
}

export interface Transformer {
  id: string;
  name: string;
  sizeWatt: number;
}

export interface CalculationRules {
  defaultHeadroomPercent: number;
  goodVoltageDropPercentMax: number;
  cautionVoltageDropPercentMax: number;
}

export interface PlannerFixtureInput {
  fixtureId: string;
  quantity: number;
}

export interface PlannerInput {
  projectType: string;
  voltage: SystemVoltage;
  topology: RunTopology;
  fixtures: PlannerFixtureInput[];
  cableId: string;
  runLengthMetres: number;
  headroomPercent: number;
  reserveCapacityWatt: number;
}

export interface RecommendationContext {
  status: TransformerStatus;
  voltage: SystemVoltage;
  hasTransformerCapacity: boolean;
  currentDrawAmp: number;
  maxRecommendedCurrent: number;
  topology: RunTopology;
  voltageDropPercent: number;
}

export interface CalculationResult {
  totalConnectedLoadWatt: number;
  designLoadWatt: number;
  currentDrawAmp: number;
  voltageDropVolt: number;
  voltageDropPercent: number;
  endOfRunVoltage: number;
  transformerRecommendation: Transformer | null;
  status: TransformerStatus;
  recommendations: string[];
}
