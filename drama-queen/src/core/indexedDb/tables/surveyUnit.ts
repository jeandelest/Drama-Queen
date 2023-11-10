import type { SurveyUnitWithId } from "core/ports/QueenApi/SurveyUnit";
import type { Table } from "dexie";

export type SurveyUnitTable = {
  surveyUnit: Table<SurveyUnitWithId, string>;
};

export const surveyUnitSchema = {
  surveyUnit: "id,data,stateData,personalization,comment,questionnaireId",
};

//TODO : replace schema (There are impact on legacy queens)
const newSurveyUnitSchema = { surveytUnit: "id" }; //We should index only id (maybe questionnaireId too)
