import type { QueenApi } from "core/ports/QueenApi";
import { surveySample } from "./mockData/surveySample";

export function createApiClient(): QueenApi {
  return {
    getSurveyUnitsIdsAndQuestionnaireIdsByCampaign: (_idCampaign) =>
      Promise.resolve([{ id: "id", questionnaireId: "questionnaireId" }]),
    getSurveyUnits: () =>
      Promise.resolve([
        createSUMocked({}),
        createSUMocked({ idCampaign: "camp2", idSu: "su2" }),
      ]),
    getSurveyUnit: (idSurveyUnit) =>
      Promise.resolve(createSUMocked({ idSu: idSurveyUnit })),
    putSurveyUnit: (idSurveyUnit, surveyUnit) =>
      console.log("putSurveyUnit", `id: ${idSurveyUnit}`, surveyUnit),
    putSurveyUnitsData: (surveyUnitsData) => {
      console.log("putSurveyUnits");
      console.table(surveyUnitsData);
    },
    postSurveyUnitInTemp: (idSurveyUnit, surveyUnit) =>
      console.log("postSurveyUnitInTemp", `id: ${idSurveyUnit}`, surveyUnit),
    getCampaigns: () =>
      Promise.resolve([
        {
          id: "id",
          questionnaireIds: ["questionnaireIds"],
        },
      ]),
    getQuestionnaire: (_idSurvey) => Promise.resolve(surveySample),
    getRequiredNomenclaturesByCampaign: () => Promise.resolve([]),
    getNomenclature: (idNomenclature) =>
      Promise.resolve([{ id: `${idNomenclature}`, label: "label" }]),
    postParadata: (paradata) => console.log("postParadata", paradata),
  };
}

function createSUMocked(props: { idSu?: string; idCampaign?: string }) {
  const { idSu = "su1", idCampaign = "campaign1" } = props;
  return {
    id: `idSU:${idSu}`,
    questionnaireId: `idCampaign${idCampaign}`,
    personalization: [{}],
    data: {
      EXTERNAL: {},
      CALCULATED: {},
      COLLECTED: {
        PRENOM: {
          EDITED: null,
          FORCED: null,
          INPUTED: null,
          PREVIOUS: null,
          COLLECTED: ["Dad", "Mom", "Unknow"],
        },
      },
    },
    stateData: {
      date: 1,
      currentPage: "",
      state: null,
    },
    comment: {},
  };
}
