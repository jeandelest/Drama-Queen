import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isQueenV2Survey } from "utils/checkLunaticVersion/isQueenV2Survey";





function VisualisationMapping() {
  const [searchParams,] = useSearchParams();  // TODO add mapping rules
  const questionnaireUrl = searchParams.get("questionnaire")
  const [isQueenV2, setIsQueenV2] = useState<boolean | undefined>(undefined);
  const [isSurveyFetched, setIsSurveyFetched] = useState<boolean>(false);

  useEffect(() => {
    isQueenV2Survey(questionnaireUrl).then((r) => {
      setIsQueenV2(r);
      setIsSurveyFetched(true);
    })

  }, [questionnaireUrl]);

  if (!isSurveyFetched) return <div>Loading</div>

  return isQueenV2 ? <queen-v2-app /> : <queen-app />
}

export default VisualisationMapping
