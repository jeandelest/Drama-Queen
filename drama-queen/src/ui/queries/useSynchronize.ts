import { useGetCampaigns } from "./campaign";
import { useGetSurveyUnitsGroupedByCampaign } from "./surveyUnit";
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

  const surveyUnitsQueries = useGetSurveyUnitsGroupedByCampaign(campaignsIds);

  const questionnairesQueries = useGetQuestionnaires(questionnaireIds);
  const suggestersNames = deduplicate(
    questionnairesQueries
      .map((q) => q.data?.suggesters)
      .flat()
      .map((suggester) => suggester?.name)
  );
  const nomenclatureQueries = useGetNomenclatures(suggestersNames);

  const surveyUnits = onSuccessQueriesResultsData(surveyUnitsQueries);
  const questionnaires = onSuccessQueriesResultsData(questionnairesQueries);
  const nomenclatures = onSuccessQueriesResultsData(nomenclatureQueries);

  console.log({ campaigns, surveyUnits, questionnaires, nomenclatures });

  return { campaigns, surveyUnits, questionnaires, nomenclatures };
};

/**
 * Remove undefined values from an array and remove duplicates
 */
function deduplicate<T>(items: (T | undefined)[]): T[] {
  return [...new Set(items.filter((data) => !!data))] as T[];
}

function onSuccessQueriesResultsData<T>(queries: UseQueryResult<T>[]): T[] {
  // If there is one unfinished query consider it not loaded
  return queries.filter((q) => q.status === "success").map((q) => q.data!);
}
