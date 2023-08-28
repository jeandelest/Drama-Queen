import type { SurveyUnitWithId } from "core/model/surveyUnit";
import type { Table } from "dexie";

export type SurveyUnitTable = {
  surveyUnit: Table<SurveyUnitWithId, string>;
};

export const surveyUnitSchema = {
  surveyUnit: "id,data,stateData,personalization,comment,questionnaireId",
};

const newSurveyUnitSchema = { surveytUnit: "id" }; //We should index only id (maybe questionnaireId too)
