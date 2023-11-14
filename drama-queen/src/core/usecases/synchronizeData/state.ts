import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe";

export type State = State.NotRunning | State.Uploading | State.Downloading;

export namespace State {
  export type NotRunning = {
    stateDescription: "not running";
  };

  export type Uploading = {
    stateDescription: "uploading";
    uploadProgress: number;
  };

  export type Downloading = {
    stateDescription: "downloading";
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
    progressUploading: (
      _state,
      {
        payload,
      }: PayloadAction<{
        uploadProgress: number;
      }>
    ) => {
      const { uploadProgress } = payload;
      return {
        stateDescription: "uploading",
        uploadProgress,
      };
    },
    progressDownloading: (
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
        stateDescription: "downloading",
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
