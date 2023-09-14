
import { useReducer, useEffect, useState } from "react";
import * as loadingData from "./usecases/loadingData";
import { useEvent } from "ui/tools/useEvent";
import { CoreParams, initializeCore as initializeCore_vanilla } from "./core";

export function useLoadingDataState(): loadingData.State {

    const [, forceUpdate] = useReducer(() => ({}), {})

    useEffect(
        () => {

            const handler = () => {
                forceUpdate()
            };

            loadingData.$stateUpdated.attach(handler);

            return () => {
                loadingData.$stateUpdated.detach(handler);
            };

        },
        []
    );

    return loadingData.state;

}

export function useRegisterLoadingDataAction(
    params: {
        redirect: (params: {url: string; })=> void;
    }
){


    const constRedirect = useEvent(params.redirect);

    useEffect(
        () => {

            const handler = (params: { action: "redirect"; url: string; }) => {
                if (params.action === "redirect") {
                    constRedirect({ "url": params.url });
                }
            };

            loadingData.$action.attach(handler);

            return () => {
                loadingData.$action.detach(handler);
            };

        },
        []
    );

}

export const loadingDataFunctions = loadingData.functions;


export function initializeCore(
    params: CoreParams
) {

    const prCoreInitialized = initializeCore_vanilla(params);

    function CoreLoadingFallback(
        props: {
            children: React.ReactNode;
            fallback: React.ReactNode;
        }
    ) {


        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            prCoreInitialized.then(() => setIsReady(true));
        }, []);

        return (
            <>
                {!isReady ? props.fallback : props.children}
            </>
        );
    }

    return { CoreLoadingFallback };

}
