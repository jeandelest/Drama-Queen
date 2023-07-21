import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetSurveyUnitsIdsAndQuestionnaireIdsByCampaign = (
  idCampaign: string
) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign } = useApiClient();
  return useQuery({
    queryKey: ["campaign", idCampaign],
    queryFn: () => getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(idCampaign),
  });
};
