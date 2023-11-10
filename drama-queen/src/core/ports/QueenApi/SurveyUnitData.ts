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
    z.boolean(),
    z.boolean().array(),
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

export const SurveyUnitDataSchema = z
  .object({
    CALCULATED: z.record(variableSchema),
    EXTERNAL: z.record(variableSchema),
    COLLECTED: z.record(CollectedValueSchema),
  })
  .partial();

export type SurveyUnitData = z.infer<typeof SurveyUnitDataSchema>;

// Needs this pr to be merge : https://github.com/InseeFr/Lunatic/pull/617
//assert<Extends<SurveyUnitData, LunaticData>>();
