import type { Table } from "dexie";

//TODO Use Type from lunatic (import @inseefr/lunatic as devDependencies)
export type SurveyUnit = {
  id: number;
  data: object;
  questionnaireId: string;
  comment: object;
  stateData: object;
  personalization: object;
};

export type SurveyUnitTable = {
  surveyUnit: Table<SurveyUnit>;
};

export const surveyUnitSchema = {
  surveyUnit: "id,data,stateData,personalization,comment,questionnaireId",
};
