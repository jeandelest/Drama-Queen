import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetSurveyUnit = (idSurveyUnit: string) => {
  const { getSurveyUnit } = useApiClient();
  return useQuery({
    queryKey: ["surveyUnit", idSurveyUnit],
    queryFn: () => getSurveyUnit(idSurveyUnit),
  });
};

export const useGetSurveyUnits = (idsSurveyUnit: string[] | undefined) => {
  const { getSurveyUnit } = useApiClient();
  const surveyUnitIds = idsSurveyUnit ?? [];
  return useQueries({
    queries: surveyUnitIds.map((id) => ({
      queryKey: ["surveyUnit", id],
      queryFn: () => getSurveyUnit(id),
    })),
  });
};

const useGetSurveyUnitIds = (idCampaign: string) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign } = useApiClient();
  return useQuery({
    queryKey: ["idSurveyUnit-questionnaireId", idCampaign],
    queryFn: () => getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(idCampaign),
  });
};

export const useGetSurveyUnitsByCampaign = (idCampaign: string) => {
  const { data: surveyUnitIdsAndQuestionnaireIds } =
    useGetSurveyUnitIds(idCampaign);
  const surveyUnitIds = surveyUnitIdsAndQuestionnaireIds?.map(({ id }) => id);
  const surveyUnitsResult = useGetSurveyUnits(surveyUnitIds);

  return surveyUnitsResult;
};
