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

const uploadProgress = createSelector(runningState, (state) => {
  if (state === undefined) return undefined;
  return state.uploadProgress;
});

export const selectors = {
  isRunning,
  uploadProgress,
};
