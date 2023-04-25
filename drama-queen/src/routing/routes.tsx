import Env from "pages/Env";
import IntegratedMapping from "pages/QueenMapping/IntegratedMapping";
import VisualisationMapping from "pages/QueenMapping/VisualisationMapping";

export const routes = [
  {
    path: "/env",
    element: <Env />
  },
  {
    path: "/queen/synchronize",
    element: <queen-app />
  },
  {
    path: "/queen/questionnaire/:campaignId/survey-unit/:surveyUnitId",
    element: <IntegratedMapping />
  },
  {
    path: "/queen/*",
    element: <VisualisationMapping />
  },
]