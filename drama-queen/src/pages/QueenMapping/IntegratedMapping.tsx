import { useParams } from 'react-router-dom'


function IntegratedMapping() {
  const { campaignId } = useParams()
  
  return campaignId?.toLowerCase().includes("v2") ? <queen-v2-app /> : <queen-app />
}

export default IntegratedMapping
