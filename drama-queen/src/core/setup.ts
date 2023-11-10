import { createCoreFromUsecases } from "redux-clean-architecture";
import type { GenericCreateEvt, GenericThunks } from "redux-clean-architecture";
import { usecases } from "./usecases";

type CoreParams = {
  apiUrl: string;
  publicUrl: string;
  oidcParams:
    | {
        issuerUri: string;
        clientId: string;
      }
    | undefined;
};

export async function createCore(params: CoreParams) {
  const { apiUrl, publicUrl, oidcParams } = params;

  const oidc = await (async () => {
    if (oidcParams === undefined) {
      const { createOidc } = await import("core/adapters/oidc/mock");
      return createOidc({ isUserLoggedIn: false });
    }
    const { createOidc } = await import("core/adapters/oidc/default");
    return createOidc({
      issuerUri: oidcParams.issuerUri,
      clientId: oidcParams.clientId,
      publicUrl: publicUrl,
    });
  })();

  const queenApi = await (async () => {
    if (apiUrl === "") {
      // When no apiUrl is provided, we use the mock
      const { createApiClient } = await import("core/adapters/queenApi/mock");
      return createApiClient();
    }

    const { createApiClient } = await import("core/adapters/queenApi/default");

    return createApiClient({
      apiUrl,
      getAccessToken: () => {
        if (oidc === undefined) {
          return undefined;
        }

        if (!oidc.isUserLoggedIn) {
          return undefined;
        }
        return oidc.getTokens().accessToken;
      },
    });
  })();

  const core = createCoreFromUsecases({
    thunksExtraArgument: {
      coreParams: params,
      oidc,
      queenApi,
    },
    usecases,
  });

  return core;
}

type Core = Awaited<ReturnType<typeof createCore>>;

export type State = ReturnType<Core["getState"]>;

export type Thunks = GenericThunks<Core>;

export type CreateEvt = GenericCreateEvt<Core>;
