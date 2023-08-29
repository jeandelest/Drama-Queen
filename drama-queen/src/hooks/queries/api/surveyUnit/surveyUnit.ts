import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";
import {CampaignSyncError, QuestionnaireSyncError, SurveyUnitSyncError} from "../../SyncError";
import {SurveyUnitWithId} from "../../../../core/model/surveyUnit";

export const useGetSurveyUnit = (idSurveyUnit: string) => {
  const { getSurveyUnit } = useApiClient();
  return useQuery({
    queryKey: ["surveyUnit", idSurveyUnit],
    queryFn: () => getSurveyUnit(idSurveyUnit),
  });
};

export const useGetSurveyUnitsGroupedByCampaign = (campaignIds: string[]) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign, getSurveyUnit } =
    useApiClient();
  return useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: ["idSurveyUnit-questionnaireId", campaignId],
      queryFn: async () => {
        const data = await getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(
          campaignId
        ).catch(e => {
          throw new CampaignSyncError(e, campaignId)
        });
        return Promise.all(
          data.map(({ id }) => {
            return getSurveyUnit(id).catch(e => {
              throw new SurveyUnitSyncError(e, id, campaignId)
            });
          })
        );
      },
    })),
  });
};
