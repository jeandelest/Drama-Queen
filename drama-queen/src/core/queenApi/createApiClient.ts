import {
  IdAndQuestionnaireIdSchema,
  SurveyUnit,
  SurveyUnitSchema,
} from "../model/surveyUnit";
import axios from "axios";
import memoize from "memoizee";
import { SurveyUnitData } from "../model/surveyUnitData";
import { QueenApi } from "./QueenApi";
import { Campaign, CampaignSchema } from "../model/campaing";
import { APIReturnedListOfSurvey, Questionnaire } from "../model/survey";
import {
  Nomenclature,
  NomenclatureSchema,
  RequiredNomenclatures,
  RequiredNomenclaturesSchema,
} from "../model/nomenclature";
import { Paradata } from "../model/paradata";

export function createApiClient(params: {
  apiUrl: string;
  getAccessToken: () => string | null;
}) {
  const { apiUrl, getAccessToken } = params;

  const { axiosInstance } = (() => {
    const axiosInstance = axios.create({ baseURL: apiUrl, timeout: 120_000 });

    axiosInstance.interceptors.request.use((config) => ({
      ...(config as any),
      headers: {
        ...config.headers,
        ...(() => {
          const accessToken = getAccessToken();

          if (!accessToken) {
            return undefined;
          }

          return {
            Authorization: `Bearer ${accessToken}`,
          };
        })(),
      },
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json;charset=utf-8",
    }));

    return { axiosInstance };
  })();

  return {
    getSurveyUnitsIdsAndQuestionnaireIdsByCampaign: memoize(
      (idCampaign) =>
        axiosInstance
          .get<SurveyUnit>(`/api/campaign/${idCampaign}/survey-units`)
          .then(({ data }) => IdAndQuestionnaireIdSchema.array().parse(data)),
      { promise: true }
    ),
    getSurveyUnitsByCampaign: memoize(
      (_idCampaign) => {
        // axiosInstance
        //   .get<SurveyUnit>(`/api/campaign/${idCampaign}/survey-units`)
        //   .then(({ data }) => SurveyUnitSchema.array().parse(data)),
        throw new Error("NotImplemented");
      },
      { promise: true }
    ),
    getSurveyUnit: memoize(
      (idSurveyUnit) =>
        axiosInstance
          .get<SurveyUnitData>(`/api/survey-unit/${idSurveyUnit}`)
          .then(({ data }) => SurveyUnitSchema.parse(data)),
      { promise: true }
    ),
    putSurveyUnit: (idSurveyUnit, surveyUnit) =>
      axiosInstance.put<SurveyUnit>(
        `api/survey-unit/${idSurveyUnit}`,
        surveyUnit
      ),
    postSurveyUnitInTemp: (idSurveyUnit, surveyUnit) =>
      axiosInstance.post<SurveyUnit>(
        `api/survey-unit/${idSurveyUnit}/temp-zone`,
        surveyUnit
      ),
    getCampaigns: memoize(
      () =>
        axiosInstance
          .get<Campaign[]>(`api/campaigns`)
          .then(({ data }) => CampaignSchema.array().parse(data)),
      { promise: true }
    ),
    getQuestionnaire: memoize(
      (idSurvey) =>
        axiosInstance
          .get<APIReturnedListOfSurvey>(`/api/questionnaire/${idSurvey}`)
          .then(({ data }) => {
            return data.value;
          }),
      { promise: true }
    ),
    getRequiredNomenclaturesByCampaign: memoize(
      (idNomenclature) =>
        axiosInstance
          .get<RequiredNomenclatures>(
            `/api/questionnaire/${idNomenclature}/required-nomenclatures`
          )
          .then(({ data }) => RequiredNomenclaturesSchema.parse(data)),
      { promise: true }
    ),
    getNomenclature: memoize(
      (idNomenclature) =>
        axiosInstance
          .get<Nomenclature>(`/api/nomenclature/${idNomenclature}`)
          .then(({ data }) => NomenclatureSchema.parse(data)),
      { promise: true }
    ),
    postParadata: (paradata) =>
      axiosInstance.post<Paradata>(`/api/paradata`, paradata),
  } satisfies QueenApi;
}
