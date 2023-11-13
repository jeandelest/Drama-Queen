import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress"
import LinearProgress from '@mui/material/LinearProgress';
import { useCoreState, useCoreFunctions, useCoreEvts } from "core";
import { useEvt } from "evt/hooks"

export function LoadingData() {
    const synchronizeDataState = useCoreState(state => state.synchronizeData);

    const { synchronizeData } = useCoreFunctions();

    useEffect(
        () => {
            synchronizeData.start();
        },
        []
    );

    const { evtSynchronizeData } = useCoreEvts();

    useEvt(
        ctx => {
            evtSynchronizeData.$attach(
                data => data.action === "redirect" ? [data] : null,
                ctx,
                () => {
                    alert("redirect to " + window.location.href)
                }
            );
        },
        []
    );

    if (synchronizeDataState.stateDescription !== "running") {
        return null;
    }

    const { nomenclatureProgress, surveyProgress, surveyUnitProgress } = synchronizeDataState;

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