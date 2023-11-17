import { useEffect, Fragment } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useCoreState, useCoreFunctions, useCoreEvts, selectors } from "core";
import { useEvt } from "evt/hooks"
import { tss } from "tss-react/mui";
import { useTranslate } from "hooks/useTranslate";
import { LoadingDisplay } from "./LoadingDisplay";

export function UploadData() {
    const { __ } = useTranslate();
    const { classes } = useStyles();

    /* refactor this when redux-clean-archi updated */
    const { isRunning: showProgress } = useCoreState(selectors.uploadData.isRunning);
    const { uploadProgress } = useCoreState(selectors.uploadData.uploadProgress);

    const { uploadData } = useCoreFunctions();

    useEffect(
        () => {
            uploadData.start();
        }, []
    );

    const { evtUploadData } = useCoreEvts();

    useEvt(
        ctx => {
            evtUploadData.$attach(
                data => data.action === "redirect" ? [data] : null,
                ctx,
                () => {
                    console.log("redirect to " + window.location.href)
                }
            );
        },
        []
    );

    if (!showProgress) {
        return null;
    }

    const progressBars = [{
        progress: uploadProgress,
    }]
        .filter(bar => bar.progress !== null)
    return (
        <>
            <LoadingDisplay progressBars={progressBars} syncStepTitle={__("sync.upload")} />
        </>

    )
}


const useStyles = tss
    .create(() => ({
        lightText: {
            opacity: .75,
        },
        spinner: {
            width: 200,
            height: 200
        },
        progressBar: {
            maxWidth: 700,
            width: '80vw',
            height: 10,
            borderRadius: 10
        }
    }));
