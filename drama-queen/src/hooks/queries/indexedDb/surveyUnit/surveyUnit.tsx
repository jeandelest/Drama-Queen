import { useMutation } from "@tanstack/react-query";
import { db } from 'core/indexedDb'
import { SurveyUnitWithId } from "core/model/surveyUnit";
import { useLiveQuery } from "dexie-react-hooks";


export const useGetLocalSurveyUnit = (surveyUnitId: string) => {
  return useLiveQuery(() => db.surveyUnit.get(surveyUnitId))
};

export const useGetLocalSurveyUnits = (surveyUnitIds: string[]) => useLiveQuery(
  () => db.surveyUnit.bulkGet(surveyUnitIds)
)

export const useAddSurveyUnit = (surveyUnit: SurveyUnitWithId) => useMutation({
  mutationFn: () => db.surveyUnit.add(surveyUnit)
})

export const useBulkAddSurveyUnit = (surveyUnits: SurveyUnitWithId[]) => useMutation(
  { mutationFn: () => db.surveyUnit.bulkAdd(surveyUnits) }
)

export const useDeleteLocalSurveyUnit = (surveyUnitId: string) => useMutation({
  mutationFn: () => db.surveyUnit.delete(surveyUnitId)
})

export const useBulkDeleteSurveyUnit = (surveyUnitIds: string[]) => useMutation(
  { mutationFn: () => db.surveyUnit.bulkDelete(surveyUnitIds) }
)