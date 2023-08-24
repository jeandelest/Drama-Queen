import { useIsFetching } from '@tanstack/react-query'
import { useGetCampaigns, useGetSurveyUnitsGroupedByCampaign } from 'ui/queries'
import { useSynchronize } from 'ui/queries/useSynchronize'



export const SynchronizePage = () => {

  //const data = useGetSurveyUnits(["12"])
  const synchro = useSynchronize();
  //const data = useGetSurveyUnitsByCampaign("VQS2021X00")
  const isFetching = useIsFetching();

  if (isFetching) return 'Loading...'


  return <div>SynchronizePage data
    {JSON.stringify(synchro)}
  </div>
}