import { z } from "zod";
import { SurveyUnitDataSchema } from "./surveyUnitData";

export const IdAndQuestionnaireIdSchema = z.object({
  id: z.string(),
  questionnaireId: z.string(),
});

export type IdAndQuestionnaireId = z.infer<typeof IdAndQuestionnaireIdSchema>;

const StateDataSchema = z.object({
  state: z.enum(["INIT", "COMPLETED", "VALIDATED"]).nullable(),
  date: z.number().int().min(0), //Should be improve when zod support unix timestamp
  currentPage: z.string(), //Same type as pager.page in Lunatic
});

export const SurveyUnitSchema = z.object({
  questionnaireId: z.string(),
  personalisation: z.object({}).passthrough().array(),
  data: SurveyUnitDataSchema,
  comment: z.object({}), // not implemented yet, only present in test data
  stateData: StateDataSchema,
});

export type SurveyUnit = z.infer<typeof SurveyUnitSchema>;
