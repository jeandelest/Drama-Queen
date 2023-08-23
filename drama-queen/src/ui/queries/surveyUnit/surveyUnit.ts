import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetSurveyUnit = (idSurveyUnit: string) => {
  const { getSurveyUnit } = useApiClient();
  return useQuery({
    queryKey: ["surveyUnit", idSurveyUnit],
    queryFn: () => getSurveyUnit(idSurveyUnit),
  });
};

export const useGetSurveyUnits = (idsCampaign: string[]) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign, getSurveyUnit } =
    useApiClient();
  return useQueries({
    queries: idsCampaign.map((idCampaign) => ({
      queryKey: ["idSurveyUnit-questionnaireId", idCampaign],
      queryFn: async () => {
        const data = await getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(
          idCampaign
        );
        return Promise.all(
          data.map(({ id }) => {
            return getSurveyUnit(id);
          })
        );
      },
    })),
  });
};
