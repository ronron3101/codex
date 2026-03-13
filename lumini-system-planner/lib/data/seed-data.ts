import type { Cable, CalculationRules, Fixture, Transformer } from "@/lib/models";

export const fixtures: Fixture[] = [
  { id: "fx-1", sku: "LUM-SPK-6W", name: "Spike Accent 6W", wattage: 6, availableVoltages: [12, 24] },
  { id: "fx-2", sku: "LUM-WLL-4W", name: "Wall Wash 4W", wattage: 4, availableVoltages: [12, 24] },
  { id: "fx-3", sku: "LUM-PTH-3W", name: "Path Light 3W", wattage: 3, availableVoltages: [12] },
  { id: "fx-4", sku: "LUM-UPL-9W", name: "In-ground Uplight 9W", wattage: 9, availableVoltages: [24] }
];

export const cables: Cable[] = [
  { id: "cb-14", name: "14/2 Direct Burial", resistanceOhmPerMetre: 0.008286, maxRecommendedCurrent: 15 },
  { id: "cb-12", name: "12/2 Direct Burial", resistanceOhmPerMetre: 0.005211, maxRecommendedCurrent: 20 },
  { id: "cb-10", name: "10/2 Direct Burial", resistanceOhmPerMetre: 0.003277, maxRecommendedCurrent: 30 }
];

export const transformers: Transformer[] = [
  { id: "tr-60", name: "LUMINI 60W Transformer", sizeWatt: 60 },
  { id: "tr-100", name: "LUMINI 100W Transformer", sizeWatt: 100 },
  { id: "tr-150", name: "LUMINI 150W Transformer", sizeWatt: 150 },
  { id: "tr-200", name: "LUMINI 200W Transformer", sizeWatt: 200 },
  { id: "tr-300", name: "LUMINI 300W Transformer", sizeWatt: 300 }
];

export const rules: CalculationRules = {
  defaultHeadroomPercent: 25,
  goodVoltageDropPercentMax: 3,
  cautionVoltageDropPercentMax: 8
};
