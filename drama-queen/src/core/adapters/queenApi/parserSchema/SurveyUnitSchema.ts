import { z } from "zod";
import { SurveyUnitDataSchema } from "./SurveyUnitDataSchema";

export const IdAndQuestionnaireIdSchema = z.object({
  id: z.string(),
  questionnaireId: z.string(),
});

const StateDataSchema = z.object({
  state: z.enum(["INIT", "COMPLETED", "VALIDATED", "EXTRACTED"]).nullable(),
  date: z.number().int().min(0), //Should be improve when zod support unix timestamp
  currentPage: z.string(), //Same type as pager.page in Lunatic
});

export const SurveyUnitSchema = z.object({
  id: z.string(),
  questionnaireId: z.string(),
  personalization: z.union([z.object({}).array(), z.object({})]),
  data: SurveyUnitDataSchema,
  comment: z.object({}), // not implemented yet, only present in test data
  stateData: StateDataSchema.optional(),
});
