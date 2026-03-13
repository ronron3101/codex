import { z } from "zod";

export const plannerSchema = z.object({
  projectType: z.string().min(2),
  voltage: z.union([z.literal(12), z.literal(24)]),
  topology: z.enum(["single_run", "tee", "hub"]),
  fixtures: z.array(z.object({ fixtureId: z.string().min(1), quantity: z.number().int().min(1) })).min(1),
  cableId: z.string().min(1),
  runLengthMetres: z.number().positive(),
  headroomPercent: z.number().min(0).max(100),
  reserveCapacityWatt: z.number().min(0)
});

export type PlannerFormInput = z.infer<typeof plannerSchema>;
