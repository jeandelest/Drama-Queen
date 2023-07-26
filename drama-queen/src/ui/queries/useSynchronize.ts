import { useGetCampaigns } from "./campaign";
import { useGetQuestionnaireAndNomenclatures } from "./questionnaire";
import { useGetSurveyUnitsByCampaign } from "./surveyUnit";

export const useSynchronize = () => {
  const { data: campaigns } = useGetCampaigns();
  const surveyUnits = campaigns?.reduce(
    (acc, { id, questionnaireIds }) => ({
      ...acc,
      id: {
        //surveyUnit: useGetSurveyUnitsByCampaign(id),
        surveyUnit: id,
        // questionnaires: questionnaireIds.map((idQuestionnaire) =>
        //   useGetQuestionnaireAndNomenclatures(idQuestionnaire)
        // ),
      },
    }),
    {}
  );
  return { campaigns, surveyUnits };
};
