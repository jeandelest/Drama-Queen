import { useEffect, useReducer } from "react";
import * as loadingData from "core/usecases/loadingData";
import CircularProgress from "@mui/material/CircularProgress"
import LinearProgress from '@mui/material/LinearProgress';
import { useLoadingDataState, useRegisterLoadingDataAction, loadingDataFunctions } from "core";

export function LoadingData() {

    useEffect(
        () => {
            loadingDataFunctions.start();
        },
        []
    );

    useRegisterLoadingDataAction({
        "redirect": ({ url }) => {
            alert("redirect to " + url)
        }
    });

    const loadingDataState = useLoadingDataState();

    if (loadingDataState.stateDescription === "not running") {
        return null;
    }

    return (
        <div>
            <CircularProgress />
            <LinearProgress variant="determinate" value={loadingDataState.nomenclatureProgress} />
            <br />
            <LinearProgress variant="determinate" value={loadingDataState.surveyProgress} />
            <br />
            <LinearProgress variant="determinate" value={loadingDataState.surveyUnitProgress} />
            <br />
        </div>

    )
}