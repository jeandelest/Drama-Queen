import { Campaign } from "../model/campaing";
import { Nomenclature, RequiredNomenclatures } from "../model/nomenclature";
import { Paradata } from "../model/paradata";
import { Survey } from "../model/survey";
import { SurveyUnit } from "../model/surveyUnit";
import { SurveyUnitData } from "../model/surveyUnitData";

export type QueenApi = {
  getSurveyUnitsByCampaign: {
    (idCampaign: string): Promise<SurveyUnit[]>;
  };
  getSurveyUnit: {
    (idSurveyUnit: string): Promise<SurveyUnit>;
  };
  /**
   * We would like to put SurveyUnit without specify id which should be included in
   * surveyUnit but API is not designed like that
   */
  putSurveyUnit: {
    (idSurveyUnit: string, surveyUnit: SurveyUnit): void;
  };
  postSurveyUnitInTemp: {
    (idSurveyUnit: string, surveyUnitData: SurveyUnitData): void;
  };
  getCampaigns: {
    (): Promise<Campaign[]>;
  };
  getSurvey: {
    (idSurvey: string): Promise<Survey>;
  };
  getRequiredNomenclaturesByCampaign: {
    (idCampaign: string): Promise<RequiredNomenclatures>;
  };
  getNomenclature: {
    (idNomenclature: string): Promise<Nomenclature>;
  };
  postParadata: {
    (paradata: Paradata): void;
  };
};
