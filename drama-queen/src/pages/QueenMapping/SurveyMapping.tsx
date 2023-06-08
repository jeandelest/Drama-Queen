import { useParams } from 'react-router-dom'


function SurveyMapping() {
  const { questionnaireId } = useParams()

  return questionnaireId?.toLowerCase().includes("_queenv2") ? <queen-v2-app /> : <queen-app />
}

export default SurveyMapping
