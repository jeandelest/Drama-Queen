import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress"
import LinearProgress from '@mui/material/LinearProgress';
import { useCoreState, useCoreFunctions, useCoreEvts } from "core";
import { useEvt } from "evt/hooks"

export function LoadingData() {
    const loadingDataState = useCoreState(state => state.loadingData);

    const { loadingData } = useCoreFunctions();

    useEffect(
        () => {
            loadingData.start();
        },
        []
    );

    const { evtLoadingData } = useCoreEvts();

    useEvt(
        ctx => {
            evtLoadingData.$attach(
                data => data.action === "redirect" ? [data] : null,
                ctx,
                () => {
                    alert("redirect to " + window.location.href)
                }
            );
        },
        []
    );

    if (loadingDataState.stateDescription !== "running") {
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