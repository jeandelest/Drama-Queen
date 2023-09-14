import { db } from 'core/indexedDb'
import { useLiveQuery } from "dexie-react-hooks";


export const useGetLocalSurveyUnit = (surveyUnitId: string) => {
  return useLiveQuery(() => db.surveyUnit.get(surveyUnitId))
};

export const useGetLocalSurveyUnits = (surveyUnitIds: string[]) => useLiveQuery(
  () => db.surveyUnit.bulkGet(surveyUnitIds)
)