import { Campaign } from "../model/campaing";
import { Nomenclature, RequiredNomenclatures } from "../model/nomenclature";
import { Paradata } from "../model/paradata";
import { Survey } from "../model/survey";
import { IdAndQuestionnaireId, SurveyUnit } from "../model/surveyUnit";
import { SurveyUnitData } from "../model/surveyUnitData";

export type QueenApi = {
  getListOfSurveyUnitsIdsByCampaign: {
    (idCampaign: string): Promise<IdAndQuestionnaireId[]>;
  };
  /**
   * We hope API will implement this endpoint
   * @param idCampaign
   * @return Array of SurveyUnit for campaign 
   * @todo Implement this functions in the API
   */
  getSurveyUnitsByCampaign: {
    (idCampaign: string): Promise<SurveyUnit[]>;
  };
  getSurveyUnit: {
    (idSurveyUnit: string): Promise<SurveyUnit>;
  };
  putSurveyUnit: {
    (idSurveyUnit: string, surveyUnit: SurveyUnit): void;
  };
  /**
   *
   */
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
