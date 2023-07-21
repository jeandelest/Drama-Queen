import { useIsFetching } from '@tanstack/react-query'



export const SynchronizePage = () => {
  const isFetching = useIsFetching()

  if (isFetching) return 'Loading...'

  return <div>SynchronizePage data</div>
}