import type { Campaign } from "core/ports/QueenApi/Campaing";
import type {
  Nomenclature,
  RequiredNomenclatures,
} from "core/ports/QueenApi/Nomenclature";
import type { Paradata } from "core/ports/QueenApi/Paradata";
import type { Questionnaire } from "core/ports/QueenApi/Questionnaire";
import type {
  IdAndQuestionnaireId,
  SurveyUnitWithId,
} from "core/ports/QueenApi/SurveyUnit";

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
