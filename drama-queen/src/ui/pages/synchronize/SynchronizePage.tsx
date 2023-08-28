import { LinearProgress, Stack, Typography } from "@mui/material";
import { useTranslate } from "hooks/useTranslate";
import preloader from './preloader.svg'
import { tss } from "tss-react/mui";
import { Fragment, useEffect, useState } from "react";
import { useSynchronize } from 'hooks/useSynchronize';
import type { SurveyUnitWithId } from "core/model/surveyUnit";
import { useAddSurveyUnit } from "hooks/queries/indexedDb/surveyUnit/surveyUnit";

type SyncState = "Idle" | "Upload" | "Download" | "Index";


export const SynchronizePage = () => {
    const { classes } = useStyles();
    const [state,] = useState<SyncState>("Index")
    return <Stack spacing={3} alignItems="center">
        <img src={preloader} alt="" className={classes.spinner} />
        {state === "Download" && <DownloadProgress />}
        {state === "Index" && <IndexProgress />}
    </Stack>;
}

const IndexProgress = () => {

    const testData = {
        "id": "23",
        "questionnaireId": "VQS2021X00",
        "personalization": {},
        "data": {
            "EXTERNAL": {},
            "COLLECTED": {
                "NOM": {
                    "EDITED": null,
                    "FORCED": null,
                    "INPUTED": null,
                    "PREVIOUS": null,
                    "COLLECTED": null
                },
            },
            "CALCULATED": {}
        },
        "comment": {},
        "stateData": {
            "state": "INIT",
            "date": 1685457465071,
            "currentPage": "19"
        }
    } satisfies SurveyUnitWithId

    const { mutateAsync } = useAddSurveyUnit(testData);

    useEffect(() => {
        mutateAsync()
    }, []);
    return <>Index</>
}
const DownloadProgress = () => {
    const { __ } = useTranslate();
    const { classes } = useStyles();
    const { progress, data, errors } = useSynchronize();
    console.log("data", data)
    console.log("errors", errors)
    const progressBars = [{
        progress: progress.surveyUnits,
        label: __('sync.surveyUnits')
    },
    {
        progress: progress.nomenclatures,
        label: __('sync.nomenclatures')
    },
    {
        progress: progress.questionnaires,
        label: __('sync.questionnaires')
    }]
        .filter(bar => bar.progress !== null)
    return <>
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
                        <LinearProgress variant="determinate" value={bar.progress! * 100}
                            className={classes.progressBar} />
                    </Stack>
                </Fragment>)}
        </Stack>
    </>
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
