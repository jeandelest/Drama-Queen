import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";
import { useGetNomenclatures } from "./nomenclature";

export const useGetQuestionnaire = (idQuestionnaire: string) => {
  const { getQuestionnaire } = useApiClient();
  return useQuery({
    queryKey: ["survey", idQuestionnaire],
    queryFn: () => getQuestionnaire(idQuestionnaire),
  });
};

export const useGetQuestionnaireAndNomenclatures = (idSurvey: string) => {
  const surveyResult = useGetQuestionnaire(idSurvey);
  const nomenclaturesResult = useGetNomenclatures(
    surveyResult.data?.suggesters
  );
  return { surveyResult, nomenclaturesResult };
};
