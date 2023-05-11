import Env from "pages/Env";
import SurveyMapping from "pages/QueenMapping/SurveyMapping";
import SurveyUnitMapping from "pages/QueenMapping/SurveyUnitMapping";
import VisualisationMapping from "pages/QueenMapping/VisualisationMapping";
import { READ_ONLY } from "utils/constants";

//ReadOnly path is a bad pattern must be change (affects pearl,moog,queen)
export const routes = [
  {
    path: "queen/env",
    element: <Env />
  },
  {
    path: "/queen/synchronize",
    element: <queen-app />
  },
  {
    path: `/queen/:${READ_ONLY}?/survey-unit/:id`,
    element: <SurveyUnitMapping />
  },
  {
    path: `/queen/:${READ_ONLY}?/questionnaire/:campaignId/survey-unit/:surveyUnitId`,
    element: <SurveyMapping />
  },
  {
    path: "/queen/visualize/*",
    element: <VisualisationMapping />
  },
]