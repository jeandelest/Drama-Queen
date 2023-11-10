import type { Thunks, CreateEvt } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { State as RootState } from "../setup";
import { id } from "tsafe/id";
import { createSelector } from "@reduxjs/toolkit";
import { Evt } from "evt";

export type State = State.NotRunning | State.Running;

export namespace State {
  export type NotRunning = {
    stateDescription: "not running";
  };
  export type Running = {
    stateDescription: "running";
    surveyUnitProgress: number;
    nomenclatureProgress: number;
    surveyProgress: number;
  };
}

export const name = "loadingData";

export const { reducer, actions } = createSlice({
  name,
  initialState: id<State>({
    stateDescription: "not running",
  }),
  reducers: {
    progressUpdated: (
      state,
      {
        payload,
      }: PayloadAction<{
        surveyUnitProgress: number;
        nomenclatureProgress: number;
        surveyProgress: number;
      }>
    ) => {
      const { nomenclatureProgress, surveyProgress, surveyUnitProgress } =
        payload;

      return {
        stateDescription: "running",
        nomenclatureProgress,
        surveyProgress,
        surveyUnitProgress,
      };
    },
    completed: (state) => {
      return { stateDescription: "not running" };
    },
  },
});

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

export const selectors = (() => {
  const runningState = (rootState: RootState) => {
    const state = rootState[name];

    if (state.stateDescription === "not running") {
      return undefined;
    }
    return state;
  };

  const isRunning = createSelector(
    runningState,
    (state) => state !== undefined
  );

  const surveyUnitProgress = createSelector(runningState, (state) => {
    if (state === undefined) {
      return undefined;
    }
    return state.surveyUnitProgress;
  });

  const nomenclatureProgress = createSelector(runningState, (state) => {
    if (state === undefined) {
      return undefined;
    }
    return state.nomenclatureProgress;
  });

  const surveyProgress = createSelector(runningState, (state) => {
    if (state === undefined) {
      return undefined;
    }
    return state.surveyProgress;
  });

  return {
    isRunning,
    surveyUnitProgress,
    nomenclatureProgress,
    surveyProgress,
  };
})();

export const createEvt = (({ evtAction }) => {
  const evt = Evt.create<{
    action: "redirect";
  }>();

  evtAction
    .pipe((action) =>
      action.sliceName === name && action.actionName === "completed"
        ? [action]
        : null
    )
    .attach(() => {
      evt.post({
        action: "redirect",
      });
    });

  return evt;
}) satisfies CreateEvt;
