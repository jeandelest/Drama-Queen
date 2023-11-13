import { Thunks } from "core/setup";
import { actions, name, type State } from "./state";

export const thunks = {
  start:
    () =>
    async (...args) => {
      const [dispatch, getState] = args;

      {
        const state = getState()[name];

        if (state.stateDescription === "running") {
          return;
        }
      }

      dispatch(
        actions.progressUpdated({
          nomenclatureProgress: 0,
          surveyProgress: 0,
          surveyUnitProgress: 0,
        })
      );

      for (const progress of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(
          actions.progressUpdated({
            nomenclatureProgress: progress,
            surveyProgress: progress,
            surveyUnitProgress: progress,
          })
        );
      }

      dispatch(actions.completed());
    },
} satisfies Thunks;
