import axios from "axios";
import memoize from "memoizee";
import type { QueenApi } from "core/ports/QueenApi";
import {
  CampaignSchema,
  IdAndQuestionnaireIdSchema,
  NomenclatureSchema,
  RequiredNomenclaturesSchema,
  SurveyUnitSchema,
} from "./parserSchema";
import {
  Campaign,
  IdAndQuestionnaireId,
  Nomenclature,
  Questionnaire,
  RequiredNomenclatures,
  SurveyUnit,
} from "core/model";

export function createApiClient(params: {
  apiUrl: string;
  getAccessToken: () => string | undefined;
}): QueenApi {
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

    axiosInstance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log(error.response);
        return Promise.reject(error);
      }
    );
    return { axiosInstance };
  })();

  return {
    getSurveyUnitsIdsAndQuestionnaireIdsByCampaign: memoize(
      (idCampaign) =>
        axiosInstance
          .get<IdAndQuestionnaireId>(`/api/campaign/${idCampaign}/survey-units`)
          .then(({ data }) => IdAndQuestionnaireIdSchema.array().parse(data)),
      { promise: true }
    ),
    getSurveyUnits: memoize(
      () =>
        axiosInstance
          .get<SurveyUnit[]>(`/api/survey-units/interviewer`)
          .then(({ data }) =>
            data.map((surveyUnit) => SurveyUnitSchema.parse(surveyUnit))
          ),
      { promise: true }
    ),
    getSurveyUnit: memoize(
      (idSurveyUnit) =>
        axiosInstance
          .get<SurveyUnit>(`/api/survey-unit/${idSurveyUnit}`)
          .then(({ data }) => SurveyUnitSchema.parse(data)),
      { promise: true }
    ),
    putSurveyUnit: (idSurveyUnit, surveyUnit) =>
      axiosInstance.put<typeof surveyUnit>(
        `api/survey-unit/${idSurveyUnit}`,
        surveyUnit
      ),
    putSurveyUnitsData: (surveyUnitsData) =>
      axiosInstance.put<typeof surveyUnitsData>(
        `/api/survey-units/data`,
        surveyUnitsData
      ),
    postSurveyUnitInTemp: (idSurveyUnit, surveyUnit) =>
      axiosInstance.post<typeof surveyUnit>(
        `api/survey-unit/${idSurveyUnit}/temp-zone`,
        surveyUnit
      ),
    getCampaigns: memoize(
      () =>
        axiosInstance
          .get<Campaign>(`api/campaigns`)
          .then(({ data }) => CampaignSchema.array().parse(data)),
      { promise: true }
    ),
    getQuestionnaire: memoize(
      (idSurvey) =>
        axiosInstance
          .get<{ value: Questionnaire }>(`/api/questionnaire/${idSurvey}`)
          .then(({ data }) => data.value),
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
      axiosInstance.post<typeof paradata>(`/api/paradata`, paradata),
  };
}
