import { QueenApi } from "./QueenApi";
import { surveySample } from "./mockData/surveySample";

export function createMockApiClient() {
  return {
    getListOfSurveyUnitsIdsByCampaign: (_idCampaign) =>
      Promise.resolve([{ id: "id", questionnaireId: "questionnaireId" }]),
    getSurveyUnitsByCampaign: (_idCampaign) =>
      Promise.reject("Not implemented"),
    getSurveyUnit: (idSurveyUnit) =>
      Promise.resolve(createSUMocked({ idSu: idSurveyUnit })),
    putSurveyUnit: (idSurveyUnit, surveyUnit) =>
      console.log("putSurveyUnit", `id: ${idSurveyUnit}`, surveyUnit),
    postSurveyUnitInTemp: (idSurveyUnit, surveyUnitData) =>
      console.log(
        "postSurveyUnitInTemp",
        `id: ${idSurveyUnit}`,
        surveyUnitData
      ),
    getCampaigns: () =>
      Promise.resolve([
        {
          id: "id",
          questionnaireIds: ["questionnaireIds"],
        },
      ]),
    getSurvey: (_idSurvey) => Promise.resolve(surveySample),
    getRequiredNomenclaturesByCampaign: () => Promise.resolve([]),
    getNomenclature: (idNomenclature) =>
      Promise.resolve([{ id: `${idNomenclature}`, label: "label" }]),
    postParadata: (paradata) => console.log("postParadata", paradata),
  } satisfies QueenApi;
}

function createSUMocked(props: { idSu?: string; idCampaign?: string }) {
  const { idSu, idCampaign } = props;
  return {
    id: `idSU:${idSu}`,
    questionnaireId: `idCampaign${idCampaign}`,
    personalisation: [{}],
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
