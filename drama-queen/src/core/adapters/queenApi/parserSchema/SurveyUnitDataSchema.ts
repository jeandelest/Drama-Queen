import { z } from "zod";

const VariableSchema = z
  .union([
    z.string(),
    z.number(),
    z.union([z.string().nullable(), z.number(), z.boolean()]).array(),
    z.boolean(),
  ])
  .nullable();

const CollectedValueSchema = z.object({
  COLLECTED: VariableSchema,
  EDITED: VariableSchema,
  FORCED: VariableSchema,
  INPUTED: VariableSchema,
  PREVIOUS: VariableSchema,
});

export const SurveyUnitDataSchema = z
  .object({
    CALCULATED: z.record(VariableSchema),
    EXTERNAL: z.record(VariableSchema),
    COLLECTED: z.record(CollectedValueSchema),
  })
  .partial();
