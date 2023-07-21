import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetSurveyUnit = (idSurveyUnit: string) => {
  const { getSurveyUnit } = useApiClient();
  return useQuery({
    queryKey: ["surveyUnit", idSurveyUnit],
    queryFn: () => getSurveyUnit(idSurveyUnit),
  });
};

const useGetSurveyUnits = (idsSurveyUnit: string[] | undefined) => {
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
    queryKey: ["campaign", idCampaign],
    queryFn: () => getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(idCampaign),
  });
};

export const useGetSurveyUnitsByCampaign = (idCampaign: string) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign, getSurveyUnit } =
    useApiClient();
  const { data: surveyUnitIdsAndQuestionnaireIds } = useQuery({
    queryKey: ["idSurveyUnit-questionnaireId", idCampaign],
    queryFn: () => getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(idCampaign),
  });
  const surveyUnitIds = surveyUnitIdsAndQuestionnaireIds?.map(({ id }) => id);
  const surveyUnitsResult = useGetSurveyUnits(surveyUnitIds);

  return surveyUnitsResult;
};
/**
 * Returns the list of survey units associated with the campaign and assigned to the interviewer.
 * @param idCampaign
 * @returns SurveyUnit[]
 * We would prefer to get this data with one api fetch
 */
export const useGetSurveyUnitsByCampaignOther = (idCampaign: string) => {
  const { getSurveyUnitsIdsAndQuestionnaireIdsByCampaign, getSurveyUnit } =
    useApiClient();
  return useQuery({
    queryKey: ["campaign", idCampaign],
    queryFn: () =>
      getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(idCampaign).then((data) =>
        data.map(({ id }) => getSurveyUnit(id))
      ),
  });
};
