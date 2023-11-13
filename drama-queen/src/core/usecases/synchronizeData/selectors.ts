import type { State as RootState } from "core/setup";
import { name } from "./state";
import { createSelector } from "@reduxjs/toolkit";

const state = (rootState: RootState) => rootState[name];

const runningState = createSelector(state, (state) => {
  if (state.stateDescription === "not running") {
    return undefined;
  }
  return state;
});

const isRunning = createSelector(runningState, (state) => state !== undefined);

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

export const selectors = {
  isRunning,
  surveyUnitProgress,
  nomenclatureProgress,
  surveyProgress,
};
