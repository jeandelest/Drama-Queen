import { useEffect, useReducer } from "react";
import * as loadingData from "core/usecases/loadingData";
import CircularProgress from "@mui/material/CircularProgress"
import LinearProgress from '@mui/material/LinearProgress';
import { selectors, useCoreState, useCoreFunctions, useCoreEvts } from "core";
import { assert } from "tsafe/assert"
import { useEvt } from "evt/hooks"

export function LoadingData() {

    /*
    const { isRunning } = useCoreState(selectors.loadingData.isRunning);
    const { nomenclatureProgress } = useCoreState(selectors.loadingData.nomenclatureProgress);
    const { surveyProgress } = useCoreState(selectors.loadingData.surveyProgress);
    const { surveyUnitProgress } = useCoreState(selectors.loadingData.surveyUnitProgress);
    */

    const loadingDataState = useCoreState(state=> state.loadingData);

    const { loadingData } = useCoreFunctions();

    useEffect(
        () => {
            loadingData.start();
        },
        []
    );

    const { evtLoadingData } = useCoreEvts();

    useEvt(
        ctx=> {

            evtLoadingData.$attach(
                data => data.action === "redirect" ? [data.url] : null,
                ctx,
                url => {
                    alert("redirect to " + url)
                }
            );

        },
        []
    );

    /*
    if (!isRunning) {
        return null;
    }

    assert(nomenclatureProgress !== undefined);
    assert(surveyProgress !== undefined);
    assert(surveyUnitProgress !== undefined);
    */

    if( loadingDataState.stateDescription !== "running"){
        return null;
    }

    const { nomenclatureProgress, surveyProgress, surveyUnitProgress } = loadingDataState;

    return (
        <div>
            <CircularProgress />
            <LinearProgress variant="determinate" value={nomenclatureProgress} />
            <br />
            <LinearProgress variant="determinate" value={surveyProgress} />
            <br />
            <LinearProgress variant="determinate" value={surveyUnitProgress} />
            <br />
        </div>

    )
}