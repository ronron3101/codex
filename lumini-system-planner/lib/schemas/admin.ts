import { z } from "zod";

export const fixtureInputSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  wattage: z.number().positive(),
  supportedVoltages: z.array(z.union([z.literal(12), z.literal(24)])).min(1)
});

export const cableInputSchema = z.object({
  name: z.string().min(2),
  resistanceOhmPerMetre: z.number().positive(),
  maxRecommendedCurrent: z.number().positive()
});

export const transformerInputSchema = z.object({
  name: z.string().min(2),
  sizeWatt: z.number().positive()
});

export const rulesInputSchema = z.object({
  defaultHeadroomPercent: z.number().min(0).max(100),
  goodVoltageDropPercentMax: z.number().positive(),
  cautionVoltageDropPercentMax: z.number().positive()
});
