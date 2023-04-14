import { createBrowserRouter } from "react-router-dom";
import Env from "pages/Env";
import IntegratedMapping from "pages/QueenMapping/IntegratedMapping";
import VisualisationMapping from "pages/QueenMapping/VisualisationMapping";

// Dynamic import
//const App = React.lazy(() => import('queen_v2/App'))
// Static import 
//import App from 'queen_v2/App';

export const router = createBrowserRouter([
  {
    path: "/queen/synchronize",
    element: <queen-app />
  },
  {
    path: "/queen/questionnaire/:campaignId/survey-unit/:surveyUnitId",
    element: <IntegratedMapping />
  },
  {
    path: "/queen/visualize",
    element: <VisualisationMapping />
  },
  {
    path: "/env",
    element: <Env />
  },

])