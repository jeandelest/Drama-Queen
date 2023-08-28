import { Campaign } from "../model/campaing";
import { Nomenclature, RequiredNomenclatures } from "../model/nomenclature";
import { Paradata } from "../model/paradata";
import { Questionnaire } from "../model/survey";
import { IdAndQuestionnaireId, SurveyUnitWithId } from "../model/surveyUnit";
import { SurveyUnitData } from "../model/surveyUnitData";

export type QueenApi = {
  getSurveyUnitsIdsAndQuestionnaireIdsByCampaign: (
    idCampaign: string
  ) => Promise<IdAndQuestionnaireId[]>;
  /**
   * We hope API will implement this endpoint
   * @param idCampaign
   * @return Array of SurveyUnit for campaign
   * @todo Implement this functions in the API
   */
  getSurveyUnitsByCampaign: (idCampaign: string) => Promise<SurveyUnitWithId[]>;
  getSurveyUnit: (idSurveyUnit: string) => Promise<SurveyUnitWithId>;
  putSurveyUnit: (idSurveyUnit: string, surveyUnit: SurveyUnitWithId) => void;
  postSurveyUnitInTemp: (
    idSurveyUnit: string,
    surveyUnit: SurveyUnitWithId
  ) => void;
  getCampaigns: () => Promise<Campaign[]>;
  getQuestionnaire: (idQuestionnaire: string) => Promise<Questionnaire>;
  getRequiredNomenclaturesByCampaign: (
    idCampaign: string
  ) => Promise<RequiredNomenclatures>;
  getNomenclature: (idNomenclature: string) => Promise<Nomenclature>;
  postParadata: (paradata: Paradata) => void;
};
