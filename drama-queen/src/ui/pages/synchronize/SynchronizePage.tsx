import { useIsFetching } from '@tanstack/react-query'
import { useGetCampaigns, useGetSurveyUnits, useGetSurveyUnitsByCampaign } from 'ui/queries'
import { useSynchronize } from 'ui/queries/useSynchronize'



export const SynchronizePage = () => {
  //const data = useSynchronize()

  //const data = useGetSurveyUnits(["12"])
  const synchro = useSynchronize();

  const isFetching = useIsFetching();

  if (isFetching) return 'Loading...'


  return <div>SynchronizePage data
    {JSON.stringify(synchro)}
  </div>
}