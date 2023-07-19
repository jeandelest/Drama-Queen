import { db } from 'core/indexedDb'
import { Navigate, useParams } from 'react-router-dom'
import { useLiveQuery } from "dexie-react-hooks";
import { READ_ONLY } from "ui/constants";

type Params = {
  readonly?: typeof READ_ONLY;
  id: string;
}

export function SurveyUnitMapping() {
  const { readonly, id } = useParams<Params>();

  const surveyUnit = useLiveQuery(
    () => db.surveyUnit.get({ id: id }), [id]
  )


  if (!surveyUnit) return <div>In Progress</div>


  return <div>Survey Unit Mapping id : {id}, readonly : {JSON.stringify(surveyUnit)}</div>
}
