import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";

export const useGetListOfSurveyUnitsIdByCampaign = (idCampaign: string) => {
  const { getListOfSurveyUnitsIdsByCampaign } = useApiClient();
  return useQuery({
    queryKey: ["campaign", idCampaign],
    queryFn: () => getListOfSurveyUnitsIdsByCampaign(idCampaign),
  });
};


export const useGetSurveyUnit = (idSurveyUnit: string) => {
  const { getSurveyUnit } = useApiClient();
  return useQuery({
    queryKey: ["surveyUnit", idSurveyUnit],
    queryFn: () => getSurveyUnit(idSurveyUnit),
  });
};



const useGetSurveyUnitsByCampaign = (idCampaign: string) => {
  const { getSurveyUnitsByCampaign } = useApiClient();
  return useQuery({
    queryKey: ["campaign", idCampaign],
    queryFn: () => getSurveyUnitsByCampaign(idCampaign),
  });
};