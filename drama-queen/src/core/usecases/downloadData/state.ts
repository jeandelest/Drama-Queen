import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";

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
export const name = "downloadData";
export const { reducer, actions } = createSlice({
  name,
  initialState: id<State>(
    id<State.NotRunning>({
      stateDescription: "not running",
    })
  ),
  reducers: {
    running: () =>
      id<State>(
        id<State.Running>({
          stateDescription: "running",
          surveyProgress: 0,
          nomenclatureProgress: 0,
          surveyUnitProgress: 0,
        })
      ),
    progressSurveyUnit: (
      state,
      {
        payload,
      }: PayloadAction<{
        surveyUnitProgress: number;
      }>
    ) => {
      const { surveyUnitProgress } = payload;
      assert(state.stateDescription === "running");
      return {
        ...state,
        surveyUnitProgress,
      };
    },
    progressSurvey: (
      state,
      {
        payload,
      }: PayloadAction<{
        surveyProgress: number;
      }>
    ) => {
      assert(state.stateDescription === "running");
      const { surveyProgress } = payload;
      return {
        ...state,
        surveyProgress,
      };
    },
    progressNomenclature: (
      state,
      {
        payload,
      }: PayloadAction<{
        nomenclatureProgress: number;
      }>
    ) => {
      assert(state.stateDescription === "running");

      const { nomenclatureProgress } = payload;
      return {
        ...state,
        nomenclatureProgress,
      };
    },
    completed: (_state) => {
      return { stateDescription: "not running" };
    },
  },
});
