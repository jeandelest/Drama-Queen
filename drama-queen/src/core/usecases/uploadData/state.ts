import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe";

export type State = State.NotRunning | State.Uploading;

export namespace State {
  export type NotRunning = {
    stateDescription: "not running";
  };

  export type Uploading = {
    stateDescription: "running";
    uploadProgress: number;
  };
}

export const name = "uploadData";

export const { reducer, actions } = createSlice({
  name,
  initialState: id<State>(
    id<State.NotRunning>({
      stateDescription: "not running",
    })
  ),
  reducers: {
    progress: (
      _state,
      {
        payload,
      }: PayloadAction<{
        uploadProgress: number;
      }>
    ) => {
      const { uploadProgress } = payload;
      return {
        stateDescription: "running",
        uploadProgress,
      };
    },
    completed: (_state) => {
      return { stateDescription: "not running" };
    },
  },
});
