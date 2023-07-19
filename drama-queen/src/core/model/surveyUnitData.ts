import { z } from "zod";
import type { LunaticData, LunaticCollectedValue } from "@inseefr/lunatic";
import { assert } from "tsafe/assert";
import type { Extends } from "tsafe/Extends";

const variableSchema = z
  .union([
    z.string(),
    z.number(),
    z.string().nullable().array(),
    z.number().array(),
  ])
  .nullable();

const CollectedValueSchema = z.object({
  COLLECTED: variableSchema,
  EDITED: variableSchema,
  FORCED: variableSchema,
  INPUTED: variableSchema,
  PREVIOUS: variableSchema,
});

type CollectedValue = z.infer<typeof CollectedValueSchema>;

assert<Extends<CollectedValue, LunaticCollectedValue>>();

export const SurveyUnitDataSchema = z.object({
  CALCULATED: z.record(variableSchema),
  EXTERNAL: z.record(variableSchema),
  COLLECTED: z.record(CollectedValueSchema),
});

export type SurveyUnitData = z.infer<typeof SurveyUnitDataSchema>;

assert<Extends<SurveyUnitData, LunaticData>>();
