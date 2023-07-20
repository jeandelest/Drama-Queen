import { useGetListOfSurveyUnitsIdByCampaign } from "ui/query/useApiClient"

export const SynchronizePage = () => {
  const { isLoading, data } = useGetListOfSurveyUnitsIdByCampaign("SIMPSONS2020X00");

  if (isLoading) return 'Loading...'

  return <div>SynchronizePage data: {JSON.stringify(data)} </div>
}