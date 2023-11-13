import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe";

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

export const name = "synchronizeData";

export const { reducer, actions } = createSlice({
  name,
  initialState: id<State>(
    id<State.NotRunning>({
      stateDescription: "not running",
    })
  ),
  reducers: {
    progressUpdated: (
      _state,
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
    completed: (_state) => {
      return { stateDescription: "not running" };
    },
  },
});
