import { useGetCampaigns } from "../ui/queries/campaign";
import { useGetSurveyUnitsGroupedByCampaign } from "../ui/queries/surveyUnit";
import { useGetQuestionnaires } from "../ui/queries/questionnaire";
import { useGetNomenclatures } from "../ui/queries/questionnaire/nomenclature";
import { type UseQueryResult } from "@tanstack/react-query";

/**
 * Pull data from the server
 */
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
  const allQueries = [...surveyUnitsQueries, ...questionnairesQueries, ...nomenclatureQueries]
  const surveyUnits = getQueriesData(surveyUnitsQueries);
  const questionnaires = getQueriesData(questionnairesQueries);
  const nomenclatures = getQueriesData(nomenclatureQueries);

  return {
    data: { campaigns, surveyUnits, questionnaires, nomenclatures },
    status: getGlobalStatus(allQueries),
    progress: {
      surveyUnits: getQueriesProgress(surveyUnitsQueries),
      questionnaires: getQueriesProgress(questionnairesQueries),
      nomenclatures: getQueriesProgress(nomenclatureQueries)
    },
    errors: allQueries.filter(q => q.status === 'error').map(q => q.error),
  };
};

/**
 * Compute the status of the synchronization
 */
function getGlobalStatus(queries: {status: "error" | "success" | "loading"}[]): 'loading' | 'error' | 'success' {
  const erroredQueries = queries.filter(q => q.status === 'error')
  const loadingQueries = queries.filter(q => q.status === 'loading')
  if (loadingQueries.length > 0) {
    return 'loading'
  } else if (erroredQueries.length > 0) {
    return 'error'
  }
  return 'success'
}

/**
 * Compute the progression of multiple queries
 */
function getQueriesProgress(queries: {status: "error" | "success" | "loading"}[]): number | null {
  if (queries.length === 0) {
    return null;
  }
  return queries.filter(q => q.status !== 'loading').length / queries.length
}

/**
 * Remove undefined values from an array and remove duplicates
 */
function deduplicate<T>(items: (T | undefined)[]): T[] {
  return [...new Set(items.filter((data) => !!data))] as T[];
}

function getQueriesData<T>(queries: UseQueryResult<T>[]): T[] {
  return queries.filter((q) => q.status === "success").map((q) => q.data!);
}
