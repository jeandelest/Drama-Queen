import { useQueries, useQuery } from "@tanstack/react-query";
import { useApiClient } from "ui/api/context";
import { useGetNomenclatures } from "./nomenclature";
import {QuestionnaireSyncError} from "../../SyncError";

export const useGetQuestionnaire = (idQuestionnaire: string) => {
  const { getQuestionnaire } = useApiClient();
  return useQuery({
    queryKey: ["survey", idQuestionnaire],
    queryFn: () => getQuestionnaire(idQuestionnaire),
  });
};

export const useGetQuestionnaires = (questionnaireIds: string[]) => {
  const { getQuestionnaire } = useApiClient();
  return useQueries({
    queries: questionnaireIds.map((questionnaireId) => ({
      queryKey: ["questionnaire", questionnaireId],
      queryFn: () => getQuestionnaire(questionnaireId).catch(e => {
        throw new QuestionnaireSyncError(e, questionnaireId)
      }),
    })),
  });
};
