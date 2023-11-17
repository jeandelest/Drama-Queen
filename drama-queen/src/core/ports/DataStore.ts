import { Paradata, SurveyUnit } from "core/model";

export type DataStore = {
  updateSurveyUnit: (surveyUnit: SurveyUnit) => Promise<string>;
  deleteSurveyUnit: (id: string) => void;
  getAllSurveyUnit: () => Promise<SurveyUnit[]>;
  getSurveyUnit: (id: string) => Promise<SurveyUnit>;
  getAllParadata: () => Promise<Paradata[]>;
  deleteParadata: (id: string) => void;
  getParadata: (id: string) => Promise<Paradata>;
};
