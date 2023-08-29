import {useGetCampaigns} from "hooks/queries/api/campaign";
import {useGetSurveyUnitsGroupedByCampaign} from "hooks/queries/api/surveyUnit";
import {useGetQuestionnaires} from "hooks/queries/api/questionnaire";
import {useGetNomenclatures} from "hooks/queries/api/questionnaire/nomenclature";
import {type UseQueryResult} from "@tanstack/react-query";
import {SyncError} from "./queries/SyncError";
import {useEffect} from "react";
import {useRefSync} from "./useRefSync";

type Args = {
  onEnd: (data: PullData, errors: SyncError[]) => void
}

/**
 * Pull data from the server
 */
export const usePullData = ({onEnd}: Args) => {
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
  const allQueries = [
    ...surveyUnitsQueries,
    ...questionnairesQueries,
    ...nomenclatureQueries,
  ];
  const surveyUnits = getQueriesData(surveyUnitsQueries).flat(1);
  const questionnaires = getQueriesData(questionnairesQueries);
  const nomenclatures = getQueriesData(nomenclatureQueries);
  const status = getGlobalStatus(allQueries)
  const data = useRefSync({ campaigns, surveyUnits, questionnaires, nomenclatures })
  const errors = useRefSync(allQueries
      .filter((q) => q.status === "error")
      .map((q) => q.error) as SyncError[])
  const onEndCb = useRefSync(onEnd)

  useEffect(() => {
    if (status === 'finished') {
      onEndCb.current(data.current, errors.current)
    }
  }, [status]);

  return {
    data: data.current,
    status: getGlobalStatus(allQueries),
    progress: {
      surveyUnits: getQueriesProgress(surveyUnitsQueries),
      questionnaires: getQueriesProgress(questionnairesQueries),
      nomenclatures: getQueriesProgress(nomenclatureQueries),
    },
    errors: errors.current,
  };
};

export type PullData = ReturnType<typeof usePullData>["data"]


/**
 * Compute the status of the synchronization
 */
function getGlobalStatus(
  queries: { status: "success" | "error" | "loading" }[]
): "loading" | "finished" {
  const loadingQueries = queries.filter((q) => q.status === "loading");
  if (loadingQueries.length > 0 || queries.length === 0) {
    return "loading";
  }
  return "finished";
}

/**
 * Compute the progression of multiple queries
 */
function getQueriesProgress(
  queries: { status: "error" | "success" | "loading" }[]
): number | null {
  if (queries.length === 0) {
    return null;
  }
  return queries.filter((q) => q.status !== "loading").length / queries.length;
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
