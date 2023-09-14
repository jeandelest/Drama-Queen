
import { createApiClient } from "./queenApi/createApiClient";
import { createKeycloakClient } from "./keycloakClient/createKeycloakClient";

import * as loadingDataUsecase from "./usecases/loadingData";

export type CoreParams = {
    apiUrl: string;
    keycloakParams: {
        url: string;
        clientId: string;
        realm: string;
        origin?: string;
    }
};

export async function initializeCore(params: CoreParams) {

    const { apiUrl, keycloakParams } = params;

    const oidc = await createKeycloakClient(keycloakParams);

    const queenApi = await createApiClient({
        apiUrl,
        "getAccessToken": !oidc.isUserLoggedIn ? 
            (() => null) : 
            (() => oidc.getAccessToken())
    });

    loadingDataUsecase.setContext({
        oidc,
        queenApi
    });

}