import type { State as RootState } from "core/setup";
import { name } from "./state";
import { createSelector } from "@reduxjs/toolkit";

const state = (rootState: RootState) => rootState[name];

const runningStates = ["downloading", "uploading"];

const isRunning = createSelector(state, ({ stateDescription }) =>
  runningStates.includes(stateDescription)
);

const surveyUnitProgress = createSelector(state, (state) =>
  state.stateDescription === "downloading"
    ? state.surveyUnitProgress
    : undefined
);
const nomenclatureProgress = createSelector(state, (state) =>
  state.stateDescription === "downloading"
    ? state.nomenclatureProgress
    : undefined
);
const surveyProgress = createSelector(state, (state) =>
  state.stateDescription === "downloading" ? state.surveyProgress : undefined
);

const uploadProgress = createSelector(state, (state) =>
  state.stateDescription === "uploading" ? state.uploadProgress : undefined
);

export const selectors = {
  isRunning,
  surveyUnitProgress,
  nomenclatureProgress,
  surveyProgress,
  uploadProgress,
};
