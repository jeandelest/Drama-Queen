import { id } from "tsafe/id";
import { createEventEmitter, NonPostable } from "../tools/EventEmitter";
import type { QueenApi } from "../queenApi/QueenApi";
import type { Oidc } from "../keycloakClient/Oidc";
import { assert } from "tsafe/assert";


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

export const state: State = id<State.NotRunning>({
    "stateDescription": "not running"
});

const $stateUpdated_internal = createEventEmitter<void>();

export const $stateUpdated: NonPostable<void> = $stateUpdated_internal;

const reducers = {
    "updateProgresses": (params: {
        surveyUnitProgress: number;
        nomenclatureProgress: number;
        surveyProgress: number;
    }) => {

        const { nomenclatureProgress, surveyProgress, surveyUnitProgress } = params;

        Object.assign(state, id<State.Running>({
            "stateDescription": "running",
            surveyUnitProgress,
            nomenclatureProgress,
            surveyProgress
        }));
        $stateUpdated_internal.post();

    }
}

export const functions = {
    "start": async () => {

        if (id<State>(state).stateDescription === "running") {
            return;
        }

        const context = getContext();

        reducers.updateProgresses({
            "nomenclatureProgress": 0,
            "surveyProgress": 0,
            "surveyUnitProgress": 0
        });

        for (const progress of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            reducers.updateProgresses({
                "nomenclatureProgress": progress,
                "surveyProgress": progress,
                "surveyUnitProgress": progress
            });
        }

        $action.post({
            "action": "redirect",
            "url": window.document.location.origin
        });

    }
}

const { getContext, setContext } = (() => {

    type Context = {
        queenApi: QueenApi;
        oidc: Oidc;
    };

    let context: Context | undefined = undefined;

    function getContext() {
        assert(context !== undefined, "not initialized");
        return context;
    }

    function setContext(context_: Context) {
        context = context_;
    }

    return {
        getContext,
        setContext
    };
})();

export { setContext };


export const $action = createEventEmitter<{
    action: "redirect";
    url: string;
}>();


