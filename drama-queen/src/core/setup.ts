
import { createCoreFromUsecases } from "redux-clean-architecture";
import type { GenericCreateEvt, GenericThunks } from "redux-clean-architecture";
import { createApiClient } from "./queenApi/createApiClient";
import { createKeycloakClient } from "./keycloakClient/createKeycloakClient";
import { usecases } from "./usecases";

type CoreParams = {
    apiUrl: string;
    keycloakParams: {
        url: string;
        clientId: string;
        realm: string;
        origin?: string;
    };
    redirectUrl: string;
};

export async function createCore(params: CoreParams) {

    const { apiUrl, keycloakParams } = params;

    const oidc = await createKeycloakClient(keycloakParams);

    const queenApi = createApiClient({
        apiUrl,
        "getAccessToken": !oidc.isUserLoggedIn ?
            (() => null) :
            (() => oidc.getAccessToken())
    });

    const core = createCoreFromUsecases({
        "thunksExtraArgument": {
            "coreParams": params,
            oidc,
            queenApi
        },
        usecases
    });

    return core;
}

type Core = Awaited<ReturnType<typeof createCore>>;

export type State = ReturnType<Core["getState"]>;

export type Thunks = GenericThunks<Core>;

export type CreateEvt = GenericCreateEvt<Core>;