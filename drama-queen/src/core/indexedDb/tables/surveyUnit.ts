import { SurveyUnit } from "core/model/surveyUnit";
import type { Table } from "dexie";

export type SurveyUnitTable = {
  surveyUnit: Table<SurveyUnit, "id">;
};

export const surveyUnitSchema = {
  surveyUnit: "id,data,stateData,personalization,comment,questionnaireId",
};
