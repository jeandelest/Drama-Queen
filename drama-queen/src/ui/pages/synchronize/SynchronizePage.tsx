import { useEffect, Fragment } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useCoreState, useCoreFunctions, useCoreEvts, selectors } from "core";
import { useEvt } from "evt/hooks"
import { tss } from "tss-react/mui";
import { useTranslate } from "hooks/useTranslate";

export function SynchronizePage() {
    const { __ } = useTranslate();
    const { classes } = useStyles();

    /* refactor this when redux-clean-archi updated */
    const { isRunning: showProgress } = useCoreState(selectors.synchronizeData.isRunning);
    const { uploadProgress } = useCoreState(selectors.synchronizeData.uploadProgress)
    const { nomenclatureProgress } = useCoreState(selectors.synchronizeData.nomenclatureProgress);
    const { surveyProgress } = useCoreState(selectors.synchronizeData.surveyProgress);
    const { surveyUnitProgress } = useCoreState(selectors.synchronizeData.surveyUnitProgress)

    const { synchronizeData } = useCoreFunctions();

    useEffect(
        () => {
            synchronizeData.startDownloading();
        }, []
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

    if (!showProgress) {
        return null;
    }



    if (uploadProgress) {
        return <>Uploading {uploadProgress}</>
    }

    const progressBars = [{
        progress: surveyProgress,
        label: __('sync.surveyUnits')
    },
    {
        progress: nomenclatureProgress,
        label: __('sync.nomenclatures')
    },
    {
        progress: surveyUnitProgress,
        label: __('sync.questionnaires')
    }]
        .filter(bar => bar.progress !== null)
    return (
        <>
            <Stack spacing={1} alignItems="center">
                <Typography variant="h3" fontWeight="bold">{__('sync.progress')}</Typography>
                <Typography variant="h6" className={classes.lightText}>{__('sync.download')}</Typography>
            </Stack>
            <Stack spacing={2}>
                {progressBars.map(bar =>
                    <Fragment key={bar.label}>
                        <Stack spacing={1}>
                            <Typography variant="body2" fontWeight="bold"
                                className={classes.lightText}>{bar.label}</Typography>
                            <LinearProgress variant="determinate" value={bar.progress}
                                className={classes.progressBar} />
                        </Stack>
                    </Fragment>)}
            </Stack>
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
