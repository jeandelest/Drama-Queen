import { useGetCampaigns } from "./campaign";
import { useGetSurveyUnits } from "./surveyUnit";
import { useGetQuestionnaires } from "./questionnaire";
import { useGetNomenclatures } from "./questionnaire/nomenclature";
import { type UseQueryResult } from "@tanstack/react-query";

export const useSynchronize = () => {
  const { data: campaigns } = useGetCampaigns();

  const campaignsIds = campaigns?.map(({ id }) => id) ?? [];
  const questionnaireIds = [
    ...new Set(
      campaigns?.map(({ questionnaireIds }) => questionnaireIds)?.flat() ?? []
    ),
  ];

  const surveyUnitsQueries = useGetSurveyUnits(campaignsIds);

  const questionnairesQueries = useGetQuestionnaires(questionnaireIds);
  const suggestersNames = deduplicate(
    questionnairesQueries
      .map((q) => q.data?.suggesters)
      .flat()
      .map((suggester) => suggester?.name)
  );
  const nomenclatureQueries = useGetNomenclatures(suggestersNames);
  surveyUnitsQueries;
  const surveyUnits = flattenQueriesResults(surveyUnitsQueries);
  const questionnaires = flattenQueriesResults(questionnairesQueries);
  const nomenclatures = flattenQueriesResults(nomenclatureQueries);

  console.log({ campaigns, surveyUnits, questionnaires, nomenclatures });

  return { campaigns, surveyUnits, questionnaires, nomenclatures };
};

/**
 * Remove undefined values from an array and remove duplicates
 */
function deduplicate<T>(items: (T | undefined)[]): T[] {
  return [...new Set(items.filter((data) => !!data))] as T[];
}

function flattenQueriesResults<T>(queries: UseQueryResult<T>[]): T[] {
  // If there is one unfinished query consider it not loaded
  return queries
    .filter((q) => q.status === "success")
    .map((q) => q.data!)
    .flat();
}
